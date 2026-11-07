import { validatePlan } from '@stagehand/plan-schema'
import type { ValidationResult } from '@stagehand/plan-schema'

/*
Validates an editor-held plan with the shared contract rules.
---
Inputs: A plan value supplied by editor state.
---
Output: The shared contract validation result.
*/
export function validateEditorPlan(input: unknown): ValidationResult {
  return validatePlan(input)
}
