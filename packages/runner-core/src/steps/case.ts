import {
  prepareCaseSharedSteps,
  selectCaseDataSet,
  type NamedDataSet,
  type SharedSteps,
  type VariableDefinition,
} from "@stagehand/plan-schema";
import type { ExecutableStep } from "./types.js";
import type { CaseSettings } from "../browser/types.js";

export interface CaseExecutionOptions {
  case: Readonly<Record<string, unknown>>;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSets?: readonly NamedDataSet[];
  selectedDataSet?: string;
  sharedSteps?: SharedSteps;
  environment?: Readonly<Record<string, string | undefined>>;
}

export interface RunCaseSelection {
  case: Readonly<Record<string, unknown>>;
  selectedDataSet?: string;
  settings?: CaseSettings;
}

export interface RunPreparationOptions {
  cases: readonly RunCaseSelection[];
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSets?: readonly NamedDataSet[];
  sharedSteps?: SharedSteps;
  environment?: Readonly<Record<string, string | undefined>>;
}

export interface StepExecutionIdentity {
  caseStepIndex: number;
  sharedStepId?: string;
  sharedStepIndex?: number;
}

export class CasePreparationError extends Error {
  caseId: string;
  path: string;
  reason: "invalidCaseSteps" | "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "nestedSharedSteps" | "unknownDataSet" | "unknownSharedSteps" | "unresolvedProtectedValue";
  issues?: ReadonlyArray<{ path: string; keyword: string; message: string }>;
  environmentVariable?: string;
  caseStepIndex?: number;
  sharedStepId?: string;
  sharedStepIndex?: number;
  constructor(
    caseId: string,
    path: string,
    reason: "invalidCaseSteps" | "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "nestedSharedSteps" | "unknownDataSet" | "unknownSharedSteps" | "unresolvedProtectedValue",
    message: string,
    issues?: ReadonlyArray<{ path: string; keyword: string; message: string }>,
    identity?: StepExecutionIdentity,
    environmentVariable?: string,
  ) {
    super(`Case "${caseId}" could not be prepared at ${path}: ${message}`);
    this.name = "CasePreparationError";
    this.caseId = caseId;
    this.path = path;
    this.reason = reason;
    if (issues !== undefined) {
      this.issues = issues;
    }
    if (environmentVariable !== undefined) {
      this.environmentVariable = environmentVariable;
    }
    if (identity !== undefined) {
      this.caseStepIndex = identity.caseStepIndex;
      if (identity.sharedStepId !== undefined) {
        this.sharedStepId = identity.sharedStepId;
      }
      if (identity.sharedStepIndex !== undefined) {
        this.sharedStepIndex = identity.sharedStepIndex;
      }
    }
  }
}

export interface PreparedCaseExecution {
  caseId: string;
  steps: readonly ExecutableStep[];
  stepIdentities: readonly StepExecutionIdentity[];
  protectedValues: readonly string[];
  settings?: CaseSettings;
}

export interface PreparedRunExecution {
  cases: readonly PreparedCaseExecution[];
}

/*
Reads a case ID or supplies a safe fallback.
---
Inputs: A case value.
---
Output: Case ID string.
*/
function getCaseId(value: Readonly<Record<string, unknown>>): string {
  return typeof value.id === "string" ? value.id : "unknown";
}

/*
Prepares one case before browser work starts.
---
Inputs: Case options and locale.
---
Output: Prepared case execution data.
*/
export function prepareCaseForExecution(
  options: CaseExecutionOptions,
  locale: string,
): PreparedCaseExecution {
  const selection = selectCaseDataSet({
    case: options.case,
    dataSets: options.dataSets ?? [],
    ...(options.selectedDataSet === undefined ? {} : { selectedDataSet: options.selectedDataSet }),
  });
  if (!selection.selected) {
    throw new CasePreparationError(
      getCaseId(options.case),
      options.selectedDataSet === undefined ? "/dataSets/default" : "/dataSetSelection",
      selection.reason,
      selection.message,
    );
  }
  const prepared = prepareCaseSharedSteps({
    case: options.case,
    locale,
    sharedSteps: options.sharedSteps ?? {},
    ...(options.environment === undefined ? {} : { environment: options.environment }),
    ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
    ...(selection.variables === undefined ? {} : { dataSetVariables: selection.variables }),
  });
  if (!prepared.prepared) {
    throw new CasePreparationError(
      getCaseId(options.case),
      prepared.path,
      prepared.reason,
      prepared.message,
      prepared.issues,
      prepared.caseStepIndex === undefined
        ? undefined
        : {
            caseStepIndex: prepared.caseStepIndex,
            ...(prepared.sharedStepId === undefined ? {} : { sharedStepId: prepared.sharedStepId }),
            ...(prepared.sharedStepIndex === undefined ? {} : { sharedStepIndex: prepared.sharedStepIndex }),
          },
      prepared.environmentVariable,
    );
  }
  return {
    caseId: getCaseId(prepared.case),
    steps: prepared.case.steps as ExecutableStep[],
    protectedValues: prepared.protectedValues ?? [],
    stepIdentities: prepared.steps.map((step) => ({
      caseStepIndex: step.caseStepIndex,
      ...(step.sharedStepId === undefined ? {} : { sharedStepId: step.sharedStepId }),
      ...(step.sharedStepIndex === undefined ? {} : { sharedStepIndex: step.sharedStepIndex }),
    })),
  };
}

/*
Prepares all selected cases before browser startup.
---
Inputs: Run preparation options.
---
Output: Prepared run data.
*/
export function prepareRunForExecution(options: RunPreparationOptions): PreparedRunExecution {
  return {
    cases: options.cases.map((selection) => {
      const prepared = prepareCaseForExecution({
        case: selection.case,
        ...(selection.selectedDataSet === undefined ? {} : { selectedDataSet: selection.selectedDataSet }),
        ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
        ...(options.dataSets === undefined ? {} : { dataSets: options.dataSets }),
        ...(options.sharedSteps === undefined ? {} : { sharedSteps: options.sharedSteps }),
        ...(options.environment === undefined ? {} : { environment: options.environment }),
      }, options.locale);
      return {
        ...prepared,
        ...(selection.settings === undefined ? {} : { settings: selection.settings }),
      };
    }),
  };
}
