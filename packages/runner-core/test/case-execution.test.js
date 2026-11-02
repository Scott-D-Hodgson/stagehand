import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { chromium } from "playwright";
import { CasePreparationError, StepExecutionError, startBrowserRun } from "@stagehand/runner-core";

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

test("prepares case steps with the selected data-set values", async () => {
  let typedText;
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async pressSequentially(text) { typedText = text; },
  };
  const { run, session } = await createSession({ locator() { return locator; } }, { locale: "fr-CA" });
  try {
    await session.executeCase({
      case: {
        schemaVersion: 1,
        id: "sign-in",
        defaultDataSet: "canada",
        variables: { email: { default: "case@example.test" } },
        steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
      },
      dataSets: [
        { name: "canada", variables: { email: { default: "canada@example.test", locales: { "fr-CA": "canada-fr@example.test" } } } },
      ],
    });
    assert.equal(typedText, "canada-fr@example.test");
  } finally {
    await run.close();
  }
});

test("expands and dispatches shared steps using the calling case data set", async () => {
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
        id: "checkout",
        defaultDataSet: "canada",
        steps: [
          { action: "navigate", url: "https://example.test/start" },
          { action: "callSharedSteps", id: "sign-in" },
          { action: "navigate", url: "https://example.test/complete" },
        ],
      },
      dataSets: [{ name: "canada", variables: { email: { default: "canada@example.test", locales: { "fr-CA": "canada-fr@example.test" } } } }],
      sharedStepGroups: [{
        id: "sign-in",
        steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
      }],
    });
    assert.deepEqual(events, [
      "navigate:https://example.test/start",
      "type:canada-fr@example.test",
      "navigate:https://example.test/complete",
    ]);
  } finally {
    await run.close();
  }
});

test("retains shared-step identity when an expanded step fails", async () => {
  const { run, session } = await createSession({
    async goto() { throw new Error("navigation failed"); },
  });
  try {
    await assert.rejects(
      session.executeCase({
        case: {
          schemaVersion: 1,
          id: "checkout",
          steps: [{ action: "callSharedSteps", id: "sign-in" }],
        },
        sharedStepGroups: [{
          id: "sign-in",
          steps: [{ action: "navigate", url: "https://example.test/sign-in" }],
        }],
      }),
      (error) => error instanceof StepExecutionError
        && error.caseId === "checkout"
        && error.stepIndex === 0
        && error.caseStepIndex === 0
        && error.sharedStepGroupId === "sign-in"
        && error.sharedStepIndex === 0,
    );
  } finally {
    await run.close();
  }
});

test("retains shared-step identity on a soft assertion failure", async () => {
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async innerText() { return "Actual"; },
  };
  const { run, session } = await createSession({ locator() { return locator; } });
  try {
    const failures = await session.executeCase({
      case: {
        schemaVersion: 1,
        id: "checkout",
        steps: [{ action: "callSharedSteps", id: "sign-in" }],
      },
      sharedStepGroups: [{
        id: "sign-in",
        steps: [{ action: "assertText", locator: { css: "h1" }, expected: { default: "Expected" }, soft: true }],
      }],
    });
    assert.deepEqual(failures.map(({ caseId, stepIndex, caseStepIndex, sharedStepGroupId, sharedStepIndex }) => ({
      caseId, stepIndex, caseStepIndex, sharedStepGroupId, sharedStepIndex,
    })), [{
      caseId: "checkout", stepIndex: 0, caseStepIndex: 0, sharedStepGroupId: "sign-in", sharedStepIndex: 0,
    }]);
  } finally {
    await run.close();
  }
});

test("retains shared-step identity when preparation fails", async () => {
  const { run, session } = await createSession({});
  try {
    await assert.rejects(
      session.executeCase({
        case: {
          schemaVersion: 1,
          id: "checkout",
          steps: [{ action: "callSharedSteps", id: "sign-in" }],
        },
        sharedStepGroups: [{
          id: "sign-in",
          steps: [{ action: "type", locator: { css: "#email" }, text: { var: "missing" } }],
        }],
      }),
      (error) => error instanceof CasePreparationError
        && error.path === "/sharedStepGroups/0/steps/0/text"
        && error.caseStepIndex === 0
        && error.sharedStepGroupId === "sign-in"
        && error.sharedStepIndex === 0,
    );
  } finally {
    await run.close();
  }
});

test("keeps selected data sets isolated between executeCase calls", async () => {
  const typed = [];
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async pressSequentially(text) { typed.push(text); },
  };
  const { run, session } = await createSession({ locator() { return locator; } });
  const caseFile = {
    schemaVersion: 1,
    id: "sign-in",
    steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
  };
  const dataSets = [
    { name: "first", variables: { email: { default: "first@example.test" } } },
    { name: "second", variables: { email: { default: "second@example.test" } } },
  ];
  try {
    await session.executeCase({ case: caseFile, dataSets, selectedDataSet: "first" });
    await session.executeCase({ case: caseFile, dataSets, selectedDataSet: "second" });
    assert.deepEqual(typed, ["first@example.test", "second@example.test"]);
  } finally {
    await run.close();
  }
});

test("stops before dispatch when the selected data set is unknown", async () => {
  let typed = false;
  const locator = {
    async waitFor() {},
    async count() { return 1; },
    async pressSequentially() { typed = true; },
  };
  const { run, session } = await createSession({ locator() { return locator; } });
  try {
    await assert.rejects(
      session.executeCase({
        case: {
          schemaVersion: 1,
          id: "sign-in",
          steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
        },
        dataSets: [],
        selectedDataSet: "missing",
      }),
      (error) => error instanceof CasePreparationError
        && error.caseId === "sign-in"
        && error.path === "/dataSetSelection"
        && error.reason === "unknownDataSet"
        && error.message.includes('No data set named "missing"'),
    );
    assert.equal(typed, false);
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
