import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { AccessibilityScanError, startBrowserRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

async function createSession(page = {}, runSettings = {}, caseSettings = {}) {
  mock.method(chromium, "launch", async () => ({
    async newContext() {
      return { async newPage() { return page; }, async close() {} };
    },
    async close() {},
  }));
  const run = await startBrowserRun(runSettings);
  return { run, session: await run.createCaseSession(caseSettings) };
}

function observations() {
  return {
    url: "https://example.test/form",
    testEngine: { name: "axe-core", version: "4.14.0" },
    violations: [{ id: "synthetic-rule", tags: ["wcag2a"], nodes: [] }],
    incomplete: [{ id: "synthetic-review", error: { message: "Manual review required" }, nodes: [] }],
    passes: [],
    inapplicable: [],
  };
}

test("skips disabled scans without invoking axe or page evaluation", async () => {
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => { assert.fail("must not scan"); });
  const filter = mock.method(AxeBuilder.prototype, "withTags", () => { assert.fail("must not filter"); });
  const { run, session } = await createSession({ async evaluate() { assert.fail("must not evaluate"); } });
  try {
    assert.deepEqual(await session.scanAccessibility(), { status: "disabled" });
    assert.equal(analyze.mock.callCount(), 0);
    assert.equal(filter.mock.callCount(), 0);
  } finally {
    await run.close();
  }
});

test("returns raw violations and incomplete observations without applying failure policy", async () => {
  const results = observations();
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => results);
  const filter = mock.method(AxeBuilder.prototype, "withTags", () => { assert.fail("empty tags must not configure a filter"); });
  const { run, session } = await createSession({}, { accessibility: { enabled: true, failOnViolation: true } });
  try {
    const outcome = await session.scanAccessibility();
    assert.equal(outcome.status, "completed");
    assert.equal(outcome.results, results);
    assert.equal(outcome.results.violations.length, 1);
    assert.equal(outcome.results.incomplete.length, 1);
    assert.equal(analyze.mock.callCount(), 1);
    assert.equal(filter.mock.callCount(), 0);
  } finally {
    await run.close();
  }
});

for (const tags of [["wcag2a"], ["wcag2a", "wcag2aa"]]) {
  test(`applies ${tags.length} selected tags before analysis using a copied list`, async () => {
    const events = [];
    mock.method(AxeBuilder.prototype, "withTags", function (received) {
      events.push(["tags", [...received]]);
      received.push("synthetic-builder-mutation");
      return this;
    });
    mock.method(AxeBuilder.prototype, "analyze", async () => {
      events.push(["analyze"]);
      return observations();
    });
    const { run, session } = await createSession({}, { accessibility: { enabled: true, tags } });
    try {
      assert.equal((await session.scanAccessibility()).status, "completed");
      assert.deepEqual(events, [["tags", tags], ["analyze"]]);
      assert.deepEqual(session.accessibility.tags, tags);
    } finally {
      await run.close();
    }
  });
}

test("uses effective case overrides for disabling and replacing or clearing plan tags", async () => {
  const filters = [];
  mock.method(AxeBuilder.prototype, "withTags", function (tags) {
    filters.push([...tags]);
    return this;
  });
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => observations());
  const { run, session: inherited } = await createSession({}, { accessibility: { enabled: true, tags: ["wcag2a"] } });
  try {
    const disabled = await run.createCaseSession({ accessibility: { enabled: false, tags: ["cat.forms"] } });
    const replaced = await run.createCaseSession({ accessibility: { tags: ["cat.forms"] } });
    const cleared = await run.createCaseSession({ accessibility: { tags: [] } });
    assert.deepEqual(await disabled.scanAccessibility(), { status: "disabled" });
    await inherited.scanAccessibility();
    await replaced.scanAccessibility();
    await cleared.scanAccessibility();
    assert.deepEqual(filters, [["wcag2a"], ["cat.forms"]]);
    assert.equal(analyze.mock.callCount(), 3);
  } finally {
    await run.close();
  }
});

test("creates a fresh builder for each explicit scan and reads that session's settings", async () => {
  const builders = [];
  const filters = [];
  mock.method(AxeBuilder.prototype, "withTags", function (tags) {
    filters.push([...tags]);
    return this;
  });
  mock.method(AxeBuilder.prototype, "analyze", async function () {
    builders.push(this);
    return observations();
  });
  const { run, session } = await createSession({}, { accessibility: { enabled: true, tags: ["wcag2a"] } });
  try {
    await session.scanAccessibility();
    session.accessibility.tags = ["cat.forms"];
    await session.scanAccessibility();
    assert.notEqual(builders[0], builders[1]);
    assert.deepEqual(filters, [["wcag2a"], ["cat.forms"]]);
  } finally {
    await run.close();
  }
});

test("allows a case to enable scanning over disabled run defaults", async () => {
  const results = observations();
  const filters = [];
  mock.method(AxeBuilder.prototype, "withTags", function (tags) {
    filters.push([...tags]);
    return this;
  });
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => results);
  const { run, session } = await createSession(
    {},
    { accessibility: { enabled: false, tags: ["wcag2a"] } },
    { accessibility: { enabled: true } },
  );
  try {
    const outcome = await session.scanAccessibility();
    assert.equal(outcome.status, "completed");
    assert.equal(outcome.results, results);
    assert.deepEqual(filters, [["wcag2a"]]);
    assert.equal(analyze.mock.callCount(), 1);
  } finally {
    await run.close();
  }
});

test("wraps analysis rejections with their original cause instead of returning a violation", async () => {
  let cause;
  mock.method(AxeBuilder.prototype, "analyze", async () => { throw cause; });
  const { run, session } = await createSession({}, { accessibility: { enabled: true } });
  try {
    for (cause of [new Error("browser connection closed"), "synthetic rejection"]) {
      await assert.rejects(session.scanAccessibility(), (error) => {
        assert.ok(error instanceof AccessibilityScanError);
        assert.equal(error.name, "AccessibilityScanError");
        assert.equal(error.cause, cause);
        assert.match(error.message, /^Accessibility scan failed:/);
        return true;
      });
    }
  } finally {
    await run.close();
  }
});

test("wraps tag-configuration errors without starting analysis", async () => {
  const cause = new Error("synthetic tag configuration failure");
  mock.method(AxeBuilder.prototype, "withTags", () => { throw cause; });
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => { assert.fail("must not analyze"); });
  const { run, session } = await createSession({}, { accessibility: { enabled: true, tags: ["wcag2a"] } });
  try {
    await assert.rejects(session.scanAccessibility(), (error) => error instanceof AccessibilityScanError && error.cause === cause);
    assert.equal(analyze.mock.callCount(), 0);
  } finally {
    await run.close();
  }
});

test("binds the actual adapter to the case page and preserves its evaluation failure", async () => {
  const cause = new Error("synthetic page evaluation failure");
  let evaluations = 0;
  const page = { async evaluate() { evaluations += 1; throw cause; } };
  const { run, session } = await createSession(page, { accessibility: { enabled: true } });
  try {
    await assert.rejects(session.scanAccessibility(), (error) => error instanceof AccessibilityScanError && error.cause === cause);
    assert.equal(evaluations, 1);
  } finally {
    await run.close();
  }
});

test("does not scan automatically during session creation or step dispatch", async () => {
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => observations());
  const { run, session } = await createSession({ async goto() { return null; } }, { accessibility: { enabled: true } });
  try {
    await session.executeSteps("synthetic-case", [{ action: "navigate", url: "https://example.test/form" }]);
    assert.equal(analyze.mock.callCount(), 0);
    await session.scanAccessibility();
    assert.equal(analyze.mock.callCount(), 1);
  } finally {
    await run.close();
  }
});
