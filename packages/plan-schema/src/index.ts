import caseSchemaV1 from "./case-v1.schema.json" with { type: "json" };
import planSchemaV1 from "./plan-v1.schema.json" with { type: "json" };
import {
  Ajv2020,
  type AnySchema,
  type ErrorObject,
} from "ajv/dist/2020.js";

export interface ValidationIssue {
  path: string;
  keyword: string;
  message: string;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; issues: ValidationIssue[] };

type SyncValidator = ((input: unknown) => boolean) & {
  errors?: ErrorObject[] | null;
};

const ajv = new Ajv2020({ allErrors: true });
// These package schemas are synchronous, although Ajv's type also allows async schemas.
const validatePlanSchemaV1 = ajv.compile(
  planSchemaV1 as AnySchema,
) as unknown as SyncValidator;
const validateCaseSchemaV1 = ajv.compile(
  caseSchemaV1 as AnySchema,
) as unknown as SyncValidator;

function toValidationResult(
  isValid: boolean,
  errors: ErrorObject[] | null | undefined,
): ValidationResult {
  if (isValid) {
    return { valid: true };
  }
  return {
    valid: false,
    issues: (errors ?? []).map((error) => ({
      path: error.instancePath,
      keyword: error.keyword,
      message: error.message ?? "Value does not satisfy the schema.",
    })),
  };
}

export function validatePlan(input: unknown): ValidationResult {
  const valid = validatePlanSchemaV1(input);
  return toValidationResult(valid, validatePlanSchemaV1.errors);
}

export function validateCase(input: unknown): ValidationResult {
  const valid = validateCaseSchemaV1(input);
  return toValidationResult(valid, validateCaseSchemaV1.errors);
}

export { caseSchemaV1, planSchemaV1 };
