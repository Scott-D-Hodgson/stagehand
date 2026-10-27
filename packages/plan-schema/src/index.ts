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

export interface CaseReferenceMatch {
  caseIndex: number;
  reference: string;
  normalizedPath: string;
  filePath: string;
}

export type CaseReferenceMatchResult =
  | { valid: true; matches: CaseReferenceMatch[] }
  | {
      valid: false;
      matches: CaseReferenceMatch[];
      issues: ValidationIssue[];
    };

type SyncValidator = ((input: unknown) => boolean) & {
  errors?: ErrorObject[] | null;
};

type RelativePathResult =
  | { valid: true; path: string }
  | {
      valid: false;
      reason: "invalidPath" | "escapesPlanDirectory" | "planDirectory";
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

function normalizeRelativePath(path: string): RelativePathResult {
  if (
    path.length === 0 ||
    path.includes("\\") ||
    path.startsWith("/") ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(path)
  ) {
    return { valid: false, reason: "invalidPath" };
  }
  const segments: string[] = [];
  for (const segment of path.split("/")) {
    if (segment === "" || segment === ".") {
      continue;
    }
    if (segment === "..") {
      if (segments.length === 0) {
        return { valid: false, reason: "escapesPlanDirectory" };
      }
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  if (segments.length === 0) {
    return { valid: false, reason: "planDirectory" };
  }
  return { valid: true, path: segments.join("/") };
}

export function matchCaseReferences(
  input: unknown,
  availablePaths: readonly string[],
): CaseReferenceMatchResult {
  const planResult = validatePlan(input);
  if (!planResult.valid) {
    return { valid: false, matches: [], issues: planResult.issues };
  }
  const plan = input as { cases: Array<{ path: string }> };
  const pathsByNormalizedValue = new Map<string, string[]>();
  for (const filePath of availablePaths) {
    const normalized = normalizeRelativePath(filePath);
    if (!normalized.valid) {
      continue;
    }
    const paths = pathsByNormalizedValue.get(normalized.path) ?? [];
    paths.push(filePath);
    pathsByNormalizedValue.set(normalized.path, paths);
  }
  const issues: ValidationIssue[] = [];
  const matches: CaseReferenceMatch[] = [];
  const seenReferences = new Map<string, number>();
  for (const [caseIndex, caseReference] of plan.cases.entries()) {
    const reference = caseReference.path;
    const normalized = normalizeRelativePath(reference);
    const issuePath = `/cases/${caseIndex}/path`;
    if (!normalized.valid) {
      const keyword =
        normalized.reason === "escapesPlanDirectory"
          ? "pathEscapesPlan"
          : normalized.reason === "planDirectory"
            ? "pathResolvesToPlanDirectory"
            : "invalidReferencePath";
      issues.push({
        path: issuePath,
        keyword,
        message:
          normalized.reason === "escapesPlanDirectory"
            ? "Case reference resolves outside the plan directory."
            : normalized.reason === "planDirectory"
              ? "Case reference must identify a file inside the plan directory."
              : "Case reference must be a portable relative path using forward slashes.",
      });
      continue;
    }
    const earlierIndex = seenReferences.get(normalized.path);
    if (earlierIndex !== undefined) {
      issues.push({
        path: issuePath,
        keyword: "duplicateReference",
        message: `Case reference duplicates the reference at /cases/${earlierIndex}/path after path normalization.`,
      });
      continue;
    }
    seenReferences.set(normalized.path, caseIndex);
    const candidatePaths = pathsByNormalizedValue.get(normalized.path) ?? [];
    if (candidatePaths.length === 0) {
      issues.push({
        path: issuePath,
        keyword: "missingReference",
        message: `No imported file matches case reference "${reference}".`,
      });
      continue;
    }
    if (candidatePaths.length > 1) {
      issues.push({
        path: issuePath,
        keyword: "ambiguousMatch",
        message: `Multiple imported files match case reference "${reference}" after path normalization.`,
      });
      continue;
    }
    const filePath = candidatePaths[0];
    if (filePath === undefined) {
      issues.push({
        path: issuePath,
        keyword: "missingReference",
        message: `No imported file matches case reference "${reference}".`,
      });
      continue;
    }
    matches.push({
      caseIndex,
      reference,
      normalizedPath: normalized.path,
      filePath,
    });
  }
  if (issues.length > 0) {
    return { valid: false, matches, issues };
  }
  return { valid: true, matches };
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
