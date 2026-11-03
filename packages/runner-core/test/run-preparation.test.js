import assert from "node:assert/strict";
import { test } from "node:test";
import { CasePreparationError, prepareRunForExecution } from "@stagehand/runner-core";

test("prepares all supplied cases without creating a browser session", () => {
  const prepared = prepareRunForExecution({
    locale: "en-CA",
    planVariables: { email: { default: "tester@example.test" } },
    environment: { TEST_PASSWORD: "not-a-real-password" },
    cases: [
      {
        case: {
          version: 1,
          id: "sign-in",
          variables: { password: { default: { env: "TEST_PASSWORD" } } },
          steps: [{ action: "type", locator: { css: "#password" }, text: { var: "password" } }],
        },
      },
      {
        case: {
          version: 1,
          id: "enter-email",
          steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
        },
      },
    ],
  });
  assert.deepEqual(prepared.cases.map((entry) => ({
    caseId: entry.caseId,
    text: entry.steps[0].text,
    protectedValues: entry.protectedValues,
  })), [
    { caseId: "sign-in", text: "not-a-real-password", protectedValues: ["not-a-real-password"] },
    { caseId: "enter-email", text: "tester@example.test", protectedValues: [] },
  ]);
});

test("does not require an unused protected value from an unselected data set", () => {
  const prepared = prepareRunForExecution({
    locale: "en-CA",
    dataSets: [
      { name: "selected", variables: { email: { default: "tester@example.test" } } },
      { name: "unused", variables: { password: { default: { env: "TEST_PASSWORD" } } } },
    ],
    cases: [{
      selectedDataSet: "selected",
      case: {
        version: 1,
        id: "sign-in",
        steps: [{ action: "type", locator: { css: "#email" }, text: { var: "email" } }],
      },
    }],
  });
  assert.equal(prepared.cases[0].steps[0].text, "tester@example.test");
});

test("reports a missing effective protected value before returning prepared cases", () => {
  assert.throws(
    () => prepareRunForExecution({
      locale: "en-CA",
      cases: [{
        case: {
          version: 1,
          id: "sign-in",
          variables: { password: { default: { env: "TEST_PASSWORD" } } },
          steps: [{ action: "type", locator: { css: "#password" }, text: { var: "password" } }],
        },
      }],
      environment: {},
    }),
    (error) => error instanceof CasePreparationError
      && error.caseId === "sign-in"
      && error.reason === "unresolvedProtectedValue"
      && error.environmentVariable === "TEST_PASSWORD",
  );
});
