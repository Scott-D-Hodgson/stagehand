import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { resolveAccessibilitySettings, startBrowserRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

test("resolves omitted settings to disabled, non-failing, unrestricted defaults", () => {
  assert.deepEqual(resolveAccessibilitySettings(), { enabled: false, failOnViolation: false, tags: [] });
  assert.deepEqual(resolveAccessibilitySettings({}, {}), { enabled: false, failOnViolation: false, tags: [] });
});

test("inherits plan settings when case fields or the whole case settings are omitted", () => {
  const plan = { enabled: true, failOnViolation: true, tags: ["wcag2a", "wcag2aa"] };
  assert.deepEqual(resolveAccessibilitySettings(plan), plan);
  assert.deepEqual(resolveAccessibilitySettings(plan, {}), plan);
  assert.deepEqual(resolveAccessibilitySettings(plan, { enabled: undefined, failOnViolation: undefined, tags: undefined }), plan);
});

test("resolves each boolean independently and preserves explicit false overrides", () => {
  const combinations = [
    [undefined, undefined, false],
    [true, undefined, true],
    [false, undefined, false],
    [undefined, true, true],
    [undefined, false, false],
    [true, true, true],
    [true, false, false],
    [false, true, true],
    [false, false, false],
  ];
  for (const field of ["enabled", "failOnViolation"]) {
    const otherField = field === "enabled" ? "failOnViolation" : "enabled";
    for (const [planValue, caseValue, expected] of combinations) {
      const resolved = resolveAccessibilitySettings(
        { [field]: planValue, [otherField]: true, tags: ["wcag2a"] },
        { [field]: caseValue },
      );
      assert.equal(resolved[field], expected);
      assert.equal(resolved[otherField], true);
      assert.deepEqual(resolved.tags, ["wcag2a"]);
    }
  }
});

test("inherits, replaces, and clears tag lists without enabling scans or changing failure policy", () => {
  const plan = { enabled: false, failOnViolation: true, tags: ["wcag2a", "wcag2aa"] };
  assert.deepEqual(resolveAccessibilitySettings(plan, { tags: ["cat.forms"] }), {
    enabled: false, failOnViolation: true, tags: ["cat.forms"],
  });
  assert.deepEqual(resolveAccessibilitySettings(plan, { tags: [] }), {
    enabled: false, failOnViolation: true, tags: [],
  });
  assert.deepEqual(resolveAccessibilitySettings({ tags: [] }, { enabled: true }), {
    enabled: true, failOnViolation: false, tags: [],
  });
  assert.deepEqual(resolveAccessibilitySettings({}, { tags: ["wcag2a"] }), {
    enabled: false, failOnViolation: false, tags: ["wcag2a"],
  });
});

test("does not mutate inputs and returns independent settings and tag arrays", () => {
  const plan = Object.freeze({ enabled: true, tags: Object.freeze(["wcag2a"]) });
  const override = Object.freeze({ failOnViolation: false, tags: Object.freeze(["cat.forms"]) });
  const first = resolveAccessibilitySettings(plan, override);
  const second = resolveAccessibilitySettings(plan, override);
  first.enabled = false;
  first.tags.push("wcag2aa");
  assert.deepEqual(second, { enabled: true, failOnViolation: false, tags: ["cat.forms"] });
  assert.deepEqual(plan.tags, ["wcag2a"]);
  assert.deepEqual(override.tags, ["cat.forms"]);
  const inherited = resolveAccessibilitySettings(plan);
  inherited.tags.push("wcag2aa");
  assert.deepEqual(plan.tags, ["wcag2a"]);
  const defaults = resolveAccessibilitySettings();
  defaults.tags.push("wcag2a");
  assert.deepEqual(resolveAccessibilitySettings().tags, []);
});

function mockBrowser() {
  mock.method(chromium, "launch", async () => ({
    async newContext() {
      return { async newPage() { return {}; }, async close() {} };
    },
    async close() {},
  }));
}

test("case sessions expose defaults and independent effective plan/case settings", async () => {
  mockBrowser();
  const run = await startBrowserRun({ accessibility: { enabled: true, failOnViolation: true, tags: ["wcag2a"] } });
  try {
    const inherited = await run.createCaseSession();
    const replaced = await run.createCaseSession({ accessibility: { enabled: false, tags: ["cat.forms"] } });
    const cleared = await run.createCaseSession({ accessibility: { failOnViolation: false, tags: [] } });
    assert.deepEqual(inherited.accessibility, { enabled: true, failOnViolation: true, tags: ["wcag2a"] });
    assert.deepEqual(replaced.accessibility, { enabled: false, failOnViolation: true, tags: ["cat.forms"] });
    assert.deepEqual(cleared.accessibility, { enabled: true, failOnViolation: false, tags: [] });
    inherited.accessibility.tags.push("wcag2aa");
    const later = await run.createCaseSession({ accessibility: {} });
    assert.deepEqual(later.accessibility.tags, ["wcag2a"]);
    assert.deepEqual(replaced.accessibility.tags, ["cat.forms"]);
  } finally {
    await run.close();
  }
  const defaultRun = await startBrowserRun();
  try {
    const session = await defaultRun.createCaseSession();
    assert.deepEqual(session.accessibility, { enabled: false, failOnViolation: false, tags: [] });
  } finally {
    await defaultRun.close();
  }
});

test("captures run settings before launch and case settings before asynchronous setup", async () => {
  const settings = { accessibility: { enabled: true, failOnViolation: true, tags: ["wcag2a"] } };
  const caseSettings = { accessibility: { enabled: false, tags: ["cat.forms"] } };
  mock.method(chromium, "launch", async () => {
    settings.accessibility.enabled = false;
    settings.accessibility.tags.push("wcag2aa");
    return {
      async newContext() {
        caseSettings.accessibility.enabled = true;
        caseSettings.accessibility.tags.push("wcag2aa");
        return { async newPage() { return {}; }, async close() {} };
      },
      async close() {},
    };
  });
  const run = await startBrowserRun(settings);
  try {
    const overridden = await run.createCaseSession(caseSettings);
    const inherited = await run.createCaseSession();
    assert.deepEqual(overridden.accessibility, { enabled: false, failOnViolation: true, tags: ["cat.forms"] });
    assert.deepEqual(inherited.accessibility, { enabled: true, failOnViolation: true, tags: ["wcag2a"] });
  } finally {
    await run.close();
  }
});
