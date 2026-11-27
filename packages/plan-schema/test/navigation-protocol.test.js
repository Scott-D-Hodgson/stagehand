import { test } from "node:test";
import assert from "node:assert/strict";
import { prepareCase, validateCase, validatePlanBundle } from "../dist/index.js";

test("navigation requires a separate supported protocol and a valid address", () => {
  const makeCase = (step) => ({ version: 1, id: "example", steps: [step] });
  assert.equal(validateCase(makeCase({ action: "navigate", protocol: "https://", url: "example.test/path" })).valid, true);
  assert.equal(validateCase(makeCase({ action: "navigate", protocol: "http://", url: "localhost:3000" })).valid, true);
  assert.equal(validateCase(makeCase({ action: "navigate", url: "https://example.test" })).valid, false);
  assert.equal(validateCase(makeCase({ action: "navigate", protocol: "ftp://", url: "example.test" })).valid, false);
  assert.equal(validateCase(makeCase({ action: "navigate", protocol: "https://", url: "https://example.test" })).valid, false);
});

test("bundle validation rejects incompatible navigation variable definitions", () => {
  const plan = { version: 1, id: "example", cases: [{ path: "case.json" }], variables: { address: { default: false } } };
  const caseFile = { version: 1, id: "case", steps: [{ action: "navigate", protocol: "https://", url: { var: "address" } }] };
  const result = validatePlanBundle(plan, [caseFile]);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.keyword === "invalidNavigationVariable"));
});

test("bundle validation checks shared steps and data-set overrides", () => {
  const plan = {
    version: 1,
    id: "example",
    cases: [{ path: "case.json" }],
    variables: { address: { default: "example.test" } },
    sharedSteps: { open: [{ action: "navigate", protocol: "https://", url: { var: "address" } }] },
  };
  const caseFile = {
    version: 1,
    id: "case",
    dataSets: { default: {}, broken: { address: { default: 42 } } },
    steps: [{ action: "sharedSteps", id: "open" }],
  };
  const result = validatePlanBundle(plan, [caseFile]);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.keyword === "invalidNavigationVariable"));
});

test("navigation rejects numeric and Boolean variables during preparation", () => {
  for (const value of [true, 42]) {
    const localCase = { version: 1, id: "local", steps: [{ action: "navigate", protocol: "https://", url: { var: "address" }, variables: { address: { default: value } } }] };
    assert.equal(validateCase(localCase).valid, false);
    const result = prepareCase({
      case: { version: 1, id: "example", steps: [{ action: "navigate", protocol: "https://", url: { var: "address" } }] },
      locale: "en-CA",
      planVariables: { address: { default: value } },
    });
    assert.equal(result.prepared, false);
    assert.equal(result.reason, "invalidPreparedCase");
  }
});
