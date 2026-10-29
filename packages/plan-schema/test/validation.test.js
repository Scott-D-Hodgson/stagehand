import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  caseSchemaV1,
  matchCaseReferences,
  planSchemaV1,
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

test("publishes browser defaults without inserting them into validated input", () => {
  const plan = { schemaVersion: 1, id: "defaults-test", cases: [] };
  const originalPlan = structuredClone(plan);
  assert.equal(planSchemaV1.$defs.planDefaults.properties.locale.default, "en-CA");
  assert.equal(planSchemaV1.$defs.browserSettings.properties.type.default, "chromium");
  assert.equal(planSchemaV1.$defs.browserSettings.properties.headless.default, true);
  assert.equal(planSchemaV1.$defs.browserSettings.properties.timeZone.default, "UTC");
  assert.equal(planSchemaV1.$defs.browserSettings.properties.viewport.properties.width.default, 1280);
  assert.equal(planSchemaV1.$defs.browserSettings.properties.viewport.properties.height.default, 720);
  assert.deepEqual(validatePlan(plan), { valid: true });
  assert.deepEqual(plan, originalPlan);
  assert.equal(caseSchemaV1.$defs.browserSettings.properties.headless.default, true);
});

test("rejects malformed BCP 47 plan locales and case-level locale overrides", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.defaults.locale = "en__CA";
  const result = validatePlan(plan);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/defaults/locale" && issue.keyword === "invalidLocale",
    ),
  );
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.settings = { locale: "fr-CA" };
  const caseResult = validateCase(exampleCase);
  assert.equal(caseResult.valid, false);
  assert.ok(
    caseResult.issues.some(
      (issue) =>
        issue.path === "/settings" && issue.keyword === "additionalProperties",
    ),
  );
});

test("rejects invalid IANA time zones in plan defaults and case overrides", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.defaults.browser.timeZone = "Mars/Olympus";
  const planResult = validatePlan(plan);
  assert.equal(planResult.valid, false);
  assert.ok(
    planResult.issues.some(
      (issue) =>
        issue.path === "/defaults/browser/timeZone" &&
        issue.keyword === "invalidTimeZone",
    ),
  );
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.settings = { browser: { timeZone: "Mars/Olympus" } };
  const caseResult = validateCase(exampleCase);
  assert.equal(caseResult.valid, false);
  assert.ok(
    caseResult.issues.some(
      (issue) =>
        issue.path === "/settings/browser/timeZone" &&
        issue.keyword === "invalidTimeZone",
    ),
  );
});

test("accepts each supported locator strategy in case steps", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const locators = [
    { role: "button", name: "Sign in" },
    { label: "Email" },
    { css: "#submit" },
    { xpath: "//button" },
  ];
  for (const locator of locators) {
    assert.deepEqual(validateCase({ ...exampleCase, steps: [{ locator }] }), {
      valid: true,
    });
  }
});

test("rejects a locator object that combines strategies", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const result = validateCase({
    ...exampleCase,
    steps: [{ locator: { role: "button", css: "#submit" } }],
  });
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/steps/0/locator" && issue.keyword === "oneOf",
    ),
  );
});

test("rejects unsupported browser types in plan and case settings", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.defaults.browser.type = "firefox";
  const planResult = validatePlan(plan);
  assert.equal(planResult.valid, false);
  assert.ok(
    planResult.issues.some(
      (issue) => issue.path === "/defaults/browser/type" && issue.keyword === "const",
    ),
  );
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.settings = { browser: { type: "webkit" } };
  const caseResult = validateCase(exampleCase);
  assert.equal(caseResult.valid, false);
  assert.ok(
    caseResult.issues.some(
      (issue) => issue.path === "/settings/browser/type" && issue.keyword === "const",
    ),
  );
});

test("rejects an unsupported plan version", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.schemaVersion = 2;
  assert.doesNotThrow(() => validatePlan(plan));
  const result = validatePlan(plan);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/schemaVersion" && issue.keyword === "const",
    ),
  );
});

test("rejects an unsupported case version", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.schemaVersion = 2;
  const result = validateCase(exampleCase);
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
