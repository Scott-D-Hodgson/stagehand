import type { ValidationIssue } from "../validation/types.js";

export type ScalarVariableValue = string | number | boolean;

export interface VariableDefinition {
  default: ScalarVariableValue;
  locales?: Readonly<Record<string, ScalarVariableValue>>;
}

export interface ResolveVariableOptions {
  name: string;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  caseVariables?: Readonly<Record<string, VariableDefinition>>;
  stepVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type VariableResolutionResult =
  | { resolved: true; value: ScalarVariableValue; source: "plan" | "case" | "step" }
  | { resolved: false; reason: "invalidLocale" | "missingVariable"; message: string };

export interface PrepareCaseStepOptions {
  step: Readonly<Record<string, unknown>>;
  stepIndex: number;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
  caseVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type PrepareCaseStepResult =
  | { prepared: true; step: Record<string, unknown> }
  | { prepared: false; path: string; reason: "invalidLocale" | "missingVariable"; message: string };

export interface PrepareCaseOptions {
  case: Readonly<Record<string, unknown>>;
  locale: string;
  planVariables?: Readonly<Record<string, VariableDefinition>>;
}

export type PrepareCaseResult =
  | { prepared: true; case: Record<string, unknown> }
  | {
      prepared: false;
      path: string;
      reason: "invalidLocale" | "invalidPreparedCase" | "missingVariable";
      message: string;
      issues?: ValidationIssue[];
    };
