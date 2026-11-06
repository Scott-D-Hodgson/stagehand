import assert from "node:assert/strict";
import test from "node:test";
import { summarizeRunOutcome } from "@stagehand/runner-core";

function facts(overrides = {}) {
  return { caseOutcomes: [], cancelled: false, operationalError: false, ...overrides };
}

test("summarizes a no-start operational error", () => {
  assert.deepEqual(summarizeRunOutcome(facts({ operationalError: true })), {
    status: "error",
    counts: { passed: 0, failed: 0, cancelled: 0, error: 0 },
  });
});

test("counts passed cases", () => {
  assert.deepEqual(summarizeRunOutcome(facts({ caseOutcomes: ["passed", "passed"] })), {
    status: "passed",
    counts: { passed: 2, failed: 0, cancelled: 0, error: 0 },
  });
});

test("gives errors priority over failed cases", () => {
  assert.deepEqual(summarizeRunOutcome(facts({ caseOutcomes: ["passed", "failed", "error"] })), {
    status: "error",
    counts: { passed: 1, failed: 1, cancelled: 0, error: 1 },
  });
});

test("gives cancellation priority over failure but not error", () => {
  assert.deepEqual(summarizeRunOutcome(facts({ caseOutcomes: ["failed"], cancelled: true })), {
    status: "cancelled",
    counts: { passed: 0, failed: 1, cancelled: 0, error: 0 },
  });
  assert.deepEqual(summarizeRunOutcome(facts({ caseOutcomes: ["cancelled", "error"] })), {
    status: "error",
    counts: { passed: 0, failed: 0, cancelled: 1, error: 1 },
  });
});
