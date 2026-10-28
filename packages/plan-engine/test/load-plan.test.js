import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { loadPlanFile } from "@stagehand/plan-engine";

function planWithReferences(...paths) {
  return {
    schemaVersion: 1,
    id: "loader-test-plan",
    cases: paths.map((path) => ({ path })),
  };
}

function caseWithId(id) {
  return { schemaVersion: 1, id, steps: [] };
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value), "utf8");
}

async function createPlanDirectory(t, plan, files = {}) {
  const directory = await mkdtemp(join(tmpdir(), "stagehand-plan-engine-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  const planFilePath = join(directory, "plan.json");
  await writeJson(planFilePath, plan);
  for (const [reference, value] of Object.entries(files)) {
    const path = join(directory, ...reference.split("/"));
    await mkdir(dirname(path), { recursive: true });
    await writeFile(
      path,
      typeof value === "string" ? value : JSON.stringify(value),
      "utf8",
    );
  }
  return { directory, planFilePath };
}

async function createSymlink(t, target, linkPath, type) {
  try {
    await symlink(target, linkPath, type);
    return true;
  } catch (error) {
    if (
      process.platform === "win32" &&
      ["EACCES", "EPERM", "ENOTSUP"].includes(error.code)
    ) {
      t.skip("This Windows environment does not allow creating symbolic links.");
      return false;
    }
    throw error;
  }
}

test("loads and validates a plan with its referenced cases", async (t) => {
  const plan = planWithReferences("cases//./sub/../sign-in.json");
  const exampleCase = caseWithId("sign-in");
  const { directory, planFilePath } = await createPlanDirectory(t, plan, {
    "cases/sign-in.json": exampleCase,
  });
  await mkdir(join(directory, "cases/sub"), { recursive: true });
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, true);
  if (!result.valid) {
    return;
  }
  assert.deepEqual(result.plan, plan);
  assert.deepEqual(result.cases, [
    {
      caseIndex: 0,
      reference: "cases//./sub/../sign-in.json",
      normalizedPath: "cases/sign-in.json",
      value: exampleCase,
    },
  ]);
});

test("returns the sha256-v1 fingerprint for the exact plan and case bytes", async (t) => {
  const plan = planWithReferences("cases/a.json");
  const exampleCase = caseWithId("a");
  const { planFilePath } = await createPlanDirectory(t, plan, {
    "cases/a.json": exampleCase,
  });
  const first = await loadPlanFile(planFilePath);
  const repeated = await loadPlanFile(planFilePath);
  assert.equal(first.valid, true);
  assert.equal(repeated.valid, true);
  if (!first.valid || !repeated.valid) {
    return;
  }
  assert.deepEqual(first.fingerprint, {
    algorithm: "sha256-v1",
    digest: "d54d1ad81a2f6e785e82b002d6be53227b12765df95ce5cd3f5a03730b30ad1c",
  });
  assert.deepEqual(repeated.fingerprint, first.fingerprint);
});

test("fingerprints raw plan and case bytes rather than parsed JSON values", async (t) => {
  const plan = planWithReferences("cases/a.json");
  const exampleCase = caseWithId("a");
  const { directory, planFilePath } = await createPlanDirectory(t, plan, {
    "cases/a.json": exampleCase,
  });
  const compact = await loadPlanFile(planFilePath);
  assert.equal(compact.valid, true);
  if (!compact.valid) {
    return;
  }
  await writeFile(planFilePath, JSON.stringify(plan, null, 2), "utf8");
  const formattedPlan = await loadPlanFile(planFilePath);
  assert.equal(formattedPlan.valid, true);
  if (!formattedPlan.valid) {
    return;
  }
  assert.deepEqual(formattedPlan.plan, compact.plan);
  assert.notEqual(formattedPlan.fingerprint.digest, compact.fingerprint.digest);
  await writeFile(
    join(directory, "cases/a.json"),
    JSON.stringify(exampleCase, null, 2),
    "utf8",
  );
  const formattedCase = await loadPlanFile(planFilePath);
  assert.equal(formattedCase.valid, true);
  if (!formattedCase.valid) {
    return;
  }
  assert.deepEqual(formattedCase.cases[0]?.value, compact.cases[0]?.value);
  assert.notEqual(formattedCase.fingerprint.digest, formattedPlan.fingerprint.digest);
});

test("fingerprint case contents in plan-reference order", async (t) => {
  const plan = planWithReferences("cases/a.json", "cases/b.json");
  const { planFilePath } = await createPlanDirectory(t, plan, {
    "cases/a.json": caseWithId("a"),
    "cases/b.json": caseWithId("b"),
  });
  const forward = await loadPlanFile(planFilePath);
  assert.equal(forward.valid, true);
  if (!forward.valid) {
    return;
  }
  await writeJson(
    planFilePath,
    planWithReferences("cases/b.json", "cases/a.json"),
  );
  const reverse = await loadPlanFile(planFilePath);
  assert.equal(reverse.valid, true);
  if (!reverse.valid) {
    return;
  }
  assert.deepEqual(
    reverse.cases.map(({ value }) => value.id),
    ["b", "a"],
  );
  assert.equal(
    reverse.fingerprint.digest,
    "c15da818e5e15bdaa47452f33325592a921ed02140328f1e997dd94899dd69d8",
  );
  assert.notEqual(reverse.fingerprint.digest, forward.fingerprint.digest);
});

test("does not parse unreferenced files", async (t) => {
  const plan = planWithReferences("cases/sign-in.json");
  const exampleCase = caseWithId("sign-in");
  const { directory, planFilePath } = await createPlanDirectory(t, plan, {
    "cases/sign-in.json": exampleCase,
    "unused.json": "not valid JSON",
  });
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.cases.length, 1);
    assert.equal(result.cases[0]?.value.id, "sign-in");
  }
  assert.equal(await readFile(join(directory, "unused.json"), "utf8"), "not valid JSON");
});

test("returns a useful issue for a missing referenced case file", async (t) => {
  const { planFilePath } = await createPlanDirectory(
    t,
    planWithReferences("cases/missing.json"),
  );
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/cases/0/path" &&
        issue.keyword === "caseFileError" &&
        issue.reference === "cases/missing.json",
    ),
  );
});

test("rejects a case reference with different on-disk capitalization", async (t) => {
  const { planFilePath } = await createPlanDirectory(
    t,
    planWithReferences("cases/sign-in.json"),
    { "cases/Sign-In.json": caseWithId("sign-in") },
  );
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/cases/0/path" &&
        issue.keyword === "caseMismatch" &&
        issue.reference === "cases/sign-in.json",
    ),
  );
});

test("returns a useful issue for malformed plan JSON", async (t) => {
  const { planFilePath } = await createPlanDirectory(t, planWithReferences());
  await writeFile(planFilePath, "{", "utf8");
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) => issue.path === "/plan" && issue.keyword === "invalidJson",
    ),
  );
});

test("returns a useful issue for malformed case JSON", async (t) => {
  const { planFilePath } = await createPlanDirectory(
    t,
    planWithReferences("cases/broken.json"),
    { "cases/broken.json": "{" },
  );
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/cases/0/path" &&
        issue.keyword === "invalidJson" &&
        issue.reference === "cases/broken.json",
    ),
  );
});

test("reports case schema issues with their source reference", async (t) => {
  const invalidCase = { ...caseWithId("bad-case"), steps: "invalid" };
  const { planFilePath } = await createPlanDirectory(
    t,
    planWithReferences("cases/bad.json"),
    { "cases/bad.json": invalidCase },
  );
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/caseFiles/0/steps" &&
        issue.reference === "cases/bad.json",
    ),
  );
});

test("rejects a symlink whose target is outside the plan folder", async (t) => {
  const plan = planWithReferences("cases/outside.json");
  const { directory, planFilePath } = await createPlanDirectory(t, plan);
  const outsideDirectory = await mkdtemp(join(tmpdir(), "stagehand-outside-"));
  t.after(async () => rm(outsideDirectory, { recursive: true, force: true }));
  const outsideFile = join(outsideDirectory, "outside.json");
  const linkPath = join(directory, "cases/outside.json");
  await writeJson(outsideFile, caseWithId("outside"));
  await mkdir(dirname(linkPath), { recursive: true });
  if (!(await createSymlink(t, outsideFile, linkPath, "file"))) {
    return;
  }
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/cases/0/path" &&
        issue.keyword === "pathEscapesPlan" &&
        issue.reference === "cases/outside.json",
    ),
  );
});

test("allows a symlink whose target remains inside the plan folder", async (t) => {
  const plan = planWithReferences("cases/linked.json");
  const { directory, planFilePath } = await createPlanDirectory(t, plan, {
    "cases/real.json": caseWithId("inside"),
  });
  const linkPath = join(directory, "cases/linked.json");
  if (!(await createSymlink(t, "real.json", linkPath, "file"))) {
    return;
  }
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.cases[0]?.value.id, "inside");
  }
});

test("resolves the original reference when a link precedes a parent segment", async (t) => {
  const plan = planWithReferences("linked/../selected.json");
  const { directory, planFilePath } = await createPlanDirectory(t, plan, {
    "cases/selected.json": caseWithId("resolved-target"),
    "selected.json": caseWithId("lexical-target"),
  });
  await mkdir(join(directory, "cases/sub"), { recursive: true });
  if (!(await createSymlink(t, "cases/sub", join(directory, "linked"), "dir"))) {
    return;
  }
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.cases[0]?.value.id, "resolved-target");
  }
});

test("maps duplicate case IDs back to their referenced files", async (t) => {
  const plan = planWithReferences("cases/first.json", "cases/second.json");
  const repeatedCase = caseWithId("same-id");
  const { planFilePath } = await createPlanDirectory(t, plan, {
    "cases/first.json": repeatedCase,
    "cases/second.json": repeatedCase,
  });
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/caseFiles/1/id" &&
        issue.keyword === "uniqueCaseId" &&
        issue.reference === "cases/second.json",
    ),
  );
});

test("returns an issue when the plan file cannot be resolved", async () => {
  const result = await loadPlanFile(join(tmpdir(), "stagehand-plan-does-not-exist.json"));
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.path === "/plan"));
});

test("reports a case directory where a case file is expected", async (t) => {
  const plan = planWithReferences("cases/folder");
  const { directory, planFilePath } = await createPlanDirectory(t, plan);
  await mkdir(join(directory, "cases/folder"), { recursive: true });
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.keyword === "notAFile"));
});

test("passes the canonical case content into shared bundle validation", async (t) => {
  const plan = planWithReferences("cases/a.json", "cases/b.json");
  const validCase = caseWithId("valid");
  const invalidCase = { ...caseWithId("invalid"), steps: null };
  const { planFilePath } = await createPlanDirectory(t, plan, {
    "cases/a.json": validCase,
    "cases/b.json": invalidCase,
  });
  const result = await loadPlanFile(planFilePath);
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.path === "/caseFiles/1/steps" &&
        issue.reference === "cases/b.json",
    ),
  );
});
