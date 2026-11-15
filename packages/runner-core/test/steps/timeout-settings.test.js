import assert from "node:assert/strict";
import test from "node:test";
import { resolveStepTimeout } from "@stagehand/runner-core";

test("resolves the built-in step timeout when no configured value exists", () => {
  assert.equal(resolveStepTimeout(), 30000);
});

test("prefers case and then plan step timeout settings", () => {
  assert.equal(resolveStepTimeout(5000), 5000);
  assert.equal(resolveStepTimeout(5000, 1000), 1000);
});
