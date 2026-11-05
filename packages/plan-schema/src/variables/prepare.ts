import { escapeJsonPointerSegment, isRecord } from "../json.js";
import { validateCase } from "../validation/case.js";
import { resolveVariable } from "./resolve.js";
import { resolveEnvironmentValue } from "./environment.js";
import type {
  PrepareCaseOptions,
  PrepareCaseResult,
  PrepareCaseStepOptions,
  PrepareCaseStepResult,
  ProtectedVariableValue,
  VariableDefinition,
} from "./types.js";

type PreparedValueResult =
  | { prepared: true; value: unknown; protectedValues?: string[] }
  | { prepared: false; path: string; reason: "invalidLocale" | "missingVariable" | "unresolvedProtectedValue"; message: string; environmentVariable?: string };

/*
Checks whether a value is a whole-field variable reference.
---
Inputs: Any value.
---
Output: True for a valid variable reference.
*/
function isVariableReference(value: unknown): value is { var: string } {
  return isRecord(value) && typeof value.var === "string" && Object.keys(value).length === 1;
}

/*
Checks whether a value refers to an environment variable.
---
Inputs: Any value.
---
Output: True for a protected-value reference.
*/
function isProtectedVariableValue(value: unknown): value is ProtectedVariableValue {
  return isRecord(value) && typeof value.env === "string" && Object.keys(value).length === 1;
}

/*
Resolves a value used in a text action.
---
Inputs: Value, path, and preparation options.
---
Output: Prepared text or a failure.
*/
function prepareTextValue(options: {
  value: unknown;
  path: string;
  preparation: PrepareCaseStepOptions;
  stepVariables: Readonly<Record<string, VariableDefinition>> | undefined;
}): PreparedValueResult {
  if (!isVariableReference(options.value)) {
    return { prepared: true, value: options.value };
  }
  const result = resolveVariable({
    name: options.value.var,
    locale: options.preparation.locale,
    ...(options.preparation.planVariables === undefined
      ? {}
      : { planVariables: options.preparation.planVariables }),
    ...(options.preparation.caseVariables === undefined
      ? {}
      : { caseVariables: options.preparation.caseVariables }),
    ...(options.stepVariables === undefined ? {} : { stepVariables: options.stepVariables }),
    ...(options.preparation.dataSetVariables === undefined
      ? {}
      : { dataSetVariables: options.preparation.dataSetVariables }),
  });
  if (!result.resolved) {
    return { prepared: false, path: options.path, reason: result.reason, message: result.message };
  }
  if (isProtectedVariableValue(result.value)) {
    if (options.preparation.environment !== undefined) {
      const environmentResult = resolveEnvironmentValue({
        value: result.value,
        environment: options.preparation.environment,
      });
      return environmentResult.resolved
        ? { prepared: true, value: environmentResult.value, protectedValues: [environmentResult.value] }
        : {
            prepared: false,
            path: options.path,
            reason: "unresolvedProtectedValue",
            message: environmentResult.message,
            environmentVariable: environmentResult.environmentVariable,
          };
    }
    return {
      prepared: false,
      path: options.path,
      reason: "unresolvedProtectedValue",
      message: `Protected environment variable "${result.value.env}" must be resolved before preparing execution values.`,
      environmentVariable: result.value.env,
    };
  }
  return { prepared: true, value: String(result.value) };
}

/*
Resolves an assertion expected-value definition.
---
Inputs: Expected value, path, and preparation options.
---
Output: Prepared expected value or a failure.
*/
function prepareExpectedValue(options: {
  expected: Record<string, unknown>;
  path: string;
  preparation: PrepareCaseStepOptions;
  stepVariables: Readonly<Record<string, VariableDefinition>> | undefined;
}): PreparedValueResult {
  let canonicalLocale: string;
  try {
    canonicalLocale = Intl.getCanonicalLocales(options.preparation.locale)[0] ?? options.preparation.locale;
  } catch {
    return {
      prepared: false,
      path: options.path,
      reason: "invalidLocale",
      message: "Locale must be a well-formed BCP 47 language tag, such as en-CA.",
    };
  }
  let selected = options.expected.default;
  let selectedPath = `${options.path}/default`;
  if (isRecord(options.expected.locales)) {
    for (const [locale, value] of Object.entries(options.expected.locales)) {
      if (Intl.getCanonicalLocales(locale)[0] === canonicalLocale) {
        selected = value;
        selectedPath = `${options.path}/locales/${escapeJsonPointerSegment(locale)}`;
        break;
      }
    }
  }
  const result = prepareTextValue({
    value: selected,
    path: selectedPath,
    preparation: options.preparation,
    stepVariables: options.stepVariables,
  });
  return result.prepared
    ? { prepared: true, value: { default: result.value }, ...(result.protectedValues === undefined ? {} : { protectedValues: result.protectedValues }) }
    : result;
}

/*
Prepares one case step before browser work starts.
---
Inputs: Step and preparation options.
---
Output: Prepared step or a failure.
*/
export function prepareCaseStep(options: PrepareCaseStepOptions): PrepareCaseStepResult {
  const prepared: Record<string, unknown> = structuredClone(options.step);
  const stepVariables = isRecord(options.step.variables)
    ? options.step.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
  const path = `/steps/${options.stepIndex}`;
  const protectedValues: string[] = [];
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
    const result = prepareTextValue({
      value: options.step[field],
      path: `${path}/${field}`,
      preparation: options,
      stepVariables,
    });
    if (!result.prepared) {
      return result;
    }
    prepared[field] = result.value;
    protectedValues.push(...(result.protectedValues ?? []));
  }
  for (const field of ["expected", "associatedLabel"]) {
    const expected = options.step[field];
    if (!isRecord(expected)) {
      continue;
    }
    const result = prepareExpectedValue({
      expected,
      path: `${path}/${field}`,
      preparation: options,
      stepVariables,
    });
    if (!result.prepared) {
      return result;
    }
    prepared[field] = result.value;
    protectedValues.push(...(result.protectedValues ?? []));
  }
  return { prepared: true, step: prepared, ...(protectedValues.length === 0 ? {} : { protectedValues }) };
}

/*
Prepares every step in one case.
---
Inputs: Case-preparation options.
---
Output: Prepared case or a failure.
*/
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
  const protectedValues: string[] = [];
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
      ...(options.environment === undefined ? {} : { environment: options.environment }),
      ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
      ...(caseVariables === undefined ? {} : { caseVariables }),
      ...(options.dataSetVariables === undefined ? {} : { dataSetVariables: options.dataSetVariables }),
    });
    if (!result.prepared) {
      return result;
    }
    prepared.steps[stepIndex] = result.step;
    protectedValues.push(...(result.protectedValues ?? []));
  }
  const validation = validateCase(prepared);
  return validation.valid
    ? { prepared: true, case: prepared, ...(protectedValues.length === 0 ? {} : { protectedValues: [...new Set(protectedValues)] }) }
    : {
        prepared: false,
        path: "/",
        reason: "invalidPreparedCase",
        message: "Prepared case does not satisfy the case schema.",
        issues: validation.issues,
      };
}
