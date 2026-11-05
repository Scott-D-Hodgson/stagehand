import type { AccessibilitySettings, EffectiveAccessibilitySettings } from "./types.js";

/*
Combines plan and case accessibility settings.
---
Inputs: Plan and case settings.
---
Output: A fresh effective settings object.
*/
export function resolveAccessibilitySettings(
  planSettings: AccessibilitySettings = {},
  caseSettings: AccessibilitySettings = {},
): EffectiveAccessibilitySettings {
  return {
    enabled: caseSettings.enabled ?? planSettings.enabled ?? false,
    failOnViolation: caseSettings.failOnViolation ?? planSettings.failOnViolation ?? false,
    tags: [...(caseSettings.tags ?? planSettings.tags ?? [])],
  };
}
