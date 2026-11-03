import { isRecord } from "../json.js";
import { validateCase } from "../validation/case.js";
import { prepareCaseStep } from "./prepare.js";
import type {
  ExpandedCaseStep,
  ExpandCaseSharedStepsOptions,
  ExpandCaseSharedStepsResult,
  PrepareCaseSharedStepsOptions,
  PrepareCaseSharedStepsResult,
  VariableDefinition,
} from "./types.js";

interface IndexedSharedSteps {
  id: string;
  steps: readonly Readonly<Record<string, unknown>>[];
}

function getCaseVariables(caseFile: Readonly<Record<string, unknown>>): Readonly<Record<string, VariableDefinition>> | undefined {
  return isRecord(caseFile.variables)
    ? caseFile.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
}

function getSharedSteps(sharedSteps: Readonly<Record<string, readonly Readonly<Record<string, unknown>>[]>>): Map<string, IndexedSharedSteps> {
  return new Map(Object.entries(sharedSteps).map(([id, steps]) => [id, { id, steps }]));
}

function expansionFailure(
  path: string,
  reason: "invalidCaseSteps" | "nestedSharedSteps" | "unknownSharedSteps",
  message: string,
): ExpandCaseSharedStepsResult {
  return { expanded: false, path, reason, message };
}

export function expandCaseSharedSteps(options: ExpandCaseSharedStepsOptions): ExpandCaseSharedStepsResult {
  if (!Array.isArray(options.case.steps)) {
    return expansionFailure(
      "/steps",
      "invalidCaseSteps",
      "Case steps must be an array before expanding shared-step calls.",
    );
  }
  const groups = getSharedSteps(options.sharedSteps);
  const steps: ExpandedCaseStep[] = [];
  for (const [caseStepIndex, step] of options.case.steps.entries()) {
    if (!isRecord(step)) {
      return expansionFailure(
        `/steps/${caseStepIndex}`,
        "invalidCaseSteps",
        "Case steps must be objects before expanding shared-step calls.",
      );
    }
    if (step.action !== "sharedSteps") {
      steps.push({ caseStepIndex, step: structuredClone(step) });
      continue;
    }
    if (typeof step.id !== "string") {
      return expansionFailure(
        `/steps/${caseStepIndex}/id`,
        "unknownSharedSteps",
        "A shared-step call must name a shared-step group.",
      );
    }
    const group = groups.get(step.id);
    if (group === undefined) {
      return expansionFailure(
        `/steps/${caseStepIndex}/id`,
        "unknownSharedSteps",
        `No shared steps named "${step.id}" are available in this plan.`,
      );
    }
    for (const [sharedStepIndex, sharedStep] of group.steps.entries()) {
      if (sharedStep.action === "sharedSteps") {
        return expansionFailure(
          `/sharedSteps/${group.id}/${sharedStepIndex}/action`,
          "nestedSharedSteps",
          "Shared steps cannot call other shared steps.",
        );
      }
      steps.push({
        caseStepIndex,
        sharedStepId: group.id,
        sharedStepIndex,
        step: structuredClone(sharedStep),
      });
    }
  }
  return { expanded: true, steps };
}

function getSourcePath(expandedStep: ExpandedCaseStep): string {
  return expandedStep.sharedStepId === undefined
    ? `/steps/${expandedStep.caseStepIndex}`
    : `/sharedSteps/${expandedStep.sharedStepId}/${expandedStep.sharedStepIndex ?? 0}`;
}

function prepareFailurePath(expandedStep: ExpandedCaseStep, path: string): string {
  return path.replace(/^\/steps\/\d+/, getSourcePath(expandedStep));
}

export function prepareCaseSharedSteps(options: PrepareCaseSharedStepsOptions): PrepareCaseSharedStepsResult {
  const expanded = expandCaseSharedSteps(options);
  if (!expanded.expanded) {
    return {
      prepared: false,
      path: expanded.path,
      reason: expanded.reason,
      message: expanded.message,
    };
  }
  const caseVariables = getCaseVariables(options.case);
  const steps: ExpandedCaseStep[] = [];
  const protectedValues: string[] = [];
  for (const expandedStep of expanded.steps) {
    const result = prepareCaseStep({
      step: expandedStep.step,
      stepIndex: expandedStep.sharedStepIndex ?? expandedStep.caseStepIndex,
      locale: options.locale,
      ...(options.environment === undefined ? {} : { environment: options.environment }),
      ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
      ...(caseVariables === undefined ? {} : { caseVariables }),
      ...(options.dataSetVariables === undefined ? {} : { dataSetVariables: options.dataSetVariables }),
    });
    if (!result.prepared) {
      return {
        prepared: false,
        path: prepareFailurePath(expandedStep, result.path),
        reason: result.reason,
        message: result.message,
        caseStepIndex: expandedStep.caseStepIndex,
        ...(result.environmentVariable === undefined ? {} : { environmentVariable: result.environmentVariable }),
        ...(expandedStep.sharedStepId === undefined ? {} : { sharedStepId: expandedStep.sharedStepId }),
        ...(expandedStep.sharedStepIndex === undefined ? {} : { sharedStepIndex: expandedStep.sharedStepIndex }),
      };
    }
    steps.push({ ...expandedStep, step: result.step });
    protectedValues.push(...(result.protectedValues ?? []));
  }
  const caseFile: Record<string, unknown> = structuredClone(options.case);
  caseFile.steps = steps.map((expandedStep) => expandedStep.step);
  const validation = validateCase(caseFile);
  return validation.valid
    ? { prepared: true, case: caseFile, steps, ...(protectedValues.length === 0 ? {} : { protectedValues: [...new Set(protectedValues)] }) }
    : {
        prepared: false,
        path: "/",
        reason: "invalidPreparedCase",
        message: "Prepared shared steps do not satisfy the case schema.",
        issues: validation.issues,
      };
}
