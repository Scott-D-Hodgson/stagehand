import type AxeBuilder from "@axe-core/playwright";
import type { ResultAccessibilityFinding } from "@stagehand/result-model";

export type AccessibilityScanResults = Awaited<ReturnType<AxeBuilder["analyze"]>>;

export type AccessibilityScanOutcome =
  | { status: "disabled" }
  | { status: "completed"; results: AccessibilityScanResults };

export interface AccessibilitySettings {
  enabled?: boolean;
  failOnViolation?: boolean;
  tags?: readonly string[];
}

export interface EffectiveAccessibilitySettings {
  enabled: boolean;
  failOnViolation: boolean;
  tags: string[];
}

export interface AccessibilityFindingCollector {
  add(results: AccessibilityScanResults): void;
  getFindings(): ResultAccessibilityFinding[];
}

export interface StepAccessibilityScan {
  caseId: string;
  stepIndex: number;
  results: AccessibilityScanResults;
}
