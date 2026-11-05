import { validateCase } from "./case.js";
import { validatePlan } from "./plan.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

interface ValidatedCaseDataSets {
  dataSets?: Record<string, unknown>;
}

interface ValidatedPlanSharedSteps {
  sharedSteps?: Record<string, unknown>;
}

/*
Checks that a validated plan and its loaded cases agree.
---
Inputs: Plan value and parsed cases.
---
Output: Valid confirmation or issues.
*/
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
  const plan = input as { cases: Array<{ path: string }> } & ValidatedPlanSharedSteps;
  if (parsedCases.length !== plan.cases.length) {
    return { valid: false, issues: [{
      path: "/caseFiles",
      keyword: "caseCount",
      message: `Expected ${plan.cases.length} parsed case files in plan reference order, received ${parsedCases.length}.`,
    }] };
  }
  const issues: ValidationIssue[] = [];
  const caseIds = new Map<string, number>();
  const dataSetNames = new Map<string, number>();
  const sharedStepIds = new Set(Object.keys(plan.sharedSteps ?? {}));
  const validatedCases: Array<{ caseIndex: number; dataSets: ValidatedCaseDataSets }> = [];
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
    validatedCases.push({ caseIndex, dataSets: caseFile as ValidatedCaseDataSets });
    const steps = (caseFile as { steps: Array<unknown> }).steps;
    for (const [stepIndex, step] of steps.entries()) {
      if (
        typeof step === "object"
        && step !== null
        && !Array.isArray(step)
        && (step as { action?: unknown }).action === "sharedSteps"
        && typeof (step as { id?: unknown }).id === "string"
        && !sharedStepIds.has((step as { id: string }).id)
      ) {
        const sharedStepId = (step as { id: string }).id;
        issues.push({
          path: `/caseFiles/${caseIndex}/steps/${stepIndex}/id`,
          keyword: "unknownSharedSteps",
          message: `No shared steps named "${sharedStepId}" are available in this plan.`,
        });
      }
    }
  }
  for (const { caseIndex, dataSets } of validatedCases) {
    for (const [name] of Object.entries(dataSets.dataSets ?? {})) {
      if (name === "default") {
        continue;
      }
      const earlier = dataSetNames.get(name);
      if (earlier !== undefined) {
        issues.push({
          path: `/caseFiles/${caseIndex}/dataSets/${name}`,
          keyword: "duplicateDataSetName",
          message: `Data-set name duplicates the name at /caseFiles/${earlier}/dataSets/${name}.`,
        });
        continue;
      }
      dataSetNames.set(name, caseIndex);
    }
  }
  return issues.length === 0 ? { valid: true } : { valid: false, issues };
}
