import assert from "node:assert/strict";
import test from "node:test";
import { elapsedMilliseconds, startElapsedTimer } from "@stagehand/runner-core";

function clock(initial = 0) {
  let current = initial;
  return {
    now() { return current; },
    set(value) { current = value; },
  };
}

test("measures an elapsed interval with an injected monotonic clock", () => {
  const timerClock = clock(100);
  const timer = startElapsedTimer(timerClock);
  timerClock.set(250.6);
  assert.equal(elapsedMilliseconds(timer, timerClock), 151);
});

test("does not report a negative duration when a supplied clock moves backward", () => {
  const timerClock = clock(100);
  const timer = startElapsedTimer(timerClock);
  timerClock.set(99);
  assert.equal(elapsedMilliseconds(timer, timerClock), 0);
});
