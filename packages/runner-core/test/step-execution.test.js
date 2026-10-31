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

test("dispatches type steps with waits and enters text sequentially", async () => {
  const events = [];
  let typedText;
  let typeOptions;
  const locator = {
    async waitFor() {
      events.push("locator:wait");
    },
    async count() {
      events.push("locator:count");
      return 1;
    },
    async pressSequentially(text, options) {
      events.push("type");
      typedText = text;
      typeOptions = options;
    },
  };
  const page = {
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
    {
      action: "type",
      locator: { css: "#email" },
      text: "tester@example.invalid",
      before: [{ delay: 250 }],
      after: [{ waitForState: "domcontentloaded" }],
    },
  ]);
  assert.deepEqual(events, [
    "delay:250",
    "locator:#email",
    "locator:wait",
    "locator:count",
    "type",
    "state:domcontentloaded",
  ]);
  assert.equal(typedText, "tester@example.invalid");
  assert.ok(typeOptions.timeout > 0 && typeOptions.timeout <= 30_000);
  await run.close();
});

test("shares a type timeout between locator lookup, viewport check, and typing", async () => {
  let locatorTimeout;
  let boundingBoxOptions;
  let typeOptions;
  const locator = {
    async waitFor(options) {
      locatorTimeout = options.timeout;
    },
    async count() {
      return 1;
    },
    async boundingBox(options) {
      boundingBoxOptions = options;
      return { x: 10, y: 10, width: 100, height: 24 };
    },
    async pressSequentially(_text, options) {
      typeOptions = options;
    },
  };
  const page = {
    locator() {
      return locator;
    },
    viewportSize() {
      return { width: 300, height: 200 };
    },
  };
  const { run, session } = await createSession(page);
  await session.executeSteps("sign-in", [
    {
      action: "type",
      locator: { css: "#email" },
      text: "tester@example.invalid",
      timeout: 2_000,
      scrollIntoView: false,
    },
  ]);
  assert.ok(locatorTimeout > 0 && locatorTimeout <= 2_000);
  assert.ok(boundingBoxOptions.timeout > 0 && boundingBoxOptions.timeout <= 2_000);
  assert.ok(typeOptions.timeout > 0 && typeOptions.timeout <= 2_000);
  await run.close();
});

test("does not type when scrolling is disabled and the target is outside the viewport", async () => {
  let typeCount = 0;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async boundingBox() {
      return { x: 290, y: 10, width: 20, height: 24 };
    },
    async pressSequentially() {
      typeCount += 1;
    },
  };
  const page = {
    locator() {
      return locator;
    },
    viewportSize() {
      return { width: 300, height: 200 };
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "type",
        locator: { css: "#email" },
        text: "tester@example.invalid",
        scrollIntoView: false,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "type" &&
      /outside the viewport and scrollIntoView is false/.test(error.cause.message),
  );
  assert.equal(typeCount, 0);
  await run.close();
});

test("reports an invalid type timeout with the case and step context", async () => {
  let locatorCreated = false;
  const page = {
    locator() {
      locatorCreated = true;
      return {};
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "type",
        locator: { css: "#email" },
        text: "tester@example.invalid",
        timeout: 0,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "type" &&
      /Type timeout must be a positive integer/.test(error.cause.message),
  );
  assert.equal(locatorCreated, false);
  await run.close();
});

test("dispatches fill steps with waits and fills the matched control", async () => {
  const events = [];
  let filledValue;
  let fillOptions;
  const locator = {
    async waitFor() {
      events.push("locator:wait");
    },
    async count() {
      events.push("locator:count");
      return 1;
    },
    async fill(value, options) {
      events.push("fill");
      filledValue = value;
      fillOptions = options;
    },
  };
  const page = {
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
    {
      action: "fill",
      locator: { css: "#email" },
      value: "tester@example.invalid",
      before: [{ delay: 250 }],
      after: [{ waitForState: "domcontentloaded" }],
    },
  ]);
  assert.deepEqual(events, [
    "delay:250",
    "locator:#email",
    "locator:wait",
    "locator:count",
    "fill",
    "state:domcontentloaded",
  ]);
  assert.equal(filledValue, "tester@example.invalid");
  assert.ok(fillOptions.timeout > 0 && fillOptions.timeout <= 30_000);
  await run.close();
});

test("shares a fill timeout between locator lookup, viewport check, and filling", async () => {
  let locatorTimeout;
  let boundingBoxOptions;
  let fillOptions;
  const locator = {
    async waitFor(options) {
      locatorTimeout = options.timeout;
    },
    async count() {
      return 1;
    },
    async boundingBox(options) {
      boundingBoxOptions = options;
      return { x: 10, y: 10, width: 100, height: 24 };
    },
    async fill(_value, options) {
      fillOptions = options;
    },
  };
  const page = {
    locator() {
      return locator;
    },
    viewportSize() {
      return { width: 300, height: 200 };
    },
  };
  const { run, session } = await createSession(page);
  await session.executeSteps("sign-in", [
    {
      action: "fill",
      locator: { css: "#email" },
      value: "tester@example.invalid",
      timeout: 2_000,
      scrollIntoView: false,
    },
  ]);
  assert.ok(locatorTimeout > 0 && locatorTimeout <= 2_000);
  assert.ok(boundingBoxOptions.timeout > 0 && boundingBoxOptions.timeout <= 2_000);
  assert.ok(fillOptions.timeout > 0 && fillOptions.timeout <= 2_000);
  await run.close();
});

test("does not fill when scrolling is disabled and the target is outside the viewport", async () => {
  let fillCount = 0;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async boundingBox() {
      return { x: 290, y: 10, width: 20, height: 24 };
    },
    async fill() {
      fillCount += 1;
    },
  };
  const page = {
    locator() {
      return locator;
    },
    viewportSize() {
      return { width: 300, height: 200 };
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "fill",
        locator: { css: "#email" },
        value: "tester@example.invalid",
        scrollIntoView: false,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "fill" &&
      /outside the viewport and scrollIntoView is false/.test(error.cause.message),
  );
  assert.equal(fillCount, 0);
  await run.close();
});

test("reports an invalid fill timeout with the case and step context", async () => {
  let locatorCreated = false;
  const page = {
    locator() {
      locatorCreated = true;
      return {};
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "fill",
        locator: { css: "#email" },
        value: "tester@example.invalid",
        timeout: 0,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "fill" &&
      /Fill timeout must be a positive integer/.test(error.cause.message),
  );
  assert.equal(locatorCreated, false);
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
