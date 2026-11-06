import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium, errors } from "playwright";
import { LocatorResolutionError, startBrowserRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

function createLocatorDouble({ count = 1, waitFor = async () => {} } = {}) {
  return { count: async () => count, waitFor };
}

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

test("resolves role, label, CSS, and XPath locator definitions", async () => {
  const locator = createLocatorDouble();
  const calls = [];
  const page = {
    getByRole(...args) {
      calls.push(["role", ...args]);
      return locator;
    },
    getByLabel(...args) {
      calls.push(["label", ...args]);
      return locator;
    },
    locator(...args) {
      calls.push(["locator", ...args]);
      return locator;
    },
  };
  const { run, session } = await createSession(page);
  await session.resolveLocator({ role: "button", name: "Save" });
  await session.resolveLocator({ role: "button" });
  await session.resolveLocator({ label: "Email" });
  await session.resolveLocator({ css: "#save" });
  await session.resolveLocator({ xpath: "//button" });
  assert.deepEqual(calls, [
    ["role", "button", { name: "Save", exact: true }],
    ["role", "button"],
    ["label", "Email", { exact: true }],
    ["locator", "#save"],
    ["locator", "xpath=//button"],
  ]);
  await run.close();
});

test("fails immediately when a locator matches multiple elements", async () => {
  const locator = createLocatorDouble({ count: 2 });
  const { run, session } = await createSession({ locator: () => locator });
  await assert.rejects(
    session.resolveLocator({ css: ".save" }),
    (error) => error instanceof LocatorResolutionError && /2 elements/.test(error.message),
  );
  await run.close();
});

test("retries timed-out locator waits up to three attempts", async () => {
  let attempts = 0;
  const retryDelays = [];
  const locator = createLocatorDouble({
    waitFor: async () => {
      attempts += 1;
      throw new errors.TimeoutError("wait timed out");
    },
  });
  const { run, session } = await createSession({
    locator: () => locator,
    async waitForTimeout(delay) {
      retryDelays.push(delay);
    },
  });
  await assert.rejects(
    session.resolveLocator({ css: ".late" }, { timeout: 3_000 }),
    (error) => error instanceof LocatorResolutionError && /3 attempts/.test(error.message),
  );
  assert.equal(attempts, 3);
  assert.deepEqual(retryDelays, [1_000, 1_000]);
  await run.close();
});

test("uses one locator wait when the timeout cannot fit retry gaps", async () => {
  let attempts = 0;
  const locator = createLocatorDouble({
    waitFor: async () => {
      attempts += 1;
      throw new errors.TimeoutError("wait timed out");
    },
  });
  const { run, session } = await createSession({ locator: () => locator });
  await assert.rejects(
    session.resolveLocator({ css: ".late" }, { timeout: 100 }),
    LocatorResolutionError,
  );
  assert.equal(attempts, 1);
  await run.close();
});

test("rejects an invalid locator timeout", async () => {
  const { run, session } = await createSession({ locator: () => createLocatorDouble() });
  await assert.rejects(
    session.resolveLocator({ css: ".save" }, { timeout: 0 }),
    /positive integer/,
  );
  await run.close();
});
