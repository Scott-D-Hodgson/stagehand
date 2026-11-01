import { isRecord } from "../json.js";
import { validateLocale, validateTimeZone, validateVariables } from "./locale.js";
import { validatePlanSchema } from "./schemas.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

function validatePlanSettings(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !isRecord(input.defaults)) {
    return [];
  }
  const issues = validateLocale(input.defaults.locale, "/defaults/locale");
  if (isRecord(input.defaults.browser)) {
    issues.push(...validateTimeZone(
      input.defaults.browser.timeZone,
      "/defaults/browser/timeZone",
    ));
  }
  return issues;
}

export function validatePlan(input: unknown): ValidationResult {
  const result = validatePlanSchema(input);
  if (!result.valid) {
    return result;
  }
  const issues = [
    ...validatePlanSettings(input),
    ...validateVariables(isRecord(input) ? input.variables : undefined, "/variables"),
  ];
  return issues.length === 0 ? result : { valid: false, issues };
}
