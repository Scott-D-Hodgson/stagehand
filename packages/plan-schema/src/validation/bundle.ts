import { validateCase } from "./case.js";
import { validatePlan } from "./plan.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

export function validatePlanBundle(input: unknown, parsedCases: readonly unknown[]): ValidationResult {
  const planResult = validatePlan(input);
  if (!planResult.valid) {
    return planResult;
  }
  if (!Array.isArray(parsedCases)) {
    return { valid: false, issues: [{
      path: "/caseFiles",
      keyword: "type",
      message: "Parsed cases must be supplied as an array in plan reference order.",
    }] };
  }
  const plan = input as { cases: Array<{ path: string }> };
  if (parsedCases.length !== plan.cases.length) {
    return { valid: false, issues: [{
      path: "/caseFiles",
      keyword: "caseCount",
      message: `Expected ${plan.cases.length} parsed case files in plan reference order, received ${parsedCases.length}.`,
    }] };
  }
  const issues: ValidationIssue[] = [];
  const caseIds = new Map<string, number>();
  for (const [caseIndex, caseFile] of parsedCases.entries()) {
    const caseResult = validateCase(caseFile);
    if (!caseResult.valid) {
      issues.push(...caseResult.issues.map((issue) => ({
        ...issue,
        path: `/caseFiles/${caseIndex}${issue.path}`,
      })));
      continue;
    }
    const caseId = (caseFile as { id: string }).id;
    const earlierIndex = caseIds.get(caseId);
    if (earlierIndex !== undefined) {
      issues.push({
        path: `/caseFiles/${caseIndex}/id`,
        keyword: "uniqueCaseId",
        message: `Case ID "${caseId}" duplicates the ID at /caseFiles/${earlierIndex}/id.`,
      });
      continue;
    }
    caseIds.set(caseId, caseIndex);
  }
  return issues.length === 0 ? { valid: true } : { valid: false, issues };
}
