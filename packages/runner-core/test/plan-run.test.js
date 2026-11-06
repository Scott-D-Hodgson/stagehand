import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { executePlanRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

function createBrowser({ onContextClose = () => {}, onNewPage = () => {}, page = {} } = {}) {
  const contexts = [];
  let launchCount = 0;
  let closeCount = 0;
  const browser = {
    async newContext() {
      const context = {
        async newPage() { onNewPage(contexts.length - 1); return page; },
        async close() { onContextClose(contexts.length - 1); },
      };
      contexts.push(context);
      return context;
    },
    async close() { closeCount += 1; },
  };
  return {
    browser,
    contexts,
    getLaunchCount() { return launchCount; },
    getCloseCount() { return closeCount; },
    launch() { launchCount += 1; return browser; },
  };
}

function caseFile(id) {
  return { version: 1, id, steps: [] };
}

function accessibilityResults() {
  return {
    url: "https://example.test/form",
    violations: [{
      id: "synthetic",
      description: "Synthetic description",
      help: "Synthetic help",
      helpUrl: "https://example.test/help",
      impact: "serious",
      tags: ["wcag2a"],
      nodes: [{ html: "<input>", target: ["input"], any: [], all: [], none: [] }],
    }],
    incomplete: [],
    passes: [],
    inapplicable: [],
  };
}

test("prepares all cases before starting Chromium and runs them sequentially", async () => {
  const browser = createBrowser();
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{ case: caseFile("first") }, { case: caseFile("second") }],
  });
  assert.equal(browser.getLaunchCount(), 1);
  assert.equal(browser.contexts.length, 2);
  assert.equal(browser.getCloseCount(), 1);
  assert.deepEqual(outcome.counts, { passed: 2, failed: 0, cancelled: 0, error: 0 });
  assert.deepEqual(outcome.cases.map((entry) => entry.caseId), ["first", "second"]);
  assert.equal(outcome.status, "passed");
});

test("returns a preflight error without starting Chromium", async () => {
  const browser = createBrowser();
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{
      case: {
        version: 1,
        id: "invalid",
        steps: [{ action: "type", locator: { css: "#email" }, text: { var: "missing" } }],
      },
    }],
  });
  assert.equal(browser.getLaunchCount(), 0);
  assert.equal(outcome.status, "error");
  assert.equal(outcome.preflightError?.reason, "missingVariable");
});

test("stops before the next case when cancellation is requested", async () => {
  const controller = new AbortController();
  const browser = createBrowser({ onContextClose(index) {
    if (index === 0) {
      controller.abort();
    }
  } });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{ case: caseFile("first") }, { case: caseFile("second") }],
    signal: controller.signal,
  });
  assert.equal(browser.contexts.length, 1);
  assert.deepEqual(outcome.counts, { passed: 1, failed: 0, cancelled: 0, error: 0 });
  assert.equal(outcome.status, "cancelled");
});

test("records cancellation before any case starts", async () => {
  const controller = new AbortController();
  controller.abort();
  const browser = createBrowser();
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{ case: caseFile("not-started") }],
    signal: controller.signal,
  });
  assert.equal(browser.getLaunchCount(), 0);
  assert.deepEqual(outcome.counts, { passed: 0, failed: 0, cancelled: 0, error: 0 });
  assert.equal(outcome.status, "cancelled");
});

test("records a hard assertion failure and continues to an independent case", async () => {
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async innerText() { return "Actual"; },
  };
  const browser = createBrowser({
    page: {
      locator() { return locator; },
      async waitForTimeout() {},
      isClosed() { return false; },
    },
  });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [
      { case: { version: 1, id: "fails", steps: [{ action: "assertText", locator: { css: "h1" }, expected: { default: "Expected" } }] } },
      { case: caseFile("later") },
    ],
  });
  assert.deepEqual(outcome.cases.map((entry) => entry.outcome.status), ["failed", "passed"]);
  assert.equal(outcome.status, "failed");
});

test("retains a hard assertion as primary when case cleanup also fails", async () => {
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async innerText() { return "Actual"; },
  };
  const browser = createBrowser({
    onContextClose() { throw new Error("Synthetic cleanup failure"); },
    page: {
      locator() { return locator; },
      async waitForTimeout() {},
      isClosed() { return false; },
    },
  });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{ case: { version: 1, id: "cleanup-after-assertion", steps: [{ action: "assertText", locator: { css: "h1" }, expected: { default: "Expected" } }] } }],
  });
  assert.equal(outcome.cases[0].outcome.status, "error");
  assert.deepEqual(outcome.cases[0].diagnostics, [
    {
      source: "runner",
      severity: "error",
      code: "assertion.hard",
      message: "A hard assertion failed.",
      stepIndex: 0,
    },
    {
      source: "runner",
      severity: "error",
      code: "cleanup.failure",
      message: "Cleanup failed after a hard assertion failure.",
      stepIndex: 0,
    },
  ]);
  assert.equal(outcome.operationalDiagnostic?.code, "cleanup.failure");
  assert.equal(outcome.status, "error");
});

test("records a browser action failure and continues to an independent case", async () => {
  const browser = createBrowser({
    onContextClose(index) {
      if (index === 0) {
        throw new Error("Synthetic cleanup failure");
      }
    },
    page: {
      isClosed() { return false; },
      async goto() { throw new Error("Synthetic navigation failure"); },
    },
  });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [
      { case: { version: 1, id: "cleanup-after-operation", steps: [{ action: "navigate", url: "https://example.test" }] } },
      { case: caseFile("later") },
    ],
  });
  assert.deepEqual(outcome.cases[0].diagnostics.map((diagnostic) => diagnostic.code), [
    "browser.action",
    "cleanup.failure",
  ]);
  assert.deepEqual(outcome.cases.map((entry) => entry.outcome.status), ["error", "passed"]);
  assert.equal(outcome.operationalDiagnostic?.code, "cleanup.failure");
  assert.equal(outcome.status, "error");
});

test("excludes browser session setup from active-case duration", async () => {
  let now = 0;
  const clock = { now() { return now; } };
  const browser = createBrowser({ onNewPage() { now = 100; } });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: [{ case: caseFile("first") }],
    clock,
  });
  assert.equal(outcome.cases[0].durationMs, 0);
  assert.equal(outcome.durationMs, 100);
});

test("marks an expired active case as an error after cleanup and continues later cases", async () => {
  let now = 0;
  const closedContexts = [];
  const clock = { now() { return now; } };
  const browser = createBrowser({
    onContextClose(index) { closedContexts.push(index); },
    page: {
      isClosed() { return false; },
      async goto() { now = 600000; return null; },
    },
  });
  mock.method(chromium, "launch", async () => browser.launch());
  const outcome = await executePlanRun({
    locale: "en-CA",
    clock,
    cases: [
      { case: { version: 1, id: "expired", steps: [{ action: "navigate", url: "https://example.test/slow" }] } },
      { case: caseFile("later") },
    ],
  });
  assert.deepEqual(outcome.cases.map((entry) => entry.outcome.status), ["error", "passed"]);
  assert.equal(outcome.cases[0].durationMs, 600000);
  assert.deepEqual(outcome.cases[0].diagnostics, [{
    source: "runner",
    severity: "error",
    code: "runner.infrastructure",
    message: "Active case execution exceeded the 10-minute limit.",
  }]);
  assert.deepEqual(closedContexts, [0, 1]);
  assert.equal(outcome.status, "error");
});

test("configured accessibility findings fail a case without stopping later steps", async () => {
  const events = [];
  const browser = createBrowser({
    page: {
      isClosed() { return false; },
      async goto(url) { events.push(url); return null; },
    },
  });
  mock.method(chromium, "launch", async () => browser.launch());
  mock.method(AxeBuilder.prototype, "analyze", async () => accessibilityResults());
  const outcome = await executePlanRun({
    locale: "en-CA",
    runSettings: { accessibility: { enabled: true, failOnViolation: true } },
    cases: [{
      case: {
        version: 1,
        id: "accessibility",
        steps: [
          { action: "navigate", url: "https://example.test/first" },
          { action: "navigate", url: "https://example.test/second" },
        ],
      },
    }],
  });
  assert.deepEqual(events, ["https://example.test/first", "https://example.test/second"]);
  assert.equal(outcome.cases[0].outcome.status, "failed");
  assert.equal(outcome.status, "failed");
});

test("records an axe scan execution error with the accessibility diagnostic code", async () => {
  const browser = createBrowser({ page: { isClosed() { return false; }, async goto() { return null; } } });
  mock.method(chromium, "launch", async () => browser.launch());
  mock.method(AxeBuilder.prototype, "analyze", async () => { throw new Error("Synthetic analysis failure"); });
  const outcome = await executePlanRun({
    locale: "en-CA",
    runSettings: { accessibility: { enabled: true } },
    cases: [{ case: { version: 1, id: "accessibility", steps: [{ action: "navigate", url: "https://example.test/form" }] } }],
  });
  assert.equal(outcome.cases[0].outcome.status, "error");
  assert.deepEqual(outcome.cases[0].diagnostics, [{
    source: "accessibility",
    severity: "error",
    code: "accessibility.scan",
    message: "Accessibility scanning failed.",
    stepIndex: 0,
  }]);
  assert.equal(outcome.status, "error");
});
