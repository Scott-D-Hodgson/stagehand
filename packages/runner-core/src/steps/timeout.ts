import { DEFAULT_LOCATOR_TIMEOUT } from "../defaults.js";

/*
Resolves the timeout inherited by a case step.
---
Inputs: Optional plan and case timeout settings.
---
Output: The case setting, plan setting, or built-in default in that order.
*/
export function resolveStepTimeout(planTimeout?: number, caseTimeout?: number): number {
  return caseTimeout ?? planTimeout ?? DEFAULT_LOCATOR_TIMEOUT;
}
