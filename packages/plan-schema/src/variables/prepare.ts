import { escapeJsonPointerSegment, isRecord } from "../json.js";
import { validateCase } from "../validation/case.js";
import { resolveVariable } from "./resolve.js";
import type {
  PrepareCaseOptions,
  PrepareCaseResult,
  PrepareCaseStepOptions,
  PrepareCaseStepResult,
  VariableDefinition,
} from "./types.js";

type PreparedValueResult =
  | { prepared: true; value: unknown }
  | { prepared: false; path: string; reason: "invalidLocale" | "missingVariable"; message: string };

function isVariableReference(value: unknown): value is { var: string } {
  return isRecord(value) && typeof value.var === "string" && Object.keys(value).length === 1;
}

function prepareTextValue(
  value: unknown,
  path: string,
  options: PrepareCaseStepOptions,
  stepVariables: Readonly<Record<string, VariableDefinition>> | undefined,
): PreparedValueResult {
  if (!isVariableReference(value)) {
    return { prepared: true, value };
  }
  const result = resolveVariable({
    name: value.var,
    locale: options.locale,
    ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
    ...(options.caseVariables === undefined ? {} : { caseVariables: options.caseVariables }),
    ...(stepVariables === undefined ? {} : { stepVariables }),
  });
  return result.resolved
    ? { prepared: true, value: String(result.value) }
    : { prepared: false, path, reason: result.reason, message: result.message };
}

function prepareExpectedValue(
  expected: Record<string, unknown>,
  path: string,
  options: PrepareCaseStepOptions,
  stepVariables: Readonly<Record<string, VariableDefinition>> | undefined,
): PreparedValueResult {
  let canonicalLocale: string;
  try {
    canonicalLocale = Intl.getCanonicalLocales(options.locale)[0] ?? options.locale;
  } catch {
    return {
      prepared: false,
      path,
      reason: "invalidLocale",
      message: "Locale must be a well-formed BCP 47 language tag, such as en-CA.",
    };
  }
  let selected = expected.default;
  let selectedPath = `${path}/default`;
  if (isRecord(expected.locales)) {
    for (const [locale, value] of Object.entries(expected.locales)) {
      if (Intl.getCanonicalLocales(locale)[0] === canonicalLocale) {
        selected = value;
        selectedPath = `${path}/locales/${escapeJsonPointerSegment(locale)}`;
        break;
      }
    }
  }
  const result = prepareTextValue(selected, selectedPath, options, stepVariables);
  return result.prepared
    ? { prepared: true, value: { default: result.value } }
    : result;
}

export function prepareCaseStep(options: PrepareCaseStepOptions): PrepareCaseStepResult {
  const prepared: Record<string, unknown> = structuredClone(options.step);
  const stepVariables = isRecord(options.step.variables)
    ? options.step.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
  const path = `/steps/${options.stepIndex}`;
  const action = options.step.action;
  const fields = action === "navigate"
    ? ["url"]
    : action === "type"
      ? ["text"]
      : action === "fill"
        ? ["value"]
        : action === "selectOption"
          ? ["value", "label"]
          : [];
  for (const field of fields) {
    if (!(field in options.step)) {
      continue;
    }
    const result = prepareTextValue(options.step[field], `${path}/${field}`, options, stepVariables);
    if (!result.prepared) {
      return result;
    }
    prepared[field] = result.value;
  }
  for (const field of ["expected", "associatedLabel"]) {
    const expected = options.step[field];
    if (!isRecord(expected)) {
      continue;
    }
    const result = prepareExpectedValue(expected, `${path}/${field}`, options, stepVariables);
    if (!result.prepared) {
      return result;
    }
    prepared[field] = result.value;
  }
  return { prepared: true, step: prepared };
}

export function prepareCase(options: PrepareCaseOptions): PrepareCaseResult {
  const prepared: Record<string, unknown> = structuredClone(options.case);
  if (!Array.isArray(prepared.steps)) {
    return {
      prepared: false,
      path: "/steps",
      reason: "invalidPreparedCase",
      message: "Case steps must be an array before preparing variable references.",
    };
  }
  const caseVariables = isRecord(options.case.variables)
    ? options.case.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
  for (const [stepIndex, step] of prepared.steps.entries()) {
    if (!isRecord(step)) {
      return {
        prepared: false,
        path: `/steps/${stepIndex}`,
        reason: "invalidPreparedCase",
        message: "Case steps must be objects before preparing variable references.",
      };
    }
    const result = prepareCaseStep({
      step,
      stepIndex,
      locale: options.locale,
      ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
      ...(caseVariables === undefined ? {} : { caseVariables }),
    });
    if (!result.prepared) {
      return result;
    }
    prepared.steps[stepIndex] = result.step;
  }
  const validation = validateCase(prepared);
  return validation.valid
    ? { prepared: true, case: prepared }
    : {
        prepared: false,
        path: "/",
        reason: "invalidPreparedCase",
        message: "Prepared case does not satisfy the case schema.",
        issues: validation.issues,
      };
}
