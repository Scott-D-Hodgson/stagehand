import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium, errors } from "playwright";
import { startBrowserRun, StepExecutionError } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

async function createSession(page, settings = {}) {
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
  const run = await startBrowserRun(settings);
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

test("dispatches selectOption by value with ordered waits", async () => {
  const events = [];
  let selectedOption;
  let selectOptions;
  const locator = {
    async waitFor() {
      events.push("locator:wait");
    },
    async count() {
      events.push("locator:count");
      return 1;
    },
    async selectOption(option, options) {
      events.push("selectOption");
      selectedOption = option;
      selectOptions = options;
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
  await session.executeSteps("preferences", [
    {
      action: "selectOption",
      locator: { css: "select[name=language]" },
      value: "fr-CA",
      before: [{ delay: 200 }],
      after: [{ waitForState: "domcontentloaded" }],
    },
  ]);
  assert.deepEqual(events, [
    "delay:200",
    "locator:select[name=language]",
    "locator:wait",
    "locator:count",
    "selectOption",
    "state:domcontentloaded",
  ]);
  assert.deepEqual(selectedOption, { value: "fr-CA" });
  assert.ok(selectOptions.timeout > 0 && selectOptions.timeout <= 30_000);
  await run.close();
});

test("selects an option by its visible label through the case-session API", async () => {
  let selectedOption;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async selectOption(option) {
      selectedOption = option;
    },
  };
  const { run, session } = await createSession({ locator: () => locator });
  await session.selectOption({ css: "#language" }, { label: "French (Canada)" });
  assert.deepEqual(selectedOption, { label: "French (Canada)" });
  await run.close();
});

test("shares a selectOption timeout between locator lookup, viewport check, and selection", async () => {
  let locatorTimeout;
  let boundingBoxOptions;
  let selectOptions;
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
    async selectOption(_option, options) {
      selectOptions = options;
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
  await session.executeSteps("preferences", [
    {
      action: "selectOption",
      locator: { css: "#language" },
      label: "French (Canada)",
      timeout: 2_000,
      scrollIntoView: false,
    },
  ]);
  assert.ok(locatorTimeout > 0 && locatorTimeout <= 2_000);
  assert.ok(boundingBoxOptions.timeout > 0 && boundingBoxOptions.timeout <= 2_000);
  assert.ok(selectOptions.timeout > 0 && selectOptions.timeout <= 2_000);
  await run.close();
});

test("does not select an option when scrolling is disabled and the control is outside the viewport", async () => {
  let selectCount = 0;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async boundingBox() {
      return { x: 290, y: 10, width: 20, height: 24 };
    },
    async selectOption() {
      selectCount += 1;
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
    session.executeSteps("preferences", [
      {
        action: "selectOption",
        locator: { css: "#language" },
        value: "fr-CA",
        scrollIntoView: false,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "preferences" &&
      error.stepIndex === 0 &&
      error.action === "selectOption" &&
      /outside the viewport and scrollIntoView is false/.test(error.cause.message),
  );
  assert.equal(selectCount, 0);
  await run.close();
});

test("rejects invalid selectOption settings with case and step context", async () => {
  let locatorCreated = false;
  const page = {
    locator() {
      locatorCreated = true;
      return {};
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("preferences", [
      {
        action: "selectOption",
        locator: { css: "#language" },
        value: "fr-CA",
        timeout: 0,
      },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "preferences" &&
      error.stepIndex === 0 &&
      error.action === "selectOption" &&
      /selectOption timeout must be a positive integer/.test(error.cause.message),
  );
  assert.equal(locatorCreated, false);
  await assert.rejects(
    session.selectOption({ css: "#language" }, { value: "fr-CA", label: "French" }),
    /exactly one string value or label/,
  );
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

test("assertText compares exact inner text using the run-locale expected value", async () => {
  let textOptions;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerText(options) {
      textOptions = options;
      return "Se connecter";
    },
  };
  const page = {
    locator() {
      return locator;
    },
  };
  const { run, session } = await createSession(page, { locale: "fr-CA" });
  await session.assertText(
    { css: "h1" },
    { default: "Sign in", locales: { "fr-ca": "Se connecter" } },
    { timeout: 1_000 },
  );
  assert.ok(textOptions.timeout > 0 && textOptions.timeout <= 1_000);
  await run.close();
});

test("dispatches a passing assertText step and uses the default when no locale override matches", async () => {
  let textRead = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerText() {
      textRead = true;
      return "Sign in";
    },
  };
  const page = {
    locator() {
      return locator;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertText",
      locator: { css: "h1" },
      expected: { default: "Sign in", locales: { "fr-CA": "Se connecter" } },
    },
  ]);
  assert.equal(textRead, true);
  assert.deepEqual(softFailures, []);
  await run.close();
});

test("stops on a hard assertText mismatch with case and step context", async () => {
  let navigated = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerText() {
      return "Welcome";
    },
  };
  const page = {
    locator() {
      return locator;
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "assertText",
        locator: { css: "h1" },
        expected: { default: "Sign in" },
      },
      { action: "navigate", url: "https://example.test/next" },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "assertText" &&
      error.cause.expected === "Sign in" &&
      error.cause.actual === "Welcome" &&
      /Expected text "Sign in" but received "Welcome"/.test(error.message),
  );
  assert.equal(navigated, false);
  await run.close();
});

test("returns a soft assertText mismatch and continues to later steps", async () => {
  let navigated = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerText() {
      return "Welcome";
    },
  };
  const page = {
    locator() {
      return locator;
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertText",
      locator: { css: "h1" },
      expected: { default: "Sign in" },
      soft: true,
    },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.deepEqual(softFailures, [
    {
      caseId: "sign-in",
      stepIndex: 0,
      action: "assertText",
      expected: "Sign in",
      actual: "Welcome",
      message: 'Expected text "Sign in" but received "Welcome".',
    },
  ]);
  await run.close();
});

test("returns a soft assertText locator failure and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {
          throw new errors.TimeoutError("locator wait timed out");
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertText",
      locator: { css: "h1" },
      expected: { default: "Sign in" },
      timeout: 1,
      soft: true,
    },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.deepEqual(softFailures, [
    {
      caseId: "sign-in",
      stepIndex: 0,
      action: "assertText",
      expected: "Sign in",
      message: "Locator did not match an element within 1 milliseconds after 1 attempt.",
    },
  ]);
  await run.close();
});

test("returns a soft assertText ambiguous-locator failure and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 2;
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertText",
      locator: { css: "h1" },
      expected: { default: "Sign in" },
      soft: true,
    },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.equal(softFailures.length, 1);
  assert.equal(softFailures[0].expected, "Sign in");
  assert.equal(softFailures[0].actual, undefined);
  assert.match(softFailures[0].message, /matched 2 elements/);
  await run.close();
});

test("returns a soft assertText text-read timeout and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 1;
        },
        async innerText() {
          throw new errors.TimeoutError("inner text timed out");
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertText",
      locator: { css: "h1" },
      expected: { default: "Sign in" },
      soft: true,
    },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.equal(softFailures.length, 1);
  assert.equal(softFailures[0].expected, "Sign in");
  assert.equal(softFailures[0].actual, undefined);
  assert.equal(softFailures[0].message, "inner text timed out");
  await run.close();
});

test("does not continue after an unsafe assertText error marked soft", async () => {
  let navigated = false;
  const browserError = new Error("browser connection closed");
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 1;
        },
        async innerText() {
          throw browserError;
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      {
        action: "assertText",
        locator: { css: "h1" },
        expected: { default: "Sign in" },
        soft: true,
      },
      { action: "navigate", url: "https://example.test/next" },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.stepIndex === 0 &&
      error.action === "assertText" &&
      error.cause === browserError,
  );
  assert.equal(navigated, false);
  await run.close();
});

test("assertHtml compares exact inner HTML for the run locale within its timeout", async () => {
  let locatorOptions;
  let htmlOptions;
  const locator = {
    async waitFor(options) {
      locatorOptions = options;
    },
    async count() {
      return 1;
    },
    async innerHTML(options) {
      htmlOptions = options;
      return "<strong>Se connecter</strong>";
    },
  };
  const page = {
    locator() {
      return locator;
    },
  };
  const { run, session } = await createSession(page, { locale: "fr-CA" });
  await session.assertHtml(
    { css: "h1" },
    { default: "<strong>Sign in</strong>", locales: { "fr-ca": "<strong>Se connecter</strong>" } },
    { timeout: 1_000 },
  );
  assert.ok(locatorOptions.timeout > 0 && locatorOptions.timeout <= 1_000);
  assert.ok(htmlOptions.timeout > 0 && htmlOptions.timeout <= 1_000);
  await run.close();
});

test("dispatches a passing assertHtml step and uses its default expected value", async () => {
  let htmlRead = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerHTML() {
      htmlRead = true;
      return "<h1>Sign in</h1>";
    },
  };
  const page = {
    locator() {
      return locator;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    {
      action: "assertHtml",
      locator: { css: "main" },
      expected: { default: "<h1>Sign in</h1>", locales: { "fr-CA": "<h1>Se connecter</h1>" } },
    },
  ]);
  assert.equal(htmlRead, true);
  assert.deepEqual(softFailures, []);
  await run.close();
});

test("stops on a hard assertHtml mismatch with case and step context", async () => {
  let navigated = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerHTML() {
      return "<h1>Welcome</h1>";
    },
  };
  const page = {
    locator() {
      return locator;
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" } },
      { action: "navigate", url: "https://example.test/next" },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.caseId === "sign-in" &&
      error.stepIndex === 0 &&
      error.action === "assertHtml" &&
      error.cause.expected === "<h1>Sign in</h1>" &&
      error.cause.actual === "<h1>Welcome</h1>" &&
      /Expected HTML "<h1>Sign in<\/h1>" but received "<h1>Welcome<\/h1>"/.test(error.message),
  );
  assert.equal(navigated, false);
  await run.close();
});

test("returns a soft assertHtml mismatch and continues to later steps", async () => {
  let navigated = false;
  const locator = {
    async waitFor() {},
    async count() {
      return 1;
    },
    async innerHTML() {
      return "<h1>Welcome</h1>";
    },
  };
  const page = {
    locator() {
      return locator;
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" }, soft: true },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.deepEqual(softFailures, [
    {
      caseId: "sign-in",
      stepIndex: 0,
      action: "assertHtml",
      expected: "<h1>Sign in</h1>",
      actual: "<h1>Welcome</h1>",
      message: 'Expected HTML "<h1>Sign in</h1>" but received "<h1>Welcome</h1>".',
    },
  ]);
  await run.close();
});

test("returns a soft assertHtml locator failure and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {
          throw new errors.TimeoutError("locator wait timed out");
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" }, soft: true },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.deepEqual(softFailures, [
    {
      caseId: "sign-in",
      stepIndex: 0,
      action: "assertHtml",
      expected: "<h1>Sign in</h1>",
      message: "Locator did not match an element within 30000 milliseconds after 1 attempt.",
    },
  ]);
  await run.close();
});

test("returns a soft assertHtml ambiguous-locator failure and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 2;
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" }, soft: true },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.equal(softFailures.length, 1);
  assert.equal(softFailures[0].action, "assertHtml");
  assert.equal(softFailures[0].expected, "<h1>Sign in</h1>");
  assert.equal(softFailures[0].actual, undefined);
  assert.match(softFailures[0].message, /matched 2 elements/);
  await run.close();
});

test("returns a soft assertHtml HTML-read timeout and continues to later steps", async () => {
  let navigated = false;
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 1;
        },
        async innerHTML() {
          throw new errors.TimeoutError("inner HTML timed out");
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  const softFailures = await session.executeSteps("sign-in", [
    { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" }, soft: true },
    { action: "navigate", url: "https://example.test/next" },
  ]);
  assert.equal(navigated, true);
  assert.equal(softFailures.length, 1);
  assert.equal(softFailures[0].action, "assertHtml");
  assert.equal(softFailures[0].expected, "<h1>Sign in</h1>");
  assert.equal(softFailures[0].actual, undefined);
  assert.equal(softFailures[0].message, "inner HTML timed out");
  await run.close();
});

test("does not continue after an unsafe assertHtml error marked soft", async () => {
  let navigated = false;
  const browserError = new Error("browser connection closed");
  const page = {
    locator() {
      return {
        async waitFor() {},
        async count() {
          return 1;
        },
        async innerHTML() {
          throw browserError;
        },
      };
    },
    async goto() {
      navigated = true;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.executeSteps("sign-in", [
      { action: "assertHtml", locator: { css: "main" }, expected: { default: "<h1>Sign in</h1>" }, soft: true },
      { action: "navigate", url: "https://example.test/next" },
    ]),
    (error) =>
      error instanceof StepExecutionError &&
      error.stepIndex === 0 &&
      error.action === "assertHtml" &&
      error.cause === browserError,
  );
  assert.equal(navigated, false);
  await run.close();
});
