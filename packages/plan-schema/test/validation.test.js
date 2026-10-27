import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  matchCaseReferences,
  validateCase,
  validatePlan,
  validatePlanBundle,
} from "@stagehand/plan-schema";

function readFixture(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

function planWithReferences(...paths) {
  return {
    schemaVersion: 1,
    id: "reference-test-plan",
    cases: paths.map((path) => ({ path })),
  };
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

test("matches normalized relative paths and preserves the supplied file path", () => {
  const plan = planWithReferences("cases//./sub/../sign-in.json");
  const result = matchCaseReferences(plan, ["cases/sign-in.json"]);
  assert.deepEqual(result, {
    valid: true,
    matches: [
      {
        caseIndex: 0,
        reference: "cases//./sub/../sign-in.json",
        normalizedPath: "cases/sign-in.json",
        filePath: "cases/sign-in.json",
      },
    ],
  });
});

test("rejects a reference that escapes the plan directory", () => {
  const result = matchCaseReferences(planWithReferences("../outside.json"), []);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/cases/0/path" && issue.keyword === "pathEscapesPlan",
    ),
  );
});

test("detects duplicate references after path normalization", () => {
  const plan = planWithReferences(
    "cases/sign-in.json",
    "cases/sub/../sign-in.json",
  );
  const result = matchCaseReferences(plan, ["cases/sign-in.json"]);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/cases/1/path" && issue.keyword === "duplicateReference",
    ),
  );
});

test("matches paths case-sensitively", () => {
  const result = matchCaseReferences(
    planWithReferences("cases/Login.json"),
    ["cases/login.json"],
  );
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some((issue) => issue.keyword === "missingReference"),
  );
});

test("reports an ambiguous match when imported paths normalize to the same path", () => {
  const result = matchCaseReferences(
    planWithReferences("cases/sign-in.json"),
    ["cases/sign-in.json", "cases/./sign-in.json"],
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.keyword === "ambiguousMatch"));
});

test("ignores imported files that the plan does not reference", () => {
  const result = matchCaseReferences(
    planWithReferences("cases/sign-in.json"),
    ["cases/sign-in.json", "unreferenced.json"],
  );
  assert.equal(result.valid, true);
  assert.equal(result.matches.length, 1);
});

test("returns successful matches when another case reference is missing", () => {
  const result = matchCaseReferences(
    planWithReferences("cases/sign-in.json", "cases/missing.json"),
    ["cases/sign-in.json"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.matches, [
    {
      caseIndex: 0,
      reference: "cases/sign-in.json",
      normalizedPath: "cases/sign-in.json",
      filePath: "cases/sign-in.json",
    },
  ]);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/cases/1/path" && issue.keyword === "missingReference",
    ),
  );
});

test("returns plan schema issues before attempting reference matching", () => {
  const invalidPlan = { schemaVersion: 1, cases: [{ path: "cases/sign-in.json" }] };
  const result = matchCaseReferences(invalidPlan, ["cases/sign-in.json"]);
  assert.equal(result.valid, false);
  assert.equal(result.matches.length, 0);
  assert.ok(result.issues.some((issue) => issue.keyword === "required"));
});

test("validates parsed case files for a plan bundle", () => {
  const plan = planWithReferences("cases/sign-in.json");
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  assert.deepEqual(validatePlanBundle(plan, [exampleCase]), { valid: true });
});

test("reports case schema issues under the matching parsed case index", () => {
  const plan = planWithReferences("cases/sign-in.json");
  const invalidCase = readFixture("../examples/cases/sign-in.json");
  invalidCase.steps = "not-an-array";
  const result = validatePlanBundle(plan, [invalidCase]);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/caseFiles/0/steps" && issue.keyword === "type",
    ),
  );
});

test("rejects duplicate case IDs within a plan bundle", () => {
  const plan = planWithReferences("cases/first.json", "cases/second.json");
  const firstCase = readFixture("../examples/cases/sign-in.json");
  const secondCase = { ...firstCase, steps: [{ action: "placeholder" }] };
  const result = validatePlanBundle(plan, [firstCase, secondCase]);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/caseFiles/1/id" && issue.keyword === "uniqueCaseId",
    ),
  );
});

test("requires one parsed case for each plan reference", () => {
  const plan = planWithReferences("cases/first.json", "cases/second.json");
  const firstCase = readFixture("../examples/cases/sign-in.json");
  const result = validatePlanBundle(plan, [firstCase]);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/caseFiles" && issue.keyword === "caseCount",
    ),
  );
});
