import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium, errors } from "playwright";
import { startBrowserRun, WaitExecutionError } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

function createLocatorDouble(count = 1) {
  return { async count() { return typeof count === "function" ? count() : count; } };
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

test("runs wait-list items in order using the selected page operations", async () => {
  const events = [];
  const page = {
    locator(selector) {
      events.push(`locator:${selector}`);
      return createLocatorDouble();
    },
    async waitForLoadState(state, options) {
      events.push(`state:${state}:${options.timeout}`);
    },
    async waitForTimeout(timeout) {
      events.push(`delay:${timeout}`);
    },
  };
  const { run, session } = await createSession(page);
  await session.runWaitList([
    { delay: 250 },
    { waitForState: "domcontentloaded", timeout: 5000 },
    { waitFor: { css: "#ready" }, timeout: 5000 },
    { waitForState: "networkidle" },
  ]);
  assert.deepEqual(events, [
    "delay:250",
    "state:domcontentloaded:5000",
    "locator:#ready",
    "state:networkidle:30000",
  ]);
  await run.close();
});

test("polls a locator once per second until exactly one match appears", async () => {
  let countCalls = 0;
  const intervals = [];
  const page = {
    locator() {
      return createLocatorDouble(() => {
        countCalls += 1;
        return countCalls === 1 ? 0 : 1;
      });
    },
    async waitForTimeout(timeout) {
      intervals.push(timeout);
    },
  };
  const { run, session } = await createSession(page);
  await session.runWaitList([{ waitFor: { css: ".continue" }, timeout: 5000 }]);
  assert.equal(countCalls, 2);
  assert.deepEqual(intervals, [1000]);
  await run.close();
});

test("fails immediately when a locator wait finds multiple matches", async () => {
  let delayCount = 0;
  const page = {
    locator() {
      return createLocatorDouble(2);
    },
    async waitForTimeout() {
      delayCount += 1;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.runWaitList([{ waitFor: { css: ".multiple" }, timeout: 1000 }]),
    (error) => error instanceof WaitExecutionError && /2 elements/.test(error.message),
  );
  assert.equal(delayCount, 0);
  await run.close();
});

test("returns a timeout error when a locator wait remains unmatched", async () => {
  let countCalls = 0;
  const page = {
    locator() {
      return createLocatorDouble(() => {
        countCalls += 1;
        return 0;
      });
    },
    async waitForTimeout() {},
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.runWaitList([{ waitFor: { css: "#missing" }, timeout: 1 }]),
    (error) => error instanceof WaitExecutionError && /did not find an element/.test(error.message),
  );
  assert.ok(countCalls >= 1);
  await run.close();
});

test("passes page-state timeouts through and wraps Playwright timeout errors", async () => {
  let options;
  const timeoutError = new errors.TimeoutError("state wait timed out");
  const page = {
    async waitForLoadState(_state, waitOptions) {
      options = waitOptions;
      throw timeoutError;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.runWaitList([{ waitForState: "networkidle", timeout: 1250 }]),
    (error) => error instanceof WaitExecutionError && error.cause === timeoutError,
  );
  assert.deepEqual(options, { timeout: 1250 });
  await run.close();
});

test("bounds fixed delays by their timeout and validates their limits", async () => {
  const requestedDelays = [];
  const page = {
    async waitForTimeout(timeout) {
      requestedDelays.push(timeout);
    },
  };
  const { run, session } = await createSession(page);
  await session.runWaitList([{ delay: 100 }]);
  await assert.rejects(
    session.runWaitList([{ delay: 500, timeout: 200 }]),
    (error) => error instanceof WaitExecutionError && /exceeded its 200/.test(error.message),
  );
  await assert.rejects(session.runWaitList([{ delay: 0 }]), /from 1 to 30000/);
  await assert.rejects(session.runWaitList([{ delay: 30001 }]), /from 1 to 30000/);
  await assert.rejects(session.runWaitList([{ delay: 50, timeout: 0 }]), /positive integer/);
  assert.deepEqual(requestedDelays, [100, 200]);
  await run.close();
});

test("rejects a non-array wait list", async () => {
  const { run, session } = await createSession({});
  await assert.rejects(session.runWaitList(null), /must be an array/);
  await run.close();
});
