import { validatePlan } from "../validation/plan.js";
import type { ValidationIssue } from "../validation/types.js";
import type { CaseReferenceMatch, CaseReferenceMatchResult } from "./types.js";

type RelativePathResult =
  | { valid: true; path: string }
  | { valid: false; reason: "invalidPath" | "escapesPlanDirectory" | "planDirectory" };

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
  return segments.length === 0
    ? { valid: false, reason: "planDirectory" }
    : { valid: true, path: segments.join("/") };
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
    if (normalized.valid) {
      const paths = pathsByNormalizedValue.get(normalized.path) ?? [];
      paths.push(filePath);
      pathsByNormalizedValue.set(normalized.path, paths);
    }
  }
  const issues: ValidationIssue[] = [];
  const matches: CaseReferenceMatch[] = [];
  const seenReferences = new Map<string, number>();
  for (const [caseIndex, caseReference] of plan.cases.entries()) {
    const reference = caseReference.path;
    const normalized = normalizeRelativePath(reference);
    const issuePath = `/cases/${caseIndex}/path`;
    if (!normalized.valid) {
      issues.push({
        path: issuePath,
        keyword: normalized.reason === "escapesPlanDirectory"
          ? "pathEscapesPlan"
          : normalized.reason === "planDirectory"
            ? "pathResolvesToPlanDirectory"
            : "invalidReferencePath",
        message: normalized.reason === "escapesPlanDirectory"
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
    if (candidatePaths.length !== 1) {
      issues.push({
        path: issuePath,
        keyword: candidatePaths.length === 0 ? "missingReference" : "ambiguousMatch",
        message: candidatePaths.length === 0
          ? `No imported file matches case reference "${reference}".`
          : `Multiple imported files match case reference "${reference}" after path normalization.`,
      });
      continue;
    }
    const filePath = candidatePaths[0];
    if (filePath !== undefined) {
      matches.push({ caseIndex, reference, normalizedPath: normalized.path, filePath });
    }
  }
  return issues.length === 0 ? { valid: true, matches } : { valid: false, matches, issues };
}
