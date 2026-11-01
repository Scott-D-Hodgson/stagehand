import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { CasePreparationError, startBrowserRun } from "@stagehand/runner-core";

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

test("prepares ordinary case variables before dispatching case steps", async () => {
  const events = [];
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async pressSequentially(text) { events.push(`type:${text}`); },
  };
  const { run, session } = await createSession({
    locator() { return locator; },
    async goto(url) { events.push(`navigate:${url}`); return null; },
  }, { locale: "fr-CA" });
  try {
    await session.executeCase({
      case: {
        schemaVersion: 1,
        id: "sign-in",
        variables: {
          address: { default: "https://default.example.test", locales: { "fr-CA": "https://bonjour.example.test" } },
          attempts: { default: 3 },
        },
        steps: [
          { action: "navigate", url: { var: "address" } },
          { action: "type", locator: { css: "#attempts" }, text: { var: "attempts" } },
        ],
      },
    });
    assert.deepEqual(events, ["navigate:https://bonjour.example.test", "type:3"]);
  } finally {
    await run.close();
  }
});

test("uses plan variables when the case does not define the referenced name", async () => {
  let typedText;
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async pressSequentially(text) { typedText = text; },
  };
  const { run, session } = await createSession({ locator() { return locator; } });
  try {
    await session.executeCase({
      case: {
        schemaVersion: 1,
        id: "sign-in",
        steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
      },
      planVariables: { email: { default: "tester@example.test" } },
    });
    assert.equal(typedText, "tester@example.test");
  } finally {
    await run.close();
  }
});

test("stops before dispatch when ordinary case preparation fails", async () => {
  let navigated = false;
  const { run, session } = await createSession({
    async goto() { navigated = true; return null; },
  });
  try {
    await assert.rejects(
      session.executeCase({
        case: {
          schemaVersion: 1,
          id: "sign-in",
          steps: [
            { action: "navigate", url: "https://example.test/start" },
            { action: "type", locator: { css: "#email" }, text: { var: "missing" } },
          ],
        },
      }),
      (error) => error instanceof CasePreparationError
        && error.caseId === "sign-in"
        && error.path === "/steps/1/text"
        && error.reason === "missingVariable"
        && error.message.includes('No variable named "missing"'),
    );
    assert.equal(navigated, false);
  } finally {
    await run.close();
  }
});
