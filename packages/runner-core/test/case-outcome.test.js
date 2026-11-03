import assert from "node:assert/strict";
import test from "node:test";
import { determineCaseOutcome } from "@stagehand/runner-core";

function facts(overrides = {}) {
  return {
    softFailureCount: 0,
    hardFailure: false,
    accessibilityFindingCount: 0,
    failOnViolation: false,
    operationalError: false,
    cancelled: false,
    ...overrides,
  };
}

test("passes when no case facts indicate a failure", () => {
  assert.deepEqual(determineCaseOutcome(facts()), { status: "passed", category: "none" });
});

test("fails for soft and hard assertion failures", () => {
  assert.deepEqual(determineCaseOutcome(facts({ softFailureCount: 2 })), { status: "failed", category: "softAssertion" });
  assert.deepEqual(determineCaseOutcome(facts({ softFailureCount: 2, hardFailure: true })), { status: "failed", category: "hardAssertion" });
});

test("fails only configured accessibility findings", () => {
  assert.deepEqual(determineCaseOutcome(facts({ accessibilityFindingCount: 1 })), { status: "passed", category: "none" });
  assert.deepEqual(determineCaseOutcome(facts({ accessibilityFindingCount: 1, failOnViolation: true })), { status: "failed", category: "accessibilityViolation" });
});

test("prioritizes operational errors and cancellation over functional failures", () => {
  assert.deepEqual(determineCaseOutcome(facts({ softFailureCount: 1, cancelled: true })), { status: "cancelled", category: "cancelled" });
  assert.deepEqual(determineCaseOutcome(facts({ hardFailure: true, cancelled: true, operationalError: true })), { status: "error", category: "operationalError" });
});
