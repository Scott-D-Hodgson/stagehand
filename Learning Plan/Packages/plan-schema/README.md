# `@stagehand/plan-schema` learning guide

This guide focuses on the current `plan-schema` package implementation. For the broader contract decisions and Phase 1 context, see the [versioned test-plan and result schemas lesson](../../Phase%201/03-versioned-test-plan-and-result-schemas.md).

## Self-assessment

Before reading, check which statements you can explain:

- [ ] A JSON Schema checks document shape and constraints; it does not execute a plan.
- [ ] The package accepts JavaScript values, not JSON text to parse.
- [ ] I can describe the difference between `validatePlan` and semantic plan validation.
- [ ] I can explain what `matchCaseReferences` checks and what it leaves to a filesystem loader.
- [ ] I can run the package tests and explain what the public-entry import proves.

## What you will learn

- How plan and case schema files define the initial document contracts.
- How the package selects Ajv's JSON Schema Draft 2020-12 implementation.
- How the public validator API returns useful issues for invalid data.
- How shared path matching connects plan references to imported relative file names.
- How Node's built-in test runner checks behaviour through the package's public entry point.

## Package purpose and boundaries

The package owns shared plan and case JSON Schemas and synchronous functions that check input values against those schemas. It is intended to be usable by Node.js and browser consumers. Its current tests run in Node; browser bundling and browser behaviour have not been verified here.

The functions accept values of type `unknown`. A caller that starts with a JSON file must parse its text before calling a validator. The result says whether the value matches the selected schema. It does not say that the plan is ready to execute.

The current case schema accepts `steps` as an array of objects, but does not validate step fields or action names. `matchCaseReferences` compares normalized relative names only; it does not read case files or enforce canonical path containment. Cross-file case-ID checks, plan/case compatibility, variable resolution, and secrets remain future work.

## How validation works

The schema documents declare JSON Schema Draft 2020-12 with `$schema`. Stagehand's own `schemaVersion` fields are separate: the initial plan and case documents each use integer version `1`. Ajv uses a distinct class for Draft 2020-12 schemas; this package creates that validator and compiles both schemas once when the module loads. The two compiled validators are then reused for calls.

The schema validators return a discriminated result:

```ts
{ valid: true }
```

or:

```ts
{
  valid: false,
  issues: [{ path: "/schemaVersion", keyword: "const", message: "must be equal to constant" }]
}
```

`path` is the JSON Pointer location reported by Ajv; an empty path refers to the root value. A schema mismatch is returned as data instead of thrown as an exception. The implementation copies Ajv's current error details into the result immediately so callers receive a stable issue list.

`matchCaseReferences(plan, availablePaths)` checks references against relative file names before file contents are read. It returns matched paths in the same order as the plan's cases and issues for missing, ambiguous, duplicate, or escaping references. It matches case-sensitively and normalizes `.` segments and repeated `/`. When a match fails, any other references that matched are still returned so an editor can show partial results. The caller remains responsible for reading and parsing matched files; Node-side code must also check canonical filesystem containment and links.

## Source map

| File | What to learn from it |
| --- | --- |
| [`src/plan-v1.schema.json`](../../../packages/plan-schema/src/plan-v1.schema.json) | Required plan fields, defaults, case references, and constraints. |
| [`src/case-v1.schema.json`](../../../packages/plan-schema/src/case-v1.schema.json) | Case envelope, settings, variables, and the current intentionally broad step shape. |
| [`src/index.ts`](../../../packages/plan-schema/src/index.ts) | Public exports, Ajv setup, compiled validators, relative path matching, and issue mapping. |
| [`test/validation.test.js`](../../../packages/plan-schema/test/validation.test.js) | Valid examples, invalid inputs, reference matching, and imports through `@stagehand/plan-schema`. |
| [`package.json`](../../../packages/plan-schema/package.json) | Package entry point, build/test commands, and the Ajv dependency. |
| [`THIRD-PARTY-NOTICES.md`](../../../THIRD-PARTY-NOTICES.md) | Dependency attributions and licence texts, including the reviewed BSD-3-Clause notice for `fast-uri`. |

## Exercise

From the repository root, run:

```sh
npm test --workspace @stagehand/plan-schema
```

Then work through these steps:

1. Read the valid plan and case examples. Find one schema constraint for each.
2. In a local test copy, change the plan's `schemaVersion` from `1` to `"1"`. Predict the issue path and keyword, then inspect the matching assertion in the test file.
3. Change the case's `steps` value from an array to a string. Explain which schema rule rejects it.
4. Trace a failing value from the test through `validatePlan` or `validateCase` in `src/index.ts` and identify where the issues are copied.
5. Add a test for one other schema failure without changing the committed example files.
6. Add a missing reference beside a matched reference and inspect both the issue and the partial matches returned.

## You are ready when

- You can locate the plan and case rules in their JSON Schema files.
- You can explain why schema validity does not prove that a plan will execute successfully.
- You can explain the fields in a `ValidationIssue` and why an invalid value returns a result rather than throwing.
- You can explain why path matching does not prove filesystem containment and why a failed match can still contain useful successful matches.
- You can run the package tests and describe how importing by package name exercises the configured public entry point.
- You can identify which checks are still semantic or execution-related and therefore outside this package's current validator.

## References

- [Ajv: JSON Schema versions](https://ajv.js.org/json-schema.html) — Draft 2020-12 support and its separate Ajv class.
- [Node.js test runner](https://nodejs.org/api/test.html) — the built-in `node:test` API and command-line runner.
- [Phase 1 lesson: versioned test-plan and result schemas](../../Phase%201/03-versioned-test-plan-and-result-schemas.md)
- [ADR-004: initial workspace and package boundaries](../../../Planning/Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md)
- [TE-002: reusable Node.js/TypeScript package structure](../../../Planning/Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md)

## Reinforcement quiz

1. Does `validatePlan` parse JSON text?
2. What does a `{ valid: false, issues: [...] }` result tell you, and what does it not tell you?
3. Why does this package use the Draft 2020-12 Ajv class?
4. What does the package-name import in the tests verify?

<details>
<summary>Answer key</summary>

1. No. The caller parses text first and passes the resulting value to the validator.
2. It tells you that the value does not match the plan or case schema and gives schema issues. It does not determine whether external references resolve or whether steps are executable.
3. The schemas declare Draft 2020-12, which Ajv supports through a separate class.
4. It checks that the validator functions are available through the package's configured public entry point, rather than importing the source file directly.

</details>
