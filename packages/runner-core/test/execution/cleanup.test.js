import assert from "node:assert/strict";
import test from "node:test";
import { executeWithCleanup, PrimaryFailureError } from "@stagehand/runner-core";

test("retains a hard failure when cleanup also fails", async () => {
  const primary = new Error("assertion failed");
  const secondary = new Error("session close failed");
  await assert.rejects(
    executeWithCleanup(async () => { throw primary; }, async () => { throw secondary; }),
    (error) => error instanceof PrimaryFailureError
      && error.primary === primary
      && error.secondary === secondary
      && error.cause === primary,
  );
});

test("returns the execution result when cleanup succeeds", async () => {
  assert.equal(await executeWithCleanup(async () => "done", async () => {}), "done");
});
