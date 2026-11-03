import type { ResultOutcome } from "@stagehand/result-model";

export type CaseOutcomeCategory = "accessibilityViolation" | "hardAssertion" | "none" | "operationalError" | "softAssertion" | "cancelled";

export interface CaseOutcomeFacts {
  softFailureCount: number;
  hardFailure: boolean;
  accessibilityFindingCount: number;
  failOnViolation: boolean;
  operationalError: boolean;
  cancelled: boolean;
}

export interface CaseOutcome {
  status: ResultOutcome;
  category: CaseOutcomeCategory;
}

export function determineCaseOutcome(facts: CaseOutcomeFacts): CaseOutcome {
  if (facts.operationalError) {
    return { status: "error", category: "operationalError" };
  }
  if (facts.cancelled) {
    return { status: "cancelled", category: "cancelled" };
  }
  if (facts.hardFailure) {
    return { status: "failed", category: "hardAssertion" };
  }
  if (facts.softFailureCount > 0) {
    return { status: "failed", category: "softAssertion" };
  }
  if (facts.failOnViolation && facts.accessibilityFindingCount > 0) {
    return { status: "failed", category: "accessibilityViolation" };
  }
  return { status: "passed", category: "none" };
}
