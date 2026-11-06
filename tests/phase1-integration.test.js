import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { afterEach, mock } from "node:test";
import { chromium } from "playwright";
import { loadPlanFile } from "@stagehand/plan-engine";
import { createResultDocument, executePlanRun } from "@stagehand/runner-core";
import { validateResult } from "@stagehand/result-model";

afterEach(() => mock.restoreAll());

test("walks a synthetic plan from file loading through a validated result", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "stagehand-phase1-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "plan.json"), JSON.stringify({
    version: 1,
    id: "phase1-walkthrough",
    cases: [{ path: "cases/home.json" }],
  }), "utf8");
  await mkdir(join(directory, "cases"));
  await writeFile(join(directory, "cases", "home.json"), JSON.stringify({
    version: 1,
    id: "home",
    steps: [{ action: "navigate", url: "https://example.test/home" }],
  }), "utf8");
  const visited = [];
  let browserClosed = false;
  mock.method(chromium, "launch", async () => ({
    async newContext() {
      return {
        async newPage() {
          return {
            isClosed() { return false; },
            async goto(url) { visited.push(url); return null; },
          };
        },
        async close() {},
      };
    },
    async close() { browserClosed = true; },
  }));
  const loaded = await loadPlanFile(join(directory, "plan.json"));
  assert.equal(loaded.valid, true);
  if (!loaded.valid) {
    return;
  }
  const outcome = await executePlanRun({
    locale: "en-CA",
    cases: loaded.cases.map(({ value }) => ({ case: value })),
  });
  const result = createResultDocument({
    outcome,
    sourcePlan: {
      id: loaded.plan.id,
      version: loaded.plan.version,
      fingerprint: loaded.fingerprint,
    },
    startedAt: "2026-11-06T12:00:00Z",
    endedAt: "2026-11-06T12:00:01Z",
  });
  assert.deepEqual(visited, ["https://example.test/home"]);
  assert.equal(browserClosed, true);
  assert.equal(outcome.status, "passed");
  assert.deepEqual(validateResult(result), { valid: true });
  assert.equal(result.cases[0]?.id, "home");
});

test("stops an invalid case before browser hand-off and keeps its source reference", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "stagehand-phase1-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "plan.json"), JSON.stringify({
    version: 1,
    id: "phase1-invalid-case",
    cases: [{ path: "cases/bad.json" }],
  }), "utf8");
  await mkdir(join(directory, "cases"));
  await writeFile(join(directory, "cases", "bad.json"), JSON.stringify({
    version: 1,
    id: "bad",
    steps: null,
  }), "utf8");
  let launchCount = 0;
  mock.method(chromium, "launch", async () => {
    launchCount += 1;
    throw new Error("Chromium must not start for invalid input.");
  });
  const loaded = await loadPlanFile(join(directory, "plan.json"));
  assert.equal(loaded.valid, false);
  if (loaded.valid) {
    return;
  }
  assert.ok(loaded.issues.some((issue) => (
    issue.path === "/caseFiles/0/steps"
    && issue.reference === "cases/bad.json"
  )));
  assert.equal(launchCount, 0);
});
