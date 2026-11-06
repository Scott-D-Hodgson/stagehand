import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const implementationPackages = [
  "plan-schema",
  "plan-engine",
  "result-model",
  "runner-core",
];
const allowedDependencies = {
  "@stagehand/plan-schema": [],
  "@stagehand/plan-engine": ["@stagehand/plan-schema"],
  "@stagehand/result-model": [],
  "@stagehand/runner-core": [
    "@stagehand/plan-schema",
    "@stagehand/plan-engine",
    "@stagehand/result-model",
  ],
  "@stagehand/reporters": ["@stagehand/result-model"],
  "@stagehand/cli": ["@stagehand/runner-core", "@stagehand/reporters"],
  "@stagehand/web": ["@stagehand/plan-schema"],
};

/*
Reads one package manifest from the workspace.
---
Inputs: package folder name.
---
Output: parsed package metadata.
*/
async function readPackageManifest(packageName) {
  const packagePath = join(repositoryRoot, "packages", packageName, "package.json");
  return JSON.parse(await readFile(packagePath, "utf8"));
}

/*
Finds TypeScript source files below one folder.
---
Inputs: source folder path.
---
Output: paths to TypeScript files.
*/
async function findTypeScriptFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findTypeScriptFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }
  return files;
}

/*
Finds Stagehand package names imported by one source file.
---
Inputs: source text.
---
Output: imported package specifiers.
*/
function findStagehandImports(sourceText) {
  return [...sourceText.matchAll(/["'](@stagehand\/[\w-]+(?:\/[^"']+)*)["']/g)].map(
    (match) => match[1],
  );
}

test("implemented packages expose one root entry point", async () => {
  for (const packageName of implementationPackages) {
    const manifest = await readPackageManifest(packageName);
    assert.equal(manifest.types, "./dist/index.d.ts");
    assert.deepEqual(manifest.exports, {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
      },
    });
  }
});

test("implemented package imports follow the approved direction", async () => {
  for (const packageName of implementationPackages) {
    const manifest = await readPackageManifest(packageName);
    const dependencies = Object.keys(manifest.dependencies ?? {});
    const allowed = allowedDependencies[manifest.name];
    assert.ok(allowed, `No allowed-dependency rule exists for ${manifest.name}.`);
    for (const dependency of dependencies.filter((name) => name.startsWith("@stagehand/"))) {
      assert.ok(
        allowed.includes(dependency),
        `${manifest.name} must not depend on ${dependency}.`,
      );
    }
    const sourceDirectory = join(repositoryRoot, "packages", packageName, "src");
    for (const sourceFile of await findTypeScriptFiles(sourceDirectory)) {
      const sourceText = await readFile(sourceFile, "utf8");
      for (const specifier of findStagehandImports(sourceText)) {
        const dependency = specifier.split("/").slice(0, 2).join("/");
        assert.equal(
          specifier,
          dependency,
          `${relative(repositoryRoot, sourceFile)} imports an internal package path: ${specifier}.`,
        );
        assert.ok(
          dependencies.includes(dependency),
          `${relative(repositoryRoot, sourceFile)} imports ${dependency}, but it is not declared as a dependency.`,
        );
        assert.ok(
          allowed.includes(dependency),
          `${relative(repositoryRoot, sourceFile)} imports ${dependency}, which is not an approved dependency direction.`,
        );
      }
    }
  }
});
