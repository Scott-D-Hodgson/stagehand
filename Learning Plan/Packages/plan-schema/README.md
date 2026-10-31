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
- How action-discriminated case steps constrain supported actions, assertions, and wait items.
- How the package selects Ajv's JSON Schema Draft 2020-12 implementation.
- How the public validator API returns useful issues for invalid data.
- How runtime locale-key checks supplement the JSON Schema constraints.
- How schema and runtime checks require absolute HTTP/HTTPS navigation URLs.
- How shared path matching connects plan references to imported relative file names.
- How Node's built-in test runner checks behaviour through the package's public entry point.

## Package purpose and boundaries

The package owns shared plan and case JSON Schemas and synchronous functions that check input values against those schemas. It is intended to be usable by Node.js and browser consumers. Its current tests run in Node; browser bundling and browser behaviour have not been verified here.

The functions accept values of type `unknown`. A caller that starts with a JSON file must parse its text before calling a validator. The result says whether the value matches the selected schema. It does not say that the plan is ready to execute.

The current case schema validates the initial action and assertion formats, including action-specific required fields, one locator strategy, ordered `before`/`after` wait lists, positive timeout values, bounded delay values, and an absolute HTTP/HTTPS URL for navigation. Relative URLs are unsupported until a `baseURL` setting is designed. Runtime validation checks URL syntax and host presence and canonicalizes expected-value locale keys, rejecting invalid or duplicate-equivalent keys. `matchCaseReferences` compares normalized relative names only; it does not read case files or enforce canonical path containment. `validatePlanBundle` validates parsed cases and checks case-ID uniqueness within the plan. Action execution, browser-level locator checks and waits, variable resolution, and secrets remain future work.

Browser settings in both plan defaults and case overrides accept only the type identifier `chromium`, representing Playwright-managed Chromium. Other browser types are rejected; later browser support will require an intentional schema update.

The planned run defaults are headless mode, 1280 by 720 CSS pixels, the `UTC` time zone, and the plan's `en-CA` locale. Headless mode and locale are run-wide, so a case cannot override them; case settings may override the viewport and time zone. JSON Schema `default` annotations document these values but do not modify input. The validators check locale syntax and time-zone support using the runtime's `Intl` implementation. `runner-core` applies these browser defaults when creating the run and case sessions; accessibility settings are not yet applied by the browser lifecycle.

Accessibility configuration is optional and can be set in plan defaults or case settings. When present, omitted `enabled` and `failOnViolation` values default to `false`; a case can override the plan's values. These schema defaults also remain annotations until a consumer calculates effective settings.

## Case-step formats

The case schema selects a step format by its `action` value. It accepts `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue`. A `navigate` URL must be absolute and use HTTP or HTTPS with a host; a relative URL has no defined base and is rejected. Each format requires its own fields and rejects unrecognised fields. Interactions require one valid locator; `type` also requires `text`, `fill` requires `value`, and `selectOption` requires exactly one of `value` or `label`. Assertions require an `expected` object with a string `default` and optional string locale values. `assertValue` may include an `associatedLabel` expected-value object.

Interactions may include ordered `before` and `after` lists, whose items are a locator wait, a `domcontentloaded`/`networkidle` state wait, or a bounded delay. The schema constrains timeout and delay values, but the runner will perform the waits and apply the agreed retry policy. The schema's defaults (including `soft: false`, `scrollIntoView: true`, and 30-second timeouts) are annotations; validation does not insert them into the caller's object.

After the case matches its JSON Schema, `validateCase` parses navigation URLs with the standard `URL` API and checks that they use HTTP/HTTPS and have a host. It also checks expected-value locale keys with `Intl.getCanonicalLocales`, rejecting malformed BCP 47 tags and keys that canonicalize to the same locale. These semantic checks return normal `ValidationIssue` entries and leave the input unchanged.

## Accessibility tag configuration

The schemas accept `defaults.accessibility.tags` on a plan and `settings.accessibility.tags` on a case. Each is an optional array of unique exact axe-core 4.14.0 tag strings. Unknown tags, wrong case, whitespace changes, duplicates, and malformed values fail validation. Both standalone schemas publish the same tag catalogue; refresh it deliberately when updating the pinned engine. Axe is not a runtime dependency of this shared package.

Omitting case tags preserves inheritance from the plan; a non-empty case list replaces the entire plan list, while `[]` clears it and requests axe defaults without a tag filter. At plan scope, omission or `[]` also means axe defaults. Tags do not enable scanning. Validation preserves the distinction between omission and an empty list without inserting defaults or calculating effective settings; scanner execution remains future work.

The checkout example selects two tags, its sign-in case omits them, and the action-contract case explicitly clears them while keeping scanning disabled. Trace all three examples. Then change one tag to a misspelling and inspect the validation issue path. Explain why accepting these documents does not prove that scans run or inheritance is applied.

After this slice, plan-schema builds and all 39 public-entry tests pass locally on Windows. The dependent plan-engine suite passes 14 tests and skips 3 Windows symlink tests. Dev-container and CI verification remain outstanding. See the [package README](../../../packages/plan-schema/README.md) for the scope table and update procedure.

### Keeping the tag catalogue current

The current public-entry tests check that both standalone schema inventories agree. Two identical lists can still both be stale after an engine upgrade. A separate comparison with the installed engine's full `getRules()` tag set checked this slice's inventory; it is not an automated release monitor. See the [manual inspection command](../../../packages/plan-schema/README.md) and proposed [TE-022](../../../Planning/Backlog/technical-enablers/te-022-axe-tag-catalogue-update-detection.md).

As an exercise, sketch three situations: only the plan list is stale, both schema lists are identically stale, and a newer engine release exists while the pinned engine and both lists still match. Explain which comparison detects each situation. Distinguish local drift checking from upstream-release awareness, and identify why a candidate tag must not be accepted before a reviewed engine update supports it. The monitor, notification mechanism, and refresh generator remain proposed work.

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

`matchCaseReferences(plan, availablePaths)` checks references against relative file names before file contents are read. It returns matched paths in the same order as the plan's cases and issues for missing, ambiguous, duplicate, or escaping references. It matches case-sensitively and normalizes `.` segments and repeated `/`. When a match fails, any other references that matched are still returned so an editor can show partial results. The caller remains responsible for reading and parsing matched files; Node-side code must resolve the original plan reference for canonical containment checks and read the target it checked. The normalized match key alone is not enough for filesystem safety because links can change how a path resolves.

After matching and parsing the referenced files in plan order, `validatePlanBundle(plan, parsedCases)` checks that one case was supplied per reference, validates every case against the case schema, and checks that case IDs are unique within the plan. Case-file schema issues use `/caseFiles/{index}/...` paths, with the index pointing to the corresponding entry in `plan.cases`. This shared function does not match paths or read files; the Node-side `plan-engine` package currently owns filesystem loading and containment checks.

## Source map

| File | What to learn from it |
| --- | --- |
| [`src/plan-v1.schema.json`](../../../packages/plan-schema/src/plan-v1.schema.json) | Required plan fields, defaults, case references, and constraints. |
| [`src/case-v1.schema.json`](../../../packages/plan-schema/src/case-v1.schema.json) | Case envelope, settings, variables, and the supported initial action/assertion formats. |
| [`src/index.ts`](../../../packages/plan-schema/src/index.ts) | Public exports, Ajv setup, compiled validators, relative path matching, parsed-bundle validation, and issue mapping. |
| [`test/validation.test.js`](../../../packages/plan-schema/test/validation.test.js) | Valid examples, invalid inputs, reference matching, parsed-bundle checks, and imports through `@stagehand/plan-schema`. |
| [`examples/cases/action-contract.json`](../../../packages/plan-schema/examples/cases/action-contract.json) | One valid example covering every initial action/assertion and supported wait-list item. |
| [`test/fixtures/invalid-action-case.json`](../../../packages/plan-schema/test/fixtures/invalid-action-case.json) | An invalid case demonstrating rejection of an unknown step property. |
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
7. Validate a bundle with two cases that share an ID and inspect the duplicate-ID issue path.
8. Compare the action-contract example with each action definition, then alter a locale key to observe a semantic validation issue.
9. Try relative, FTP, and malformed navigation URLs and inspect the validation issue; then try the valid local HTTP URL in the action example.

## You are ready when

- You can locate the plan and case rules in their JSON Schema files.
- You can explain why schema validity does not prove that a plan will execute successfully.
- You can explain the fields in a `ValidationIssue` and why an invalid value returns a result rather than throwing.
- You can explain why path matching does not prove filesystem containment and why a failed match can still contain useful successful matches.
- You can explain how bundle validation maps parsed-case issues to plan-reference order and checks case-ID uniqueness.
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
