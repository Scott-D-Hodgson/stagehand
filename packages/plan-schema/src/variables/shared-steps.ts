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

/*
Reads ordinary variable definitions from a case.
---
Inputs: A case value.
---
Output: Case variables or nothing.
*/
function getCaseVariables(caseFile: Readonly<Record<string, unknown>>): Readonly<Record<string, VariableDefinition>> | undefined {
  return isRecord(caseFile.variables)
    ? caseFile.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
}

/*
Indexes shared-step groups by their IDs.
---
Inputs: Shared-step definitions.
---
Output: A map for fast lookup.
*/
function getSharedSteps(sharedSteps: Readonly<Record<string, readonly Readonly<Record<string, unknown>>[]>>): Map<string, IndexedSharedSteps> {
  return new Map(Object.entries(sharedSteps).map(([id, steps]) => [id, { id, steps }]));
}

/*
Builds one shared-step expansion failure.
---
Inputs: Failure location, reason, and message.
---
Output: A failed expansion result.
*/
function expansionFailure(options: {
  path: string;
  reason: "invalidCaseSteps" | "nestedSharedSteps" | "unknownSharedSteps";
  message: string;
}): ExpandCaseSharedStepsResult {
  return { expanded: false, ...options };
}

/*
Replaces shared-step calls with their ordinary steps.
---
Inputs: Case and shared-step options.
---
Output: Expanded steps or a failure.
*/
export function expandCaseSharedSteps(options: ExpandCaseSharedStepsOptions): ExpandCaseSharedStepsResult {
  if (!Array.isArray(options.case.steps)) {
    return expansionFailure({
      path: "/steps",
      reason: "invalidCaseSteps",
      message: "Case steps must be an array before expanding shared-step calls.",
    });
  }
  const groups = getSharedSteps(options.sharedSteps);
  const steps: ExpandedCaseStep[] = [];
  for (const [caseStepIndex, step] of options.case.steps.entries()) {
    if (!isRecord(step)) {
      return expansionFailure({
        path: `/steps/${caseStepIndex}`,
        reason: "invalidCaseSteps",
        message: "Case steps must be objects before expanding shared-step calls.",
      });
    }
    if (step.action !== "sharedSteps") {
      steps.push({ caseStepIndex, step: structuredClone(step) });
      continue;
    }
    if (typeof step.id !== "string") {
      return expansionFailure({
        path: `/steps/${caseStepIndex}/id`,
        reason: "unknownSharedSteps",
        message: "A shared-step call must name a shared-step group.",
      });
    }
    const group = groups.get(step.id);
    if (group === undefined) {
      return expansionFailure({
        path: `/steps/${caseStepIndex}/id`,
        reason: "unknownSharedSteps",
        message: `No shared steps named "${step.id}" are available in this plan.`,
      });
    }
    for (const [sharedStepIndex, sharedStep] of group.steps.entries()) {
      if (sharedStep.action === "sharedSteps") {
        return expansionFailure({
          path: `/sharedSteps/${group.id}/${sharedStepIndex}/action`,
          reason: "nestedSharedSteps",
          message: "Shared steps cannot call other shared steps.",
        });
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

/*
Finds the original path for an expanded step.
---
Inputs: An expanded step.
---
Output: Its source JSON Pointer path.
*/
function getSourcePath(expandedStep: ExpandedCaseStep): string {
  return expandedStep.sharedStepId === undefined
    ? `/steps/${expandedStep.caseStepIndex}`
    : `/sharedSteps/${expandedStep.sharedStepId}/${expandedStep.sharedStepIndex ?? 0}`;
}

/*
Builds the path for a failed prepared expanded step.
---
Inputs: An expanded step and inner path.
---
Output: A source JSON Pointer path.
*/
function prepareFailurePath(expandedStep: ExpandedCaseStep, path: string): string {
  return path.replace(/^\/steps\/\d+/, getSourcePath(expandedStep));
}

/*
Expands shared steps and resolves their variables.
---
Inputs: Case-preparation options.
---
Output: Prepared case data or a failure.
*/
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
