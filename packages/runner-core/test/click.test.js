import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium, errors } from "playwright";
import { LocatorResolutionError, startBrowserRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

async function createSession(page) {
  if (page.waitForTimeout === undefined) {
    page.waitForTimeout = async () => {};
  }
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

function createLocatorDouble({ count = 1, waitFor = async () => {}, click = async () => {} } = {}) {
  return { count: async () => count, waitFor, click };
}

test("clicks a unique locator and scrolls it into view by default", async () => {
  let clickOptions;
  let locatorWaitOptions;
  const locator = createLocatorDouble({
    async waitFor(options) {
      locatorWaitOptions = options;
    },
    async click(options) {
      clickOptions = options;
    },
  });
  const { run, session } = await createSession({ locator: () => locator });
  await session.click({ css: "#continue" });
  assert.equal(locatorWaitOptions.state, "attached");
  assert.ok(locatorWaitOptions.timeout > 9_000 && locatorWaitOptions.timeout <= 10_000);
  assert.equal(clickOptions.scroll, "auto");
  assert.ok(clickOptions.timeout > 0 && clickOptions.timeout <= 30_000);
  await run.close();
});

test("uses the supplied timeout and can disable automatic scrolling", async () => {
  let clickOptions;
  const locator = createLocatorDouble({
    async click(options) {
      clickOptions = options;
    },
  });
  const { run, session } = await createSession({
    getByRole() {
      return locator;
    },
  });
  await session.click({ role: "button", name: "Continue" }, {
    timeout: 1_000,
    scrollIntoView: false,
  });
  assert.equal(clickOptions.scroll, "none");
  assert.ok(clickOptions.timeout > 0 && clickOptions.timeout <= 1_000);
  await run.close();
});

test("retries a missing click target before clicking when it appears", async () => {
  let attempts = 0;
  let clickCount = 0;
  const delays = [];
  const locator = createLocatorDouble({
    async waitFor() {
      attempts += 1;
      if (attempts < 3) {
        throw new errors.TimeoutError("target not attached yet");
      }
    },
    async click() {
      clickCount += 1;
    },
  });
  const { run, session } = await createSession({
    locator: () => locator,
    async waitForTimeout(delay) {
      delays.push(delay);
    },
  });
  await session.click({ css: ".late" }, { timeout: 3_000 });
  assert.equal(attempts, 3);
  assert.deepEqual(delays, [1_000, 1_000]);
  assert.equal(clickCount, 1);
  await run.close();
});

test("rejects an invalid timeout before resolving or clicking", async () => {
  let locatorCreated = false;
  const { run, session } = await createSession({
    locator() {
      locatorCreated = true;
      return createLocatorDouble();
    },
  });
  await assert.rejects(session.click({ css: ".save" }, { timeout: 0 }), /positive integer/);
  assert.equal(locatorCreated, false);
  await run.close();
});

test("does not click when the locator is ambiguous", async () => {
  let clickCount = 0;
  const locator = createLocatorDouble({
    count: 2,
    async click() {
      clickCount += 1;
    },
  });
  const { run, session } = await createSession({ locator: () => locator });
  await assert.rejects(
    session.click({ css: ".save" }),
    (error) => error instanceof LocatorResolutionError && /2 elements/.test(error.message),
  );
  assert.equal(clickCount, 0);
  await run.close();
});

test("preserves Playwright click errors", async () => {
  const clickError = new Error("element is disabled");
  const locator = createLocatorDouble({
    async click() {
      throw clickError;
    },
  });
  const { run, session } = await createSession({ locator: () => locator });
  await assert.rejects(session.click({ css: "#disabled" }), (error) => error === clickError);
  await run.close();
});
