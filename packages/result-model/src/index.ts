import resultSchema from "./result-v1.schema.json" with { type: "json" };
import { Ajv2020, type AnySchema, type ErrorObject } from "ajv/dist/2020.js";
import * as ajvFormats from "ajv-formats";

export type ResultOutcome = "passed" | "failed" | "cancelled" | "error";

export interface ResultFingerprint {
  algorithm: "sha256-v1";
  digest: string;
}

export interface ResultSourcePlan {
  id: string;
  schemaVersion: number;
  fingerprint: ResultFingerprint;
}

export interface ResultDiagnostic {
  source: string;
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  stepIndex?: number;
  assertionId?: string;
}

export interface ResultArtifact {
  kind: string;
  uri: string;
}

export interface ResultAssertion {
  id?: string;
  mode: "hard" | "soft";
  outcome: "passed" | "failed";
  message: string;
}

export interface ResultStep {
  index: number;
  outcome: ResultOutcome;
  durationMs: number;
  assertions: ResultAssertion[];
  diagnostics: ResultDiagnostic[];
  artifacts?: ResultArtifact[];
}

export interface ResultAccessibilityFinding {
  ruleId: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  affectedNodeCount: number;
}

export interface ResultEffectiveSettings {
  locale?: string;
  browser?: {
    type?: string;
    headless?: boolean;
    viewport?: { width: number; height: number };
    timeZone?: string;
  };
  accessibility?: { enabled: boolean };
}

export interface ResultCase {
  id: string;
  name?: string;
  outcome: ResultOutcome;
  durationMs: number;
  effectiveSettings: ResultEffectiveSettings;
  steps: ResultStep[];
  diagnostics: ResultDiagnostic[];
  accessibilityFindings: ResultAccessibilityFinding[];
  artifacts?: ResultArtifact[];
}

export interface ResultCaseCounts {
  total: number;
  passed: number;
  failed: number;
  cancelled: number;
  error: number;
}

export interface StagehandResultV1 {
  schemaVersion: 1;
  sourcePlan: ResultSourcePlan;
  run: {
    outcome: ResultOutcome;
    startedAt: string;
    endedAt: string;
    durationMs: number;
    caseCounts: ResultCaseCounts;
    diagnostics: ResultDiagnostic[];
  };
  cases: ResultCase[];
}

export interface ResultValidationIssue {
  path: string;
  keyword: string;
  message: string;
}

export type ResultValidationResult =
  | { valid: true }
  | { valid: false; issues: ResultValidationIssue[] };

type SyncValidator = ((input: unknown) => boolean) & {
  errors?: ErrorObject[] | null;
};

type FormatRegistrar = (validator: Ajv2020) => void;

export const resultSchemaV1 = resultSchema;

const ajv = new Ajv2020({ allErrors: true });
const registerFormats = ajvFormats.default as unknown as FormatRegistrar;
registerFormats(ajv);
const validateResultV1 = ajv.compile(
  resultSchemaV1 as AnySchema,
) as unknown as SyncValidator;

export function validateResult(input: unknown): ResultValidationResult {
  if (validateResultV1(input)) {
    return { valid: true };
  }
  return {
    valid: false,
    issues: (validateResultV1.errors ?? []).map((error) => ({
      path: error.instancePath,
      keyword: error.keyword,
      message: error.message ?? "Value does not satisfy the result schema.",
    })),
  };
}
