import assert from "node:assert/strict";
import test from "node:test";
import { createResultDocument, ResultDocumentError } from "@stagehand/runner-core";
import { REDACTED_EVIDENCE_VALUE, validateResult } from "@stagehand/result-model";

function sourcePlan() {
  return {
    id: "checkout",
    version: 1,
    fingerprint: { algorithm: "sha256-v1", digest: "a".repeat(64) },
  };
}

function outcome(overrides = {}) {
  return {
    status: "failed",
    counts: { passed: 0, failed: 1, cancelled: 0, error: 0 },
    durationMs: 125,
    cases: [{
      caseId: "checkout",
      outcome: { status: "failed", category: "softAssertion" },
      durationMs: 50,
      softFailures: [{
        caseId: "checkout",
        stepIndex: 2,
        action: "assertText",
        expected: "Expected",
        actual: "Actual",
        message: "Expected text was not found.",
      }],
      accessibilityFindings: [],
      effectiveSettings: {
        locale: "en-CA",
        accessibility: { enabled: false, failOnViolation: false, tags: [] },
      },
      diagnostics: [],
    }],
    ...overrides,
  };
}

test("creates a validated result document from a run outcome", () => {
  const result = createResultDocument({
    outcome: outcome(),
    sourcePlan: sourcePlan(),
    startedAt: "2026-11-04T12:00:00Z",
    endedAt: "2026-11-04T12:00:01Z",
  });
  assert.deepEqual(validateResult(result), { valid: true });
  assert.equal(result.run.caseCounts.total, 1);
  assert.deepEqual(result.cases[0].steps, [{
    index: 2,
    outcome: "failed",
    durationMs: 0,
    assertions: [{ mode: "soft", outcome: "failed", message: "Expected text was not found." }],
    diagnostics: [],
  }]);
});

test("redacts protected values at the result boundary", () => {
  const secret = "not-a-real-password";
  const runOutcome = outcome();
  runOutcome.cases[0].softFailures[0].message = `Expected ${secret}.`;
  const result = createResultDocument({
    outcome: runOutcome,
    sourcePlan: sourcePlan(),
    startedAt: "2026-11-04T12:00:00Z",
    endedAt: "2026-11-04T12:00:01Z",
    protectedValues: [secret],
  });
  assert.equal(result.cases[0].steps[0].assertions[0].message, `Expected ${REDACTED_EVIDENCE_VALUE}.`);
  assert.equal(runOutcome.cases[0].softFailures[0].message, `Expected ${secret}.`);
});

test("uses a safe run diagnostic instead of an operational error message", () => {
  const secret = "not-a-real-token";
  const result = createResultDocument({
    outcome: outcome({ operationalError: new Error(`Browser rejected ${secret}.`) }),
    sourcePlan: sourcePlan(),
    startedAt: "2026-11-04T12:00:00Z",
    endedAt: "2026-11-04T12:00:01Z",
  });
  assert.deepEqual(result.run.diagnostics, [{
    source: "runner",
    severity: "error",
    code: "operationalError",
    message: "The runner encountered an operational error.",
  }]);
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});

test("rejects an adapter input that cannot produce a valid result", () => {
  assert.throws(
    () => createResultDocument({
      outcome: outcome(),
      sourcePlan: sourcePlan(),
      startedAt: "not-a-timestamp",
      endedAt: "2026-11-04T12:00:01Z",
    }),
    (error) => error instanceof ResultDocumentError
      && error.issues.some((issue) => issue.path === "/run/startedAt"),
  );
});
