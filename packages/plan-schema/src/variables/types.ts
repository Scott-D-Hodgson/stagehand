import type { ValidationIssue } from "../validation/types.js";

export type ScalarVariableValue = string | number | boolean;

export interface ProtectedVariableValue {
  env: string;
}

export type VariableValue = ScalarVariableValue | ProtectedVariableValue;

export interface VariableDefinition {
  default: VariableValue;
  locales?: Readonly<Record<string, VariableValue>>;
}

export interface NamedDataSet {
  name: string;
  variables: Readonly<Record<string, VariableDefinition>>;
}

export interface SelectCaseDataSetOptions {
  case: Readonly<Record<string, unknown>>;
  dataSets: readonly NamedDataSet[];
  selectedDataSet?: string;
}

export type SelectCaseDataSetResult =
  | {
      selected: true;
      name?: string;
      source?: "caseDefault" | "selected";
      variables?: Readonly<Record<string, VariableDefinition>>;
    }
  | { selected: false; reason: "unknownDataSet"; message: string };

export interface ResolveVariableOptions {
  name: string;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  caseVariables?: Readonly<Record<string, VariableDefinition>>;
  stepVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSetVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type VariableResolutionResult =
  | { resolved: true; value: VariableValue; source: "plan" | "case" | "dataSet" | "step" }
  | { resolved: false; reason: "invalidLocale" | "missingVariable"; message: string };

export interface PrepareCaseStepOptions {
  step: Readonly<Record<string, unknown>>;
  stepIndex: number;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  caseVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSetVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type PrepareCaseStepResult =
  | { prepared: true; step: Record<string, unknown> }
  | { prepared: false; path: string; reason: "invalidLocale" | "missingVariable" | "unresolvedProtectedValue"; message: string; environmentVariable?: string };

export interface PrepareCaseOptions {
  case: Readonly<Record<string, unknown>>;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSetVariables?: Readonly<Record<string, VariableDefinition>>;
}

export interface SharedStepGroup {
  id: string;
  steps: readonly Readonly<Record<string, unknown>>[];
}

export interface ExpandedCaseStep {
  caseStepIndex: number;
  sharedStepGroupId?: string;
  sharedStepGroupIndex?: number;
  sharedStepIndex?: number;
  step: Record<string, unknown>;
}

export interface ExpandCaseSharedStepsOptions {
  case: Readonly<Record<string, unknown>>;
  sharedStepGroups: readonly SharedStepGroup[];
}

export type ExpandCaseSharedStepsResult =
  | { expanded: true; steps: ExpandedCaseStep[] }
  | {
      expanded: false;
      path: string;
      reason: "invalidCaseSteps" | "nestedSharedStepCall" | "unknownSharedStepGroup";
      message: string;
    };

export interface PrepareCaseSharedStepsOptions extends ExpandCaseSharedStepsOptions {
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  dataSetVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type PrepareCaseSharedStepsResult =
  | { prepared: true; case: Record<string, unknown>; steps: ExpandedCaseStep[] }
  | {
      prepared: false;
      path: string;
      reason: "invalidCaseSteps" | "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "nestedSharedStepCall" | "unknownSharedStepGroup" | "unresolvedProtectedValue";
      message: string;
      issues?: ValidationIssue[];
      caseStepIndex?: number;
      sharedStepGroupId?: string;
      sharedStepIndex?: number;
      environmentVariable?: string;
    };

export type PrepareCaseResult =
  | { prepared: true; case: Record<string, unknown> }
  | {
      prepared: false;
      path: string;
      reason: "invalidLocale" | "invalidPreparedCase" | "missingVariable" | "unresolvedProtectedValue";
      message: string;
      issues?: ValidationIssue[];
      environmentVariable?: string;
    };
