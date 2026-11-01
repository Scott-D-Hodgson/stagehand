import caseSchemaV1 from "../case-v1.schema.json" with { type: "json" };
import planSchemaV1 from "../plan-v1.schema.json" with { type: "json" };
import {
  Ajv2020,
  type AnySchema,
  type ErrorObject,
} from "ajv/dist/2020.js";
import type { ValidationResult } from "./types.js";

type SyncValidator = ((input: unknown) => boolean) & {
  errors?: ErrorObject[] | null;
};

const ajv = new Ajv2020({ allErrors: true });
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

export function validatePlanSchema(input: unknown): ValidationResult {
  return toValidationResult(validatePlanSchemaV1(input), validatePlanSchemaV1.errors);
}

export function validateCaseSchema(input: unknown): ValidationResult {
  return toValidationResult(validateCaseSchemaV1(input), validateCaseSchemaV1.errors);
}

export { caseSchemaV1, planSchemaV1 };
