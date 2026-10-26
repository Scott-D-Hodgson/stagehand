import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateCase, validatePlan } from "@stagehand/plan-schema";

function readFixture(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

test("accepts the example plan through the public package entry point", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  assert.deepEqual(validatePlan(plan), { valid: true });
});

test("accepts the example case through the public package entry point", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  assert.deepEqual(validateCase(exampleCase), { valid: true });
});

test("returns a schema issue for an invalid plan without throwing", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.schemaVersion = "1";
  assert.doesNotThrow(() => validatePlan(plan));
  const result = validatePlan(plan);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/schemaVersion" && issue.keyword === "const",
    ),
  );
});

test("returns a schema issue for an invalid case without throwing", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.steps = "not-an-array";
  assert.doesNotThrow(() => validateCase(exampleCase));
  const result = validateCase(exampleCase);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/steps" && issue.keyword === "type",
    ),
  );
});

test("returns issues for a non-object input instead of throwing", () => {
  assert.doesNotThrow(() => validatePlan(null));
  const result = validatePlan(null);
  assert.equal(result.valid, false);
  assert.ok(result.issues.length > 0);
});
