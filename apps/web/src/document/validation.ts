import { validateCase, validatePlan } from '@stagehand/plan-schema';
import type { ValidationResult } from '@stagehand/plan-schema';

/*
Validates an editor-held plan with the shared contract rules.
---
Inputs: A plan value supplied by editor state.
---
Output: The shared contract validation result.
*/
export function validateEditorPlan(input: unknown): ValidationResult {
  return validatePlan(input);
}
/*
Finds authored case-step positions that fail shared-contract validation.
---
Inputs: A raw case-document value held by the editor.
---
Output: Sorted unique invalid step indexes without exposing schema internals.
*/
export function getInvalidCaseStepIndexes(input: unknown): number[] {
  const validation = validateCase(input);
  if (validation.valid) {
    return [];
  }
  const indexes = new Set<number>();
  for (const issue of validation.issues) {
    const match = /^\/steps\/(\d+)(?:\/|$)/.exec(issue.path);
    if (match?.[1] !== undefined) {
      indexes.add(Number(match[1]));
    }
  }
  return [...indexes].sort((first, second) => first - second);
}
