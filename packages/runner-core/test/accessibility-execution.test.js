import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import AxeBuilder from "@axe-core/playwright";
import { chromium, errors } from "playwright";
import { startBrowserRun, StepExecutionError, AccessibilityScanError } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

function raw(html = "<input>") {
  return { url: "https://example.test/form", violations: [{ id: "synthetic", description: "Synthetic description", help: "Synthetic help", helpUrl: "https://example.test/help", impact: "serious", tags: ["wcag2a"], nodes: [{ html, target: ["input"], any: [], all: [], none: [] }] }], incomplete: [{ id: "review", error: "Synthetic incomplete" }], passes: [], inapplicable: [] };
}

async function setup(settings = { accessibility: { enabled: true } }) {
  const events = [];
  const locator = { async waitFor() {}, async count() { return 1; }, async innerText() { return "Actual"; }, async click() { events.push("click"); }, async scrollIntoViewIfNeeded() {} };
  const page = { isClosed() { return false; }, locator() { return locator; }, async goto() { events.push("navigate"); return null; }, async waitForLoadState() { events.push("after-wait"); } };
  mock.method(chromium, "launch", async () => ({ async newContext() { return { async newPage() { return page; }, async close() { events.push("close"); } }; }, async close() {} }));
  const analyze = mock.method(AxeBuilder.prototype, "analyze", async () => { events.push("scan"); return raw(); });
  const run = await startBrowserRun(settings);
  return { run, session: await run.createCaseSession(), page, locator, events, analyze };
}

const navigate = { action: "navigate", url: "https://example.test/form" };
const assertion = { action: "assertText", locator: { css: "input" }, expected: { default: "Expected" } };

test("awaits one scan after each step and its after waits, then deduplicates findings", async () => {
  const { run, session, events } = await setup();
  try {
    await session.executeSteps("case", [navigate, { action: "click", locator: { css: "input" }, scrollIntoView: false, after: [{ waitForState: "domcontentloaded" }] }]);
    assert.deepEqual(events, ["navigate", "scan", "click", "after-wait", "scan"]);
    assert.equal(session.getAccessibilityFindings()[0].affectedNodeCount, 1);
    assert.deepEqual(session.getAccessibilityScans().map(s => [s.caseId, s.stepIndex]), [["case", 0], ["case", 1]]);
  } finally { await run.close(); }
});

test("disabled defaults skip analysis and empty step lists do not scan", async () => {
  const { run, session, analyze } = await setup({});
  try {
    await session.executeSteps("case", [navigate]);
    session.accessibility.enabled = true;
    await session.executeSteps("case", []);
    assert.equal(analyze.mock.callCount(), 0);
    assert.deepEqual(session.getAccessibilityFindings(), []);
  } finally { await run.close(); }
});

for (const soft of [true, false]) {
  test("scans after " + (soft ? "soft" : "hard") + " assertion mismatch and preserves continuation", async () => {
    const { run, session, events } = await setup();
    try {
      const result = session.executeSteps("case", [{ ...assertion, soft }, navigate]);
      if (soft) assert.equal((await result).length, 1);
      else await assert.rejects(result, e => e instanceof StepExecutionError && /Expected/.test(e.message));
      assert.deepEqual(events, soft ? ["scan", "navigate", "scan"] : ["scan"]);
      assert.equal(session.getAccessibilityFindings().length, 1);
    } finally { await run.close(); }
  });
}

test("scans recognized assertion read timeouts but skips unsafe errors and failed actions", async () => {
  const { run, session, locator, page, analyze } = await setup();
  try {
    locator.innerText = async () => { throw new errors.TimeoutError("Synthetic timeout"); };
    await assert.rejects(session.executeSteps("case", [assertion]), StepExecutionError);
    assert.equal(analyze.mock.callCount(), 1);
    locator.innerText = async () => { throw new Error("browser disconnected"); };
    await assert.rejects(session.executeSteps("case", [assertion]), StepExecutionError);
    page.goto = async () => { throw new Error("navigation failed"); };
    await assert.rejects(session.executeSteps("case", [navigate]), StepExecutionError);
    assert.equal(analyze.mock.callCount(), 1);
  } finally { await run.close(); }
});

test("closed pages skip assessment", async () => {
  const { run, session, page, analyze } = await setup();
  try {
    page.isClosed = () => true;
    await session.executeSteps("case", [navigate]);
    assert.equal(analyze.mock.callCount(), 0);
  } finally { await run.close(); }
});

test("preserves scan rejections with step context and keeps earlier findings", async () => {
  const { run, session } = await setup();
  try {
    await session.executeSteps("case", [navigate]);
    const cause = new Error("Synthetic analysis failure");
    mock.method(session, "scanAccessibility", async () => { throw new AccessibilityScanError(cause); });
    await assert.rejects(session.executeSteps("case", [navigate, navigate]), e => e instanceof StepExecutionError && e.stepIndex === 0 && e.cause instanceof AccessibilityScanError && e.cause.cause === cause);
    assert.equal(session.getAccessibilityFindings().length, 1);
    assert.equal(session.getAccessibilityScans().length, 1);
  } finally { await run.close(); }
});

test("preserves both hard assertion and scan errors", async () => {
  const { run, session } = await setup();
  try {
    const scanError = new AccessibilityScanError(new Error("Synthetic analysis failure"));
    mock.method(session, "scanAccessibility", async () => { throw scanError; });
    await assert.rejects(session.executeSteps("case", [assertion]), e => e instanceof StepExecutionError && e.cause instanceof AggregateError && e.cause.errors.length === 2 && e.cause.errors[1] === scanError);
  } finally { await run.close(); }
});

test("keeps per-session findings isolated, accumulates repeated dispatch, and exposes copied findings", async () => {
  const { run, session } = await setup({ accessibility: { enabled: true, failOnViolation: true } });
  try {
    const other = await run.createCaseSession();
    await session.executeSteps("case", [navigate]);
    const snapshot = session.getAccessibilityFindings();
    snapshot[0].affectedNodes[0].target.push("changed");
    await session.executeSteps("case", [navigate]);
    assert.equal(session.getAccessibilityFindings()[0].affectedNodeCount, 1);
    assert.deepEqual(session.getAccessibilityFindings()[0].affectedNodes[0].target, ["input"]);
    assert.deepEqual(other.getAccessibilityFindings(), []);
    const scans = session.getAccessibilityScans();
    assert.equal(scans[0].results.incomplete.length, 1);
    scans[0].stepIndex = 99;
    scans.pop();
    assert.equal(session.getAccessibilityScans()[0].stepIndex, 0);
    assert.equal(session.getAccessibilityScans().length, 2);
  } finally { await run.close(); }
});

for (const tags of [undefined, [], ["wcag2a"], ["wcag2a", "wcag2aa"]]) {
  test("automatic scans respect inherited/replaced/cleared tags " + JSON.stringify(tags), async () => {
    const { run, session } = await setup({ accessibility: { enabled: true, tags: ["cat.forms"] } });
    const filters = [];
    mock.method(AxeBuilder.prototype, "withTags", function (value) { filters.push([...value]); return this; });
    try {
      const target = await run.createCaseSession({ accessibility: tags === undefined ? {} : { tags } });
      await target.executeSteps("other", [navigate]);
      assert.deepEqual(filters, tags?.length === 0 ? [] : [tags ?? ["cat.forms"]]);
      const disabled = await run.createCaseSession({ accessibility: { enabled: false } });
      await disabled.executeSteps("disabled", [navigate]);
      assert.deepEqual(disabled.getAccessibilityScans(), []);
      assert.deepEqual(session.getAccessibilityScans(), []);
    } finally { await run.close(); }
  });
}


test("awaits analysis before executing the next step and direct operations remain explicit", async () => {
  const { run, session, events } = await setup();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let started;
  const scanning = new Promise(resolve => { started = resolve; });
  mock.method(session, "scanAccessibility", async () => { events.push("blocked-scan"); started(); await gate; return { status: "completed", results: raw() }; });
  try {
    await session.navigate("https://example.test/form");
    assert.deepEqual(session.getAccessibilityScans(), []);
    events.length = 0;
    const execution = session.executeSteps("case", [navigate, navigate]);
    await scanning;
    assert.deepEqual(events, ["navigate", "blocked-scan"]);
    release();
    await execution;
    assert.deepEqual(events, ["navigate", "blocked-scan", "navigate", "blocked-scan"]);
  } finally { release(); await run.close(); }
});
