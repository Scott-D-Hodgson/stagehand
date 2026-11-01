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

test("accepts the full action and assertion example through the public entry point", () => {
  const actionCase = readFixture("../examples/cases/action-contract.json");
  assert.deepEqual(validateCase(actionCase), { valid: true });
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
  assert.equal(planSchemaV1.$defs.accessibilitySettings.properties.enabled.default, false);
  assert.equal(planSchemaV1.$defs.accessibilitySettings.properties.failOnViolation.default, false);
  assert.deepEqual(validatePlan(plan), { valid: true });
  assert.deepEqual(plan, originalPlan);
  assert.equal("headless" in caseSchemaV1.$defs.browserSettings.properties, false);
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  assert.equal(
    validateCase({ ...exampleCase, settings: { browser: { headless: false } } }).valid,
    false,
  );
  assert.equal(caseSchemaV1.$defs.accessibilitySettings.properties.enabled.default, false);
  assert.equal(caseSchemaV1.$defs.accessibilitySettings.properties.failOnViolation.default, false);
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

test("accepts each supported locator strategy in click steps", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const locators = [
    { role: "button", name: "Sign in" },
    { label: "Email" },
    { css: "#submit" },
    { xpath: "//button" },
  ];
  for (const locator of locators) {
    assert.deepEqual(validateCase({ ...exampleCase, steps: [{ action: "click", locator }] }), {
      valid: true,
    });
  }
});

test("rejects an action fixture with an unknown step property", () => {
  const invalidCase = readFixture("./fixtures/invalid-action-case.json");
  const result = validateCase(invalidCase);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.keyword === "unevaluatedProperties"));
});

test("rejects unsupported actions and missing action-specific fields", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const invalidSteps = [
    { action: "hover", locator: { role: "button" } },
    { action: "click" },
    { action: "type", locator: { label: "Email" } },
    { action: "fill", locator: { label: "Email" } },
    { action: "navigate" },
    { action: "assertText", locator: { role: "heading" } },
  ];
  for (const step of invalidSteps) {
    assert.equal(validateCase({ ...exampleCase, steps: [step] }).valid, false);
  }
});

test("requires navigation URLs to be absolute HTTP or HTTPS URLs", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  for (const url of [
    "https://example.com/sign-in",
    "http://localhost:3000/sign-in",
    "HTTPS://example.com/sign-in",
  ]) {
    assert.deepEqual(
      validateCase({ ...exampleCase, steps: [{ action: "navigate", url }] }),
      { valid: true },
    );
  }
  for (const url of [
    "/sign-in",
    "../sign-in",
    "//example.com/sign-in",
    "ftp://example.com/sign-in",
    "javascript:alert(1)",
    "https://",
    "https:example.com/sign-in",
  ]) {
    const result = validateCase({
      ...exampleCase,
      steps: [{ action: "navigate", url }],
    });
    assert.equal(result.valid, false, `Expected ${url} to be rejected.`);
    assert.ok(
      result.issues.some(
        (issue) =>
          issue.path === "/steps/0/url" &&
          (issue.keyword === "pattern" || issue.keyword === "invalidNavigationUrl"),
      ),
      `Expected ${url} to report a navigation URL issue.`,
    );
  }
  const missingHost = validateCase({
    ...exampleCase,
    steps: [{ action: "navigate", url: "https://" }],
  });
  assert.ok(
    missingHost.issues.some(
      (issue) =>
        issue.path === "/steps/0/url" &&
        issue.keyword === "invalidNavigationUrl",
    ),
  );
});

test("requires selectOption to use exactly one of value or label", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const locator = { label: "Region" };
  for (const selection of [{}, { value: "CA", label: "Canada" }]) {
    const result = validateCase({
      ...exampleCase,
      steps: [{ action: "selectOption", locator, ...selection }],
    });
    assert.equal(result.valid, false);
  }
  for (const selection of [{ value: "CA" }, { label: "Canada" }]) {
    assert.deepEqual(validateCase({
      ...exampleCase,
      steps: [{ action: "selectOption", locator, ...selection }],
    }), { valid: true });
  }
});

test("validates wait-list shapes and timeout/delay bounds", () => {
  const actionCase = readFixture("../examples/cases/action-contract.json");
  const click = actionCase.steps[1];
  const invalidCases = [
    { ...click, before: [{ waitForState: "load" }] },
    { ...click, before: [{ delay: 0 }] },
    { ...click, before: [{ delay: 30001 }] },
    { ...click, before: [{ waitFor: { label: "Email" }, timeout: 0 }] },
    { ...click, timeout: 1.5 },
  ];
  for (const step of invalidCases) {
    assert.equal(validateCase({ ...actionCase, steps: [step] }).valid, false);
  }
});

test("rejects invalid and duplicate canonical locale keys in expected values", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const makeCase = (locales) => ({
    ...exampleCase,
    steps: [{
      action: "assertText",
      locator: { role: "heading" },
      expected: { default: "Welcome", locales },
    }],
  });
  const invalidLocale = validateCase(makeCase({ "en__CA": "Welcome" }));
  assert.equal(invalidLocale.valid, false);
  assert.ok(invalidLocale.issues.some((issue) => issue.keyword === "invalidLocale"));
  const duplicateLocale = validateCase(makeCase({ "en-us": "Hello", "en-US": "Hello" }));
  assert.equal(duplicateLocale.valid, false);
  assert.ok(duplicateLocale.issues.some((issue) => issue.keyword === "duplicateLocale"));
});

test("accepts scalar variable definitions with optional same-type locale variants", () => {
  const variables = {
    greeting: { default: "Hello", locales: { "fr-CA": "Bonjour" } },
    retries: { default: 3, locales: { "fr-CA": 4 } },
    enabled: { default: true, locales: { "fr-CA": false } },
  };
  const plan = { ...planWithReferences(), variables };
  const exampleCase = { schemaVersion: 1, id: "variable-test", variables, steps: [] };
  assert.deepEqual(validatePlan(plan), { valid: true });
  assert.deepEqual(validateCase(exampleCase), { valid: true });
});

test("rejects invalid variable definitions in plans and cases", () => {
  const invalidVariables = [
    { greeting: {} },
    { greeting: { default: null } },
    { greeting: { default: ["Hello"] } },
    { greeting: { default: { value: "Hello" } } },
    { greeting: { default: "Hello", locales: { "fr-CA": 3 } } },
    { greeting: { default: 3, locales: { "fr-CA": false } } },
    { greeting: { default: true, locales: { "fr-CA": "false" } } },
    { greeting: { default: "Hello", extra: true } },
    { "": { default: "Hello" } },
  ];
  for (const variables of invalidVariables) {
    assert.equal(validatePlan({ ...planWithReferences(), variables }).valid, false);
    assert.equal(
      validateCase({ schemaVersion: 1, id: "variable-test", variables, steps: [] }).valid,
      false,
    );
  }
});

test("rejects invalid and duplicate canonical locale keys in variable definitions", () => {
  const invalidLocale = {
    greeting: { default: "Hello", locales: { "en__CA": "Hello" } },
  };
  const duplicateLocale = {
    greeting: {
      default: "Hello",
      locales: { "en-us": "Hello", "en-US": "Hello" },
    },
  };
  for (const variables of [invalidLocale, duplicateLocale]) {
    const planResult = validatePlan({ ...planWithReferences(), variables });
    const caseResult = validateCase({
      schemaVersion: 1,
      id: "variable-test",
      variables,
      steps: [],
    });
    assert.equal(planResult.valid, false);
    assert.equal(caseResult.valid, false);
    const keyword = variables === invalidLocale ? "invalidLocale" : "duplicateLocale";
    assert.ok(planResult.issues.some((issue) => issue.keyword === keyword));
    assert.ok(caseResult.issues.some((issue) => issue.keyword === keyword));
  }
});

test("accepts variable references in agreed action and assertion fields", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const steps = [
    { action: "navigate", url: { var: "baseUrl" } },
    { action: "type", locator: { label: "Email" }, text: { var: "email" } },
    { action: "fill", locator: { label: "Password" }, value: { var: "password" } },
    { action: "selectOption", locator: { label: "Region" }, value: { var: "region" } },
    { action: "selectOption", locator: { label: "Language" }, label: { var: "language" } },
    {
      action: "assertText",
      locator: { role: "heading" },
      expected: { default: { var: "heading" }, locales: { "fr-CA": { var: "headingFr" } } },
    },
    {
      action: "assertValue",
      locator: { label: "Email" },
      expected: { default: { var: "email" } },
      associatedLabel: { default: { var: "emailLabel" } },
    },
  ];
  assert.deepEqual(validateCase({ ...exampleCase, steps }), { valid: true });
});

test("rejects malformed variable references in supported fields", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const invalidSteps = [
    { action: "navigate", url: { var: "" } },
    { action: "type", locator: { label: "Email" }, text: { var: 3 } },
    { action: "fill", locator: { label: "Email" }, value: { var: "email", extra: true } },
    { action: "selectOption", locator: { label: "Region" }, value: { variable: "region" } },
    {
      action: "assertText",
      locator: { role: "heading" },
      expected: { default: { var: "heading", extra: true } },
    },
  ];
  for (const step of invalidSteps) {
    assert.equal(validateCase({ ...exampleCase, steps: [step] }).valid, false);
  }
});

test("rejects variable references outside agreed action and assertion fields", () => {
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  const invalidSteps = [
    { action: "navigate", url: "https://example.invalid", waitUntil: { var: "wait" } },
    { action: "click", locator: { role: { var: "buttonRole" } } },
    { action: "type", locator: { label: "Email" }, text: "email", timeout: { var: "timeout" } },
    { action: "fill", locator: { label: "Email" }, value: "email", scrollIntoView: { var: "scroll" } },
    {
      action: "assertText",
      locator: { role: "heading" },
      expected: { default: "Welcome" },
      soft: { var: "soft" },
    },
  ];
  for (const step of invalidSteps) {
    assert.equal(validateCase({ ...exampleCase, steps: [step] }).valid, false);
  }
});

test("accepts accessibility failure policy on plan and case settings", () => {
  const plan = readFixture("../examples/checkout-plan.json");
  plan.defaults.accessibility = { failOnViolation: true };
  assert.deepEqual(validatePlan(plan), { valid: true });
  const exampleCase = readFixture("../examples/cases/sign-in.json");
  exampleCase.settings = { accessibility: { failOnViolation: true } };
  assert.deepEqual(validateCase(exampleCase), { valid: true });
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
  const secondCase = {
    ...firstCase,
    steps: [{ action: "click", locator: { role: "button" } }],
  };
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

test("accepts known axe tags, empty lists, and omitted lists at plan and case scope", () => {
  for (const tags of [undefined, [], ["wcag2a"], ["wcag2a", "wcag2aa"], ["ACT", "cat.forms", "experimental"]]) {
    const accessibility = tags === undefined ? { enabled: true } : { enabled: true, tags };
    const plan = { ...planWithReferences("case.json"), defaults: { accessibility } };
    const exampleCase = { schemaVersion: 1, id: "tag-test", settings: { accessibility }, steps: [] };
    assert.deepEqual(validatePlan(plan), { valid: true });
    assert.deepEqual(validateCase(exampleCase), { valid: true });
  }
});

test("rejects unknown and incorrectly cased axe tags at the offending array item", () => {
  for (const tag of ["wcag2aaa-typo", "WCAG2A", "wcag2a ", "", "not-a-real-tag"]) {
    const plan = { ...planWithReferences(), defaults: { accessibility: { tags: ["wcag2a", tag] } } };
    const exampleCase = { schemaVersion: 1, id: "tag-test", settings: { accessibility: { tags: ["wcag2a", tag] } }, steps: [] };
    const planResult = validatePlan(plan);
    const caseResult = validateCase(exampleCase);
    assert.equal(planResult.valid, false);
    assert.equal(caseResult.valid, false);
    assert.ok(planResult.issues.some((issue) => issue.path === "/defaults/accessibility/tags/1" && issue.keyword === "enum"));
    assert.ok(caseResult.issues.some((issue) => issue.path === "/settings/accessibility/tags/1" && issue.keyword === "enum"));
  }
});

test("rejects non-array tag configuration and non-string tag entries", () => {
  for (const tags of [null, "wcag2a", {}, 3, [null], [3], [{}]]) {
    const plan = { ...planWithReferences(), defaults: { accessibility: { tags } } };
    const exampleCase = { schemaVersion: 1, id: "tag-test", settings: { accessibility: { tags } }, steps: [] };
    assert.equal(validatePlan(plan).valid, false);
    assert.equal(validateCase(exampleCase).valid, false);
  }
});

test("rejects repeated tags in either configuration scope", () => {
  const accessibility = { tags: ["wcag2a", "wcag2a"] };
  const planResult = validatePlan({ ...planWithReferences(), defaults: { accessibility } });
  const caseResult = validateCase({ schemaVersion: 1, id: "tag-test", settings: { accessibility }, steps: [] });
  assert.equal(planResult.valid, false);
  assert.equal(caseResult.valid, false);
  assert.ok(planResult.issues.some((issue) => issue.keyword === "uniqueItems"));
  assert.ok(caseResult.issues.some((issue) => issue.keyword === "uniqueItems"));
});

test("preserves omitted, replacement, and clearing case tag lists without applying inheritance", () => {
  for (const settings of [undefined, { accessibility: {} }, { accessibility: { tags: ["cat.forms"] } }, { accessibility: { tags: [] } }]) {
    const plan = { ...planWithReferences("case.json"), defaults: { accessibility: { enabled: true, tags: ["wcag2a", "wcag2aa"] } } };
    const exampleCase = { schemaVersion: 1, id: "tag-test", steps: [], ...(settings === undefined ? {} : { settings }) };
    const original = structuredClone({ plan, exampleCase });
    assert.deepEqual(validatePlanBundle(plan, [exampleCase]), { valid: true });
    assert.deepEqual({ plan, exampleCase }, original);
  }
  assert.equal("default" in planSchemaV1.$defs.accessibilitySettings.properties.tags, false);
  assert.equal("default" in caseSchemaV1.$defs.accessibilitySettings.properties.tags, false);
});

test("reports unknown case tags through bundle validation with the case-file path", () => {
  const plan = { ...planWithReferences("case.json"), defaults: { accessibility: { tags: ["wcag2a"] } } };
  const exampleCase = { schemaVersion: 1, id: "tag-test", settings: { accessibility: { enabled: false, tags: ["misspelled-tag"] } }, steps: [] };
  const result = validatePlanBundle(plan, [exampleCase]);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.path === "/caseFiles/0/settings/accessibility/tags/0" && issue.keyword === "enum"));
});

test("publishes matching standalone axe 4.14.0 tag inventories", () => {
  assert.deepEqual(planSchemaV1.$defs.axeTag, caseSchemaV1.$defs.axeTag);
  assert.ok(planSchemaV1.$defs.axeTag.enum.includes("wcag2a"));
  assert.ok(planSchemaV1.$defs.axeTag.enum.includes("experimental"));
  assert.ok(planSchemaV1.$defs.axeTag.enum.includes("ACT"));
  assert.equal(new Set(planSchemaV1.$defs.axeTag.enum).size, planSchemaV1.$defs.axeTag.enum.length);
});
