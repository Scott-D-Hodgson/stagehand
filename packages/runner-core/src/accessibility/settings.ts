import type { AccessibilitySettings, EffectiveAccessibilitySettings } from "./types.js";

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
