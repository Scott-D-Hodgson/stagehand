import {
  prepareCaseSharedSteps,
  selectCaseDataSet,
  type NamedDataSet,
  type SharedStepGroup,
  type VariableDefinition,
} from "@stagehand/plan-schema";
import type { ExecutableStep } from "./types.js";

export interface CaseExecutionOptions {
  case: Readonly<Record<string, unknown>>;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSets?: readonly NamedDataSet[];
  selectedDataSet?: string;
  sharedStepGroups?: readonly SharedStepGroup[];
  environment?: Readonly<Record<string, string | undefined>>;
}

export interface RunCaseSelection {
  case: Readonly<Record<string, unknown>>;
  selectedDataSet?: string;
}

export interface RunPreparationOptions {
  cases: readonly RunCaseSelection[];
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSets?: readonly NamedDataSet[];
  sharedStepGroups?: readonly SharedStepGroup[];
  environment?: Readonly<Record<string, string | undefined>>;
}

export interface StepExecutionIdentity {
  caseStepIndex: number;
  sharedStepGroupId?: string;
  sharedStepIndex?: number;
}

export class CasePreparationError extends Error {
  caseId: string;
  path: string;
  reason: "invalidCaseSteps" | "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "nestedSharedStepCall" | "unknownDataSet" | "unknownSharedStepGroup" | "unresolvedProtectedValue";
  issues?: ReadonlyArray<{ path: string; keyword: string; message: string }>;
  environmentVariable?: string;
  caseStepIndex?: number;
  sharedStepGroupId?: string;
  sharedStepIndex?: number;
  constructor(
    caseId: string,
    path: string,
    reason: "invalidCaseSteps" | "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "nestedSharedStepCall" | "unknownDataSet" | "unknownSharedStepGroup" | "unresolvedProtectedValue",
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
      if (identity.sharedStepGroupId !== undefined) {
        this.sharedStepGroupId = identity.sharedStepGroupId;
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
}

export interface PreparedRunExecution {
  cases: readonly PreparedCaseExecution[];
}

function getCaseId(value: Readonly<Record<string, unknown>>): string {
  return typeof value.id === "string" ? value.id : "unknown";
}

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
      options.selectedDataSet === undefined ? "/defaultDataSet" : "/dataSetSelection",
      selection.reason,
      selection.message,
    );
  }
  const prepared = prepareCaseSharedSteps({
    case: options.case,
    locale,
    sharedStepGroups: options.sharedStepGroups ?? [],
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
            ...(prepared.sharedStepGroupId === undefined ? {} : { sharedStepGroupId: prepared.sharedStepGroupId }),
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
      ...(step.sharedStepGroupId === undefined ? {} : { sharedStepGroupId: step.sharedStepGroupId }),
      ...(step.sharedStepIndex === undefined ? {} : { sharedStepIndex: step.sharedStepIndex }),
    })),
  };
}

export function prepareRunForExecution(options: RunPreparationOptions): PreparedRunExecution {
  return {
    cases: options.cases.map((selection) => prepareCaseForExecution({
      case: selection.case,
      ...(selection.selectedDataSet === undefined ? {} : { selectedDataSet: selection.selectedDataSet }),
      ...(options.planVariables === undefined ? {} : { planVariables: options.planVariables }),
      ...(options.dataSets === undefined ? {} : { dataSets: options.dataSets }),
      ...(options.sharedStepGroups === undefined ? {} : { sharedStepGroups: options.sharedStepGroups }),
      ...(options.environment === undefined ? {} : { environment: options.environment }),
    }, options.locale)),
  };
}
