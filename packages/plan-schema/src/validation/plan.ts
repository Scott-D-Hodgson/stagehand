import { isRecord } from "../json.js";
import { validateLocale, validateTimeZone, validateVariables } from "./locale.js";
import { validatePlanSchema } from "./schemas.js";
import type { ValidationIssue, ValidationResult } from "./types.js";

function validateSharedStepGroups(input: unknown): ValidationIssue[] {
  if (!isRecord(input) || !Array.isArray(input.sharedStepGroups)) {
    return [];
  }
  const issues: ValidationIssue[] = [];
  const ids = new Map<string, number>();
  for (const [groupIndex, group] of input.sharedStepGroups.entries()) {
    if (!isRecord(group) || typeof group.id !== "string") {
      continue;
    }
    const earlierIndex = ids.get(group.id);
    if (earlierIndex !== undefined) {
      issues.push({
        path: `/sharedStepGroups/${groupIndex}/id`,
        keyword: "duplicateSharedStepGroupId",
        message: `Shared-step group ID duplicates the ID at /sharedStepGroups/${earlierIndex}/id.`,
      });
    } else {
      ids.set(group.id, groupIndex);
    }
    if (!Array.isArray(group.steps)) {
      continue;
    }
    for (const [stepIndex, step] of group.steps.entries()) {
      if (!isRecord(step)) {
        continue;
      }
      if (step.action === "callSharedSteps") {
        issues.push({
          path: `/sharedStepGroups/${groupIndex}/steps/${stepIndex}/action`,
          keyword: "nestedSharedStepCall",
          message: "A shared-step group cannot call another shared-step group.",
        });
      }
      if (Object.hasOwn(step, "variables")) {
        issues.push({
          path: `/sharedStepGroups/${groupIndex}/steps/${stepIndex}/variables`,
          keyword: "sharedStepVariables",
          message: "Shared-step groups cannot define private variable defaults.",
        });
      }
    }
  }
  return issues;
}

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
    ...validateSharedStepGroups(input),
  ];
  return issues.length === 0 ? result : { valid: false, issues };
}
