import {
  prepareCase,
  selectCaseDataSet,
  type NamedDataSet,
  type VariableDefinition,
} from "@stagehand/plan-schema";
import type { ExecutableStep } from "./types.js";

export interface CaseExecutionOptions {
  case: Readonly<Record<string, unknown>>;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSets?: readonly NamedDataSet[];
  selectedDataSet?: string;
}

export class CasePreparationError extends Error {
  caseId: string;
  path: string;
  reason: "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "unknownDataSet";
  issues?: ReadonlyArray<{ path: string; keyword: string; message: string }>;
  constructor(
    caseId: string,
    path: string,
    reason: "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "unknownDataSet",
    message: string,
    issues?: ReadonlyArray<{ path: string; keyword: string; message: string }>,
  ) {
    super(`Case "${caseId}" could not be prepared at ${path}: ${message}`);
    this.name = "CasePreparationError";
    this.caseId = caseId;
    this.path = path;
    this.reason = reason;
    if (issues !== undefined) {
      this.issues = issues;
    }
  }
}

export interface PreparedCaseExecution {
  caseId: string;
  steps: readonly ExecutableStep[];
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
  const prepared = prepareCase({
    case: options.case,
    locale,
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
    );
  }
  return {
    caseId: getCaseId(prepared.case),
    steps: prepared.case.steps as ExecutableStep[],
  };
}
