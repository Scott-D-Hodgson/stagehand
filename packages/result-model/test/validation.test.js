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
  result.cases[0].accessibilityFindings[0].helpUrl = "http://[invalid";
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

test("retains complete accessibility evidence without mutating the result", () => {
  const result = exampleResult();
  const original = structuredClone(result);
  assert.deepEqual(validateResult(result), { valid: true });
  assert.deepEqual(result, original);
  assert.deepEqual(result.cases[0].accessibilityFindings[0].affectedNodes[0].target, ["iframe#sign-in", ["profile-form", "#email"]]);
});

test("requires effective accessibility settings even without findings", () => {
  for (const enabled of [true, false]) {
    for (const tags of [[], ["wcag2a"]]) {
      const result = exampleResult();
      result.cases[0].accessibilityFindings = [];
      result.cases[0].effectiveSettings.accessibility = { enabled, failOnViolation: false, tags };
      assert.deepEqual(validateResult(result), { valid: true });
    }
  }
  const result = exampleResult();
  result.cases[0].accessibilityFindings = [];
  delete result.cases[0].effectiveSettings.accessibility;
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path === "/cases/0/effectiveSettings" && issue.keyword === "required"));
});

test("requires enabled, failure policy, and resolved tags instead of inserting defaults", () => {
  for (const key of ["enabled", "failOnViolation", "tags"]) {
    const result = exampleResult();
    delete result.cases[0].effectiveSettings.accessibility[key];
    const original = structuredClone(result);
    const validation = validateResult(result);
    assert.equal(validation.valid, false);
    assert.ok(validation.issues.some((issue) => issue.path === "/cases/0/effectiveSettings/accessibility" && issue.keyword === "required"));
    assert.deepEqual(result, original);
  }
});

test("rejects incorrectly typed effective settings and tag lists", () => {
  for (const [key, value] of [["enabled", "true"], ["failOnViolation", 0], ["tags", null], ["tags", "wcag2a"], ["tags", [1]], ["tags", [""]], ["tags", ["wcag2a", "wcag2a"]]]) {
    const result = exampleResult();
    result.cases[0].effectiveSettings.accessibility[key] = value;
    assert.equal(validateResult(result).valid, false);
  }
});

test("requires finding URLs, rule tags, and affected-node evidence", () => {
  for (const key of ["url", "tags", "affectedNodes"]) {
    const result = exampleResult();
    delete result.cases[0].accessibilityFindings[0][key];
    const validation = validateResult(result);
    assert.equal(validation.valid, false);
    assert.ok(validation.issues.some((issue) => issue.path === "/cases/0/accessibilityFindings/0" && issue.keyword === "required"));
  }
});

test("rejects relative and malformed finding URLs but retains absolute scan URLs", () => {
  for (const url of ["/sign-in", "http://[invalid", ""]) {
    const result = exampleResult();
    result.cases[0].accessibilityFindings[0].url = url;
    const validation = validateResult(result);
    assert.equal(validation.valid, false);
    assert.ok(validation.issues.some((issue) => issue.path === "/cases/0/accessibilityFindings/0/url" && issue.keyword === "format"));
  }
  const result = exampleResult();
  result.cases[0].accessibilityFindings[0].url = "about:blank";
  assert.deepEqual(validateResult(result), { valid: true });
});

test("preserves unknown severity as null and permits absent optional node details", () => {
  const result = exampleResult();
  const finding = result.cases[0].accessibilityFindings[0];
  const node = finding.affectedNodes[0];
  finding.impact = null;
  node.impact = null;
  assert.deepEqual(validateResult(result), { valid: true });
  delete node.impact;
  delete node.failureSummary;
  delete node.xpath;
  delete node.relatedNodes[0].xpath;
  node.target = [];
  assert.deepEqual(validateResult(result), { valid: true });
  finding.impact = "unknown";
  assert.equal(validateResult(result).valid, false);
  finding.impact = null;
  node.impact = "high";
  assert.equal(validateResult(result).valid, false);
});

test("accepts flat and frame/shadow targets without flattening their structure", () => {
  for (const target of [[], ["#email"], ["iframe", "#email"], [["host", "#email"]], ["iframe", ["host", "nested-host", "#email"]]]) {
    const result = exampleResult();
    result.cases[0].accessibilityFindings[0].affectedNodes[0].target = target;
    result.cases[0].accessibilityFindings[0].affectedNodes[0].relatedNodes[0].target = target;
    assert.deepEqual(validateResult(result), { valid: true });
  }
});

test("rejects malformed targets, XPath, and node containers", () => {
  for (const [key, value] of [["target", "#email"], ["target", [1]], ["target", [["host"]]], ["target", [[["nested", "invalid"]]]], ["target", [""]], ["xpath", "/html/body"], ["xpath", [1]], ["relatedNodes", {}], ["failureSummary", null], ["html", 3]]) {
    const result = exampleResult();
    result.cases[0].accessibilityFindings[0].affectedNodes[0][key] = value;
    assert.equal(validateResult(result).valid, false);
  }
  const result = exampleResult();
  result.cases[0].accessibilityFindings[0].affectedNodes = {};
  assert.equal(validateResult(result).valid, false);
});

test("requires node markup, target, and explicit related-node lists", () => {
  for (const key of ["html", "target", "relatedNodes"]) {
    const result = exampleResult();
    delete result.cases[0].accessibilityFindings[0].affectedNodes[0][key];
    assert.equal(validateResult(result).valid, false);
  }
  const result = exampleResult();
  result.cases[0].accessibilityFindings[0].affectedNodes[0].relatedNodes = [];
  assert.deepEqual(validateResult(result), { valid: true });
});

test("requires related-node evidence and rejects unselected fields", () => {
  for (const mutate of [
    (node) => { delete node.html; },
    (node) => { delete node.target; },
    (node) => { node.target = [false]; },
    (node) => { node.xpath = [false]; },
    (node) => { node.element = {}; },
    (node) => { node.impact = "critical"; },
  ]) {
    const result = exampleResult();
    mutate(result.cases[0].accessibilityFindings[0].affectedNodes[0].relatedNodes[0]);
    assert.equal(validateResult(result).valid, false);
  }
  for (const field of ["any", "all", "none", "data", "ancestry", "element", "tags"]) {
    const result = exampleResult();
    result.cases[0].accessibilityFindings[0].affectedNodes[0][field] = [];
    assert.equal(validateResult(result).valid, false);
  }
});

test("rejects duplicate related evidence but preserves distinct targets and XPath", () => {
  const result = exampleResult();
  const related = result.cases[0].accessibilityFindings[0].affectedNodes[0].relatedNodes;
  related.push(structuredClone(related[0]));
  const validation = validateResult(result);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.path.endsWith("/relatedNodes") && issue.keyword === "uniqueItems"));
  related[1].target = ["#different-label"];
  assert.deepEqual(validateResult(result), { valid: true });
  related[1].target = structuredClone(related[0].target);
  related[1].xpath = ["/different/path"];
  assert.deepEqual(validateResult(result), { valid: true });
});

test("keeps historical rule tags readable without depending on the current engine catalogue", () => {
  const result = exampleResult();
  result.cases[0].effectiveSettings.accessibility.tags = ["future-standard"];
  result.cases[0].accessibilityFindings[0].tags = ["future-standard", "custom-category"];
  assert.deepEqual(validateResult(result), { valid: true });
  result.cases[0].accessibilityFindings[0].tags = ["future-standard", "future-standard"];
  assert.equal(validateResult(result).valid, false);
});

test("does not infer functional status or cross-field counts from accessibility settings", () => {
  const result = exampleResult();
  result.cases[0].effectiveSettings.accessibility.failOnViolation = true;
  result.cases[0].accessibilityFindings[0].affectedNodeCount = 99;
  assert.deepEqual(validateResult(result), { valid: true });
});
