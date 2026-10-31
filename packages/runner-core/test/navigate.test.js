import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { startBrowserRun } from "@stagehand/runner-core";

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

test("uses the navigation timeout and wait defaults and returns the response", async () => {
  const response = {};
  let navigation;
  const page = {
    async goto(url, options) {
      navigation = { url, options };
      return response;
    },
  };
  const { run, session } = await createSession(page);
  assert.strictEqual(await session.navigate("http://localhost:3000/sign-in"), response);
  assert.deepEqual(navigation, {
    url: "http://localhost:3000/sign-in",
    options: { timeout: 30_000, waitUntil: "domcontentloaded" },
  });
  await run.close();
});

test("passes supported waitUntil and timeout overrides to Playwright", async () => {
  let navigation;
  const page = {
    async goto(url, options) {
      navigation = { url, options };
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await session.navigate("https://example.com/account", {
    timeout: 1250,
    waitUntil: "networkidle",
  });
  assert.deepEqual(navigation, {
    url: "https://example.com/account",
    options: { timeout: 1250, waitUntil: "networkidle" },
  });
  await run.close();
});

test("rejects relative, malformed, and non-HTTP navigation URLs", async () => {
  let navigationCount = 0;
  const page = {
    async goto() {
      navigationCount += 1;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  for (const url of [
    "/sign-in",
    "../sign-in",
    "//example.com/sign-in",
    "ftp://example.com/sign-in",
    "javascript:alert(1)",
    "https://",
    "https:example.com/sign-in",
  ]) {
    await assert.rejects(session.navigate(url), /absolute HTTP or HTTPS URL/);
  }
  assert.equal(navigationCount, 0);
  await run.close();
});

test("rejects invalid navigation timeout and waitUntil values", async () => {
  let navigationCount = 0;
  const page = {
    async goto() {
      navigationCount += 1;
      return null;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.navigate("https://example.com", { timeout: 0 }),
    /positive integer/,
  );
  await assert.rejects(
    session.navigate("https://example.com", { waitUntil: "load" }),
    /must be domcontentloaded or networkidle/,
  );
  assert.equal(navigationCount, 0);
  await run.close();
});

test("preserves Playwright navigation errors", async () => {
  const navigationError = new Error("navigation failed");
  const page = {
    async goto() {
      throw navigationError;
    },
  };
  const { run, session } = await createSession(page);
  await assert.rejects(
    session.navigate("https://example.com"),
    (error) => error === navigationError,
  );
  await run.close();
});
