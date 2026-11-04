import assert from "node:assert/strict";
import test from "node:test";
import { CancellationError, executeSequentially } from "@stagehand/runner-core";

test("does not start sequential work when cancellation was already requested", async () => {
  const controller = new AbortController();
  controller.abort();
  let started = false;
  await assert.rejects(
    executeSequentially(["first"], async () => { started = true; }, controller.signal),
    CancellationError,
  );
  assert.equal(started, false);
});

test("does not start later sequential work after cancellation", async () => {
  const controller = new AbortController();
  const started = [];
  await assert.rejects(
    executeSequentially(["first", "second"], async (item) => {
      started.push(item);
      controller.abort();
    }, controller.signal),
    CancellationError,
  );
  assert.deepEqual(started, ["first"]);
});
