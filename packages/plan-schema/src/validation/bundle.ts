import { validateCase } from "./case.js";
import { validatePlan } from "./plan.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

interface ValidatedCaseDataSets {
  dataSets?: Array<{ name: string }>;
  defaultDataSet?: string;
}

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
  const dataSetNames = new Map<string, { caseIndex: number; dataSetIndex: number }>();
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
  }
  for (const { caseIndex, dataSets } of validatedCases) {
    for (const [dataSetIndex, dataSet] of (dataSets.dataSets ?? []).entries()) {
      const earlier = dataSetNames.get(dataSet.name);
      if (earlier !== undefined) {
        issues.push({
          path: `/caseFiles/${caseIndex}/dataSets/${dataSetIndex}/name`,
          keyword: "duplicateDataSetName",
          message: `Data-set name duplicates the name at /caseFiles/${earlier.caseIndex}/dataSets/${earlier.dataSetIndex}/name.`,
        });
        continue;
      }
      dataSetNames.set(dataSet.name, { caseIndex, dataSetIndex });
    }
  }
  for (const { caseIndex, dataSets } of validatedCases) {
    if (dataSets.defaultDataSet !== undefined && !dataSetNames.has(dataSets.defaultDataSet)) {
      issues.push({
        path: `/caseFiles/${caseIndex}/defaultDataSet`,
        keyword: "unknownDataSet",
        message: `No data set named "${dataSets.defaultDataSet}" is available in this plan bundle.`,
      });
    }
  }
  return issues.length === 0 ? { valid: true } : { valid: false, issues };
}
