import { isRecord } from "../json.js";
import { validateLocalizedValues, validateTimeZone, validateVariables } from "./locale.js";
import { validateCaseSchema } from "./schemas.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

function validateCaseSettings(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !isRecord(input.settings) || !isRecord(input.settings.browser)) {
    return [];
  }
  return validateTimeZone(input.settings.browser.timeZone, "/settings/browser/timeZone");
}

function validateNavigationUrls(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !Array.isArray(input.steps)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  for (const [stepIndex, step] of input.steps.entries()) {
    if (!isRecord(step) || step.action !== "navigate" || typeof step.url !== "string") {
      continue;
    }
    const path = `/steps/${stepIndex}/url`;
    try {
      const url = new URL(step.url);
      if (
        !/^https?:\/\//i.test(step.url) ||
        (url.protocol !== "http:" && url.protocol !== "https:") ||
        url.hostname.length === 0
      ) {
        throw new TypeError("Navigation URL must be absolute and use HTTP or HTTPS.");
      }
    } catch {
      issues.push({
        path,
        keyword: "invalidNavigationUrl",
        message: "Navigation URL must be an absolute HTTP or HTTPS URL with a host.",
      });
    }
  }
  return issues;
}

function validateCaseExpectedLocales(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !Array.isArray(input.steps)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  for (const [stepIndex, step] of input.steps.entries()) {
    if (!isRecord(step) || typeof step.action !== "string") {
      continue;
    }
    const stepPath = `/steps/${stepIndex}`;
    if (step.action === "assertText" || step.action === "assertHtml" || step.action === "assertValue") {
      issues.push(...validateLocalizedValues(step.expected, `${stepPath}/expected`));
    }
    if (step.action === "assertValue") {
      issues.push(...validateLocalizedValues(step.associatedLabel, `${stepPath}/associatedLabel`));
    }
  }
  return issues;
}

function validateCaseStepVariables(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !Array.isArray(input.steps)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  for (const [stepIndex, step] of input.steps.entries()) {
    if (isRecord(step)) {
      issues.push(...validateVariables(step.variables, `/steps/${stepIndex}/variables`));
    }
  }
  return issues;
}

function validateCaseDataSets(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !Array.isArray(input.dataSets)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  const names = new Map<string, number>();
  for (const [dataSetIndex, dataSet] of input.dataSets.entries()) {
    if (!isRecord(dataSet) || typeof dataSet.name !== "string") {
      continue;
    }
    issues.push(...validateVariables(dataSet.variables, `/dataSets/${dataSetIndex}/variables`));
    const earlierIndex = names.get(dataSet.name);
    if (earlierIndex !== undefined) {
      issues.push({
        path: `/dataSets/${dataSetIndex}/name`,
        keyword: "duplicateDataSetName",
        message: `Data-set name duplicates the name at /dataSets/${earlierIndex}/name.`,
      });
      continue;
    }
    names.set(dataSet.name, dataSetIndex);
  }
  return issues;
}

export function validateCase(input: unknown): ValidationResult {
  const result = validateCaseSchema(input);
  if (!result.valid) {
    return result;
  }
  const issues = [
    ...validateCaseSettings(input),
    ...validateNavigationUrls(input),
    ...validateCaseExpectedLocales(input),
    ...validateVariables(isRecord(input) ? input.variables : undefined, "/variables"),
    ...validateCaseStepVariables(input),
    ...validateCaseDataSets(input),
  ];
  return issues.length === 0 ? result : { valid: false, issues };
}
