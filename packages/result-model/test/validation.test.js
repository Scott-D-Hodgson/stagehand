import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resultSchemaV1, validateResult } from "@stagehand/result-model";

function readFixture(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

function exampleResult() {
  return readFixture("../examples/checkout-result.json");
}

test("exports the result schema and validates the synthetic example publicly", () => {
  assert.equal(resultSchemaV1.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.deepEqual(validateResult(exampleResult()), { valid: true });
});

test("returns a schema issue for an unsupported result version", () => {
  const result = exampleResult();
  result.schemaVersion = 2;
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/schemaVersion"));
});

test("rejects a malformed fingerprint digest", () => {
  const result = exampleResult();
  result.sourcePlan.fingerprint.digest = "not-a-sha256-digest";
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/sourcePlan/fingerprint/digest"));
});

test("requires UTC timestamps instead of offset timestamps", () => {
  const result = exampleResult();
  result.run.startedAt = "2026-10-27T11:00:00-04:00";
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/run/startedAt"));
});

test("rejects invalid RFC 3339 calendar dates", () => {
  const result = exampleResult();
  result.run.endedAt = "2026-02-30T15:00:02Z";
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/run/endedAt"));
});

test("rejects malformed accessibility help URLs", () => {
  const result = exampleResult();
  result.cases[0].accessibilityFindings.push({
    ruleId: "example-rule",
    impact: "moderate",
    description: "Synthetic accessibility finding.",
    help: "Review the accessible name.",
    helpUrl: "http://[invalid",
    affectedNodeCount: 1,
  });
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/cases/0/accessibilityFindings/0/helpUrl"));
});

test("rejects unknown properties", () => {
  const result = exampleResult();
  result.unexpected = true;
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.keyword === "additionalProperties"));
});

test("returns an issue for non-object input without throwing", () => {
  assert.doesNotThrow(() => validateResult(null));
  const validation = validateResult(null);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.keyword === "type"));
});
