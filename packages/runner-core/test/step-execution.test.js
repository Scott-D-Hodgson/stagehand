import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { startBrowserRun, StepExecutionError } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

async function createSession(page) {
  const browser = {
    async newContext() {
      return {
        async newPage() {
          return page;
        },
        async close() {},
      };
    },
    async close() {},
  };
  mock.method(chromium, "launch", async () => browser);
  const run = await startBrowserRun();
  return { run, session: await run.createCaseSession() };
}

test("dispatches navigate and click steps in order with click waits", async () => {
  const events = [];
  const locator = {
    async waitFor() {
      events.push("locator:wait");
    },
    async count() {
      events.push("locator:count");
      return 1;
    },
    async click() {
      events.push("click");
    },
  };
  const page = {
    async goto(url) {
      events.push(`navigate:${url}`);
      return null;
    },
    locator(selector) {
      events.push(`locator:${selector}`);
      return locator;
    },
    async waitForTimeout(delay) {
      events.push(`delay:${delay}`);
    },
    async waitForLoadState(state) {
      events.push(`state:${state}`);
    },
  };
  const { run, session } = await createSession(page);
  await session.executeSteps("sign-in", [
    { action: "navigate", url: "https://example.com/sign-in" },
    {
      action: "click",
      locator: { css: "#continue" },
      before: [{ delay: 250 }],
      after: [{ waitForState: "domcontentloaded" }],
    },
  ]);
  assert.deepEqual(events, [
    "navigate:https://example.com/sign-in",
    "delay:250",
    "locator:#continue",
    "locator:wait",
    "locator:count",
    "click",
    "state:domcontentloaded",
  ]);
  await run.close();
});

test("passes a step's scrollIntoView setting to the click operation", async () => {
  let clickOptions;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async click(options) {
      clickOptions = options;
    },
  };
  const page = {
    locator() {
      return locator;
    },
  };
  const { run, session } = await createSession(page);
  await session.executeSteps("sign-in", [
    {
      action: "click",
      locator: { css: "#continue" },
      scrollIntoView: false,
    },
  ]);
  assert.equal(clickOptions.scroll, "none");
  assert.ok(clickOptions.timeout > 0);
  await run.close();
});

test("stops at the first failed step and reports its case and index", async () => {
  const events = [];
  const locatorError = new Error("target is unavailable");
  const page = {
    async goto(url) {
      events.push(`navigate:${url}`);
      return null;
    },
    locator() {
      return {
        async waitFor() {
          throw locatorError;
        },
      };
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      { action: "navigate", url: "https://example.com/sign-in" },
      { action: "click", locator: { css: "#continue" } },
      { action: "navigate", url: "https://example.com/next" },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 1 &&
      error.action === "click" &&
      error.cause === locatorError &&
      /Case "sign-in", step 1 \(click\) failed: target is unavailable/.test(error.message),
  );
  assert.deepEqual(events, ["navigate:https://example.com/sign-in"]);
  await run.close();
});
