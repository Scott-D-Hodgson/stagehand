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

interface IndexedSharedStepGroup {
  id: string;
  index: number;
  steps: readonly Readonly<Record<string, unknown>>[];
}

function getCaseVariables(caseFile: Readonly<Record<string, unknown>>): Readonly<Record<string, VariableDefinition>> | undefined {
  return isRecord(caseFile.variables)
    ? caseFile.variables as Readonly<Record<string, VariableDefinition>>
    : undefined;
}

function getSharedStepGroups(
  sharedStepGroups: readonly { id: string; steps: readonly Readonly<Record<string, unknown>>[] }[],
): Map<string, IndexedSharedStepGroup> {
  return new Map(sharedStepGroups.map((group, index) => [group.id, { ...group, index }]));
}

function expansionFailure(
  path: string,
  reason: "invalidCaseSteps" | "nestedSharedStepCall" | "unknownSharedStepGroup",
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
  const groups = getSharedStepGroups(options.sharedStepGroups);
  const steps: ExpandedCaseStep[] = [];
  for (const [caseStepIndex, step] of options.case.steps.entries()) {
    if (!isRecord(step)) {
      return expansionFailure(
        `/steps/${caseStepIndex}`,
        "invalidCaseSteps",
        "Case steps must be objects before expanding shared-step calls.",
      );
    }
    if (step.action !== "callSharedSteps") {
      steps.push({ caseStepIndex, step: structuredClone(step) });
      continue;
    }
    if (typeof step.id !== "string") {
      return expansionFailure(
        `/steps/${caseStepIndex}/id`,
        "unknownSharedStepGroup",
        "A shared-step call must name a shared-step group.",
      );
    }
    const group = groups.get(step.id);
    if (group === undefined) {
      return expansionFailure(
        `/steps/${caseStepIndex}/id`,
        "unknownSharedStepGroup",
        `No shared-step group named "${step.id}" is available in this plan.`,
      );
    }
    for (const [sharedStepIndex, sharedStep] of group.steps.entries()) {
      if (sharedStep.action === "callSharedSteps") {
        return expansionFailure(
          `/sharedStepGroups/${group.index}/steps/${sharedStepIndex}/action`,
          "nestedSharedStepCall",
          "A shared-step group cannot call another shared-step group.",
        );
      }
      steps.push({
        caseStepIndex,
        sharedStepGroupId: group.id,
        sharedStepGroupIndex: group.index,
        sharedStepIndex,
        step: structuredClone(sharedStep),
      });
    }
  }
  return { expanded: true, steps };
}

function getSourcePath(expandedStep: ExpandedCaseStep): string {
  return expandedStep.sharedStepGroupId === undefined
    ? `/steps/${expandedStep.caseStepIndex}`
    : `/sharedStepGroups/${expandedStep.sharedStepGroupIndex ?? 0}/steps/${expandedStep.sharedStepIndex ?? 0}`;
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
  for (const expandedStep of expanded.steps) {
    const result = prepareCaseStep({
      step: expandedStep.step,
      stepIndex: expandedStep.sharedStepIndex ?? expandedStep.caseStepIndex,
      locale: options.locale,
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
        ...(expandedStep.sharedStepGroupId === undefined ? {} : { sharedStepGroupId: expandedStep.sharedStepGroupId }),
        ...(expandedStep.sharedStepIndex === undefined ? {} : { sharedStepIndex: expandedStep.sharedStepIndex }),
      };
    }
    steps.push({ ...expandedStep, step: result.step });
  }
  const caseFile: Record<string, unknown> = structuredClone(options.case);
  caseFile.steps = steps.map((expandedStep) => expandedStep.step);
  const validation = validateCase(caseFile);
  return validation.valid
    ? { prepared: true, case: caseFile, steps }
    : {
        prepared: false,
        path: "/",
        reason: "invalidPreparedCase",
        message: "Prepared shared steps do not satisfy the case schema.",
        issues: validation.issues,
      };
}
