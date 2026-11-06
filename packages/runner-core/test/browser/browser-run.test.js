import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { startBrowserRun } from "@stagehand/runner-core";

afterEach(() => mock.restoreAll());

function createBrowserDouble() {
  const contexts = [];
  let closeCount = 0;
  const browser = {
    async newContext(options) {
      const context = {
        options,
        closeCount: 0,
        async newPage() {
          return {};
        },
        async close() {
          context.closeCount += 1;
        },
      };
      contexts.push(context);
      return context;
    },
    async close() {
      closeCount += 1;
    },
  };
  return { browser, contexts, getCloseCount: () => closeCount };
}
function createDeferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}
test("starts Chromium and applies run defaults with case overrides", async () => {
  const browserDouble = createBrowserDouble();
  let launchOptions;
  mock.method(chromium, "launch", async (options) => {
    launchOptions = options;
    return browserDouble.browser;
  });
  const run = await startBrowserRun({
    locale: "fr-CA",
    browser: {
      headless: false,
      timeZone: "America/Toronto",
      viewport: { width: 1440, height: 900 },
    },
  });
  const session = await run.createCaseSession({
    browser: { timeZone: "Europe/Paris", viewport: { width: 1024, height: 768 } },
  });
  const inheritedSession = await run.createCaseSession();
  assert.deepEqual(launchOptions, { headless: false });
  assert.deepEqual(browserDouble.contexts[0].options, {
    locale: "fr-CA",
    timezoneId: "Europe/Paris",
    viewport: { width: 1024, height: 768 },
  });
  assert.deepEqual(browserDouble.contexts[1].options, {
    locale: "fr-CA",
    timezoneId: "America/Toronto",
    viewport: { width: 1440, height: 900 },
  });
  await session.close();
  await inheritedSession.close();
  await run.close();
  assert.equal(browserDouble.contexts[0].closeCount, 1);
  assert.equal(browserDouble.getCloseCount(), 1);
});
test("uses Stagehand browser defaults when settings are omitted", async () => {
  const browserDouble = createBrowserDouble();
  let launchOptions;
  mock.method(chromium, "launch", async (options) => {
    launchOptions = options;
    return browserDouble.browser;
  });
  const run = await startBrowserRun();
  const session = await run.createCaseSession();
  assert.deepEqual(launchOptions, { headless: true });
  assert.deepEqual(browserDouble.contexts[0].options, {
    locale: "en-CA",
    timezoneId: "UTC",
    viewport: { width: 1280, height: 720 },
  });
  await run.close();
  assert.equal(browserDouble.contexts[0].closeCount, 1);
  assert.equal(browserDouble.getCloseCount(), 1);
  await session.close();
  assert.equal(browserDouble.contexts[0].closeCount, 1);
});
test("closes the context if page setup fails", async () => {
  let contextCloseCount = 0;
  let browserCloseCount = 0;
  const browser = {
    async newContext() {
      return {
        async newPage() {
          throw new Error("page setup failed");
        },
        async close() {
          contextCloseCount += 1;
        },
      };
    },
    async close() {
      browserCloseCount += 1;
    },
  };
  mock.method(chromium, "launch", async () => browser);
  const run = await startBrowserRun();
  await assert.rejects(run.createCaseSession(), /page setup failed/);
  assert.equal(contextCloseCount, 1);
  await run.close();
  assert.equal(browserCloseCount, 1);
});
test("returns the Playwright startup error", async () => {
  mock.method(chromium, "launch", async () => {
    throw new Error("Chromium launch failed");
  });
  await assert.rejects(startBrowserRun(), /Chromium launch failed/);
});
test("waits for in-flight case setup and cleans it up before closing Chromium", async () => {
  const pageSetup = createDeferred();
  const pageSetupStarted = createDeferred();
  let contextCloseCount = 0;
  let browserCloseCount = 0;
  const browser = {
    async newContext() {
      return {
        async newPage() {
          pageSetupStarted.resolve();
          return pageSetup.promise;
        },
        async close() {
          contextCloseCount += 1;
        },
      };
    },
    async close() {
      browserCloseCount += 1;
    },
  };
  mock.method(chromium, "launch", async () => browser);
  const run = await startBrowserRun();
  const sessionPromise = run.createCaseSession();
  await pageSetupStarted.promise;
  const closePromise = run.close();
  const concurrentClosePromise = run.close();
  assert.strictEqual(concurrentClosePromise, closePromise);
  assert.equal(browserCloseCount, 0);
  pageSetup.resolve({});
  await assert.rejects(sessionPromise, /closing or closed/);
  await concurrentClosePromise;
  assert.equal(contextCloseCount, 1);
  assert.equal(browserCloseCount, 1);
  await assert.rejects(run.createCaseSession(), /closing or closed/);
});
test("concurrent close calls await the same session cleanup", async () => {
  const allowContextClose = createDeferred();
  const contextCloseStarted = createDeferred();
  let browserCloseCount = 0;
  const browser = {
    async newContext() {
      return {
        async newPage() {
          return {};
        },
        async close() {
          contextCloseStarted.resolve();
          await allowContextClose.promise;
        },
      };
    },
    async close() {
      browserCloseCount += 1;
    },
  };
  mock.method(chromium, "launch", async () => browser);
  const run = await startBrowserRun();
  await run.createCaseSession();
  const closePromise = run.close();
  await contextCloseStarted.promise;
  const concurrentClosePromise = run.close();
  assert.strictEqual(concurrentClosePromise, closePromise);
  assert.equal(browserCloseCount, 0);
  allowContextClose.resolve();
  await concurrentClosePromise;
  assert.equal(browserCloseCount, 1);
});
test("closes the browser if context cleanup fails", async () => {
  let browserCloseCount = 0;
  const browser = {
    async newContext() {
      return {
        async newPage() {
          return {};
        },
        async close() {
          throw new Error("context cleanup failed");
        },
      };
    },
    async close() {
      browserCloseCount += 1;
    },
  };
  mock.method(chromium, "launch", async () => browser);
  const run = await startBrowserRun();
  await run.createCaseSession();
  await assert.rejects(run.close(), /context cleanup failed/);
  assert.equal(browserCloseCount, 1);
});
