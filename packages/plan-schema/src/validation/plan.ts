import { isRecord } from "../json.js";
import { validateLocale, validateTimeZone, validateVariables } from "./locale.js";
import { validatePlanSchema } from "./schemas.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

/*
Checks shared-step definitions in a plan.
---
Inputs: A plan value.
---
Output: Any shared-step issues.
*/
function validateSharedSteps(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !isRecord(input.sharedSteps)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  for (const [id, steps] of Object.entries(input.sharedSteps)) {
    if (!Array.isArray(steps)) {
      continue;
    }
    for (const [stepIndex, step] of steps.entries()) {
      if (!isRecord(step)) {
        continue;
      }
      if (step.action === "sharedSteps") {
        issues.push({
          path: `/sharedSteps/${id}/${stepIndex}/action`,
          keyword: "nestedSharedSteps",
          message: "Shared steps cannot call other shared steps.",
        });
      }
      if (Object.hasOwn(step, "variables")) {
        issues.push({
          path: `/sharedSteps/${id}/${stepIndex}/variables`,
          keyword: "sharedStepVariables",
          message: "Shared steps cannot define private variable defaults.",
        });
      }
    }
  }
  return issues;
}

/*
Checks plan settings that need semantic validation.
---
Inputs: A plan value.
---
Output: Any settings issues.
*/
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

/*
Checks a plan against schema and semantic rules.
---
Inputs: Any plan value.
---
Output: Valid confirmation or issues.
*/
export function validatePlan(input: unknown): ValidationResult {
  const result = validatePlanSchema(input);
  if (!result.valid) {
    return result;
  }
  const issues = [
    ...validatePlanSettings(input),
    ...validateVariables(isRecord(input) ? input.variables : undefined, "/variables"),
    ...validateSharedSteps(input),
  ];
  return issues.length === 0 ? result : { valid: false, issues };
}
