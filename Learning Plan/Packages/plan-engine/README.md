# `@stagehand/plan-engine` learning guide

This guide focuses on the current Node.js file loader in `plan-engine`. For shared plan contracts, see the [versioned plan and result schemas lesson](../../Phase%201/03-versioned-test-plan-and-result-schemas.md) and the [`plan-schema` package guide](../plan-schema/README.md).

## Self-assessment

Before reading, check which statements you can explain:

- [ ] I can explain why file-system access belongs in plan-engine rather than plan-schema.
- [ ] I can describe what `loadPlanFile` returns on success and failure.
- [ ] I can explain why the loader checks the original reference when resolving links.
- [ ] I can explain how the loader fingerprints exact source bytes without using machine-specific paths.
- [ ] I can run the loader tests and describe what they verify.

## What you will learn

- How plan-engine depends on the shared plan-schema contract.
- How the loader reads a plan and only the case files it references.
- How it handles links, relative paths, invalid JSON, and file errors.
- How each loaded case remains tied to its original plan reference.
- How the loader computes a versioned SHA-256 fingerprint from the raw plan and referenced case files.

## Package purpose and boundaries

The package owns Node-side plan-file loading. It depends on `@stagehand/plan-schema` for plan validation, relative-reference matching, and validation of parsed cases. The schema package remains usable in a browser because it does not read files or use Node APIs.

`loadPlanFile(path)` returns a result object. On success it includes the parsed plan, an ordered list of parsed case files, and a source fingerprint. Each case entry carries its index and original reference from the plan. On failure it returns issues with a location and message; case-related issues also include the reference that led to that file. The caller can display these details without reconstructing which file failed.

The loader reads the plan file, checks its schema, matches its references, and resolves the original reference for each case. It checks each path segment against the actual on-disk spelling, so a reference with different capitalization is rejected on Windows as well as on Linux. It resolves path segments in order, following a link before interpreting a later `..`, so Windows and Linux use the same rule. It follows a link only when its canonical destination remains inside the plan folder. It reads the resolved file it checked, parses only referenced cases, and passes them to `validatePlanBundle` in plan order. Unreferenced files are left alone. The loader does not interpret steps or launch a browser.

The shared matcher normalizes paths for matching, but that normalized text is not enough to check where a link points. The loader resolves the original plan reference one segment at a time, so a link followed by `..` is handled consistently across operating systems. Its tests include that case, as well as links that stay inside or lead outside the plan folder.

The fingerprint uses SHA-256 over length-prefixed records. It hashes the plan's exact bytes first with the fixed label `plan`, then hashes each referenced case's exact bytes in plan order using its normalized `/`-separated relative path as the label. Each label/path and byte-content field has an unsigned 64-bit big-endian length prefix. This avoids ambiguous concatenation and machine-specific absolute paths. Because raw bytes are included, formatting or line-ending changes change the fingerprint even when the parsed JSON value is the same. The loader returns `{ algorithm: "sha256-v1", digest }`; the result-model package defines the corresponding result shape but does not calculate the digest.

## Source map

| File | What to learn from it |
| --- | --- |
| [`src/index.ts`](../../../packages/plan-engine/src/index.ts) | Public `loadPlanFile` API, reference matching, file loading, link checks, source fingerprinting, and failure results. |
| [`test/load-plan.test.js`](../../../packages/plan-engine/test/load-plan.test.js) | File, JSON, path capitalization, symlink, association, bundle-validation, and fingerprint tests. |
| [`package.json`](../../../packages/plan-engine/package.json) | Public package entry point, scripts, schema dependency, and Node type declarations. |
| [`README.md`](../../../packages/plan-engine/README.md) | Short public guide to the loader and its limits. |
| [ATR-002](../../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md) | Requirements for loading and validating plan and case files. |
| [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md) | The M3 loader deliverable and the later editor/runner integration tasks. |

## Exercise

From the repository root, run:

```sh
npm test --workspace @stagehand/plan-engine
```

Then work through these steps:

1. Trace how the plan file is read and checked before its case references are processed.
2. Follow one case from its plan reference through matching, link resolution, reading, parsing, and shared bundle validation.
3. Add an unreferenced malformed JSON file and confirm it does not make the load fail.
4. Change a referenced case to malformed JSON and identify the returned issue's path and `reference`.
5. Explain why the loader resolves the original reference when links and `..` occur together.
6. Load the same files twice and confirm the fingerprint is stable. Reformat the plan or case JSON without changing its parsed value and confirm the fingerprint changes because the exact bytes changed.
7. Reverse two case references and explain how the changed plan bytes and case order affect the fingerprint.

## You are ready when

- You can explain why Node file access belongs in plan-engine and shared validation belongs in plan-schema.
- You can follow the association from a plan reference to its parsed case value and any returned issue.
- You can explain why a link is allowed only when its resolved target stays inside the plan folder.
- You can explain the fingerprint's record order, length prefixes, normalized case labels, and raw-byte behaviour.
- You know that a successfully loaded plan has not yet been executed.

## Known limits

- The package does not run steps or start a browser.
- Unsupported plan versions are rejected by the v1 schema validator. A dedicated unsupported-version diagnostic is a possible future refinement, not an outstanding M3 task.
- GitHub Actions runs the loader tests on both Linux and Windows. Symlink-specific tests may skip on Windows environments that do not permit creating links.

## Reinforcement quiz

1. Why does the loader resolve the original reference instead of checking only the normalized matching text?
2. What does each loaded case's `caseIndex` connect it to?
3. Which bytes and labels are included in a `sha256-v1` fingerprint, and in what order?
4. Why are the field lengths prefixed?
5. Does a successful `loadPlanFile` call mean the test steps have run?

<details>
<summary>Answer key</summary>

1. A link can change how later path segments such as `..` resolve. The original reference identifies the file the loader must check and read.
2. It connects the parsed case to the corresponding entry in `plan.cases`.
3. The plan's raw bytes are hashed first with the fixed `plan` label, then each referenced case's raw bytes in plan order with its normalized `/`-separated relative path as the label.
4. Length prefixes make field boundaries unambiguous when records are concatenated for hashing.
5. No. Loading and validation happen before execution; step execution is not implemented in this package.

</details>

## References

- [Node.js crypto module](https://nodejs.org/api/crypto.html)
- [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md)
- [ATR-002](../../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md)
