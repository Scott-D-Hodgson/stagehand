# `result-model` package learning guide

This guide focuses on the current `@stagehand/result-model` package. For the contract decisions and broader Phase 1 context, see the [versioned plan and result schemas lesson](../../Phase%201/03-versioned-test-plan-and-result-schemas.md) and the [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md).

## Self-assessment

Before reading, check which statements you can explain:

- [ ] I can explain the difference between JSON Schema runtime validation and TypeScript compile-time types.
- [ ] I can describe the `validateResult` success and failure results.
- [ ] I can identify what this validator checks and what remains execution policy.
- [ ] I can describe the implemented accessibility shape and explain scan-tag input scope versus finding tags.
- [ ] I can run the package tests through its public entry point.

## What you will learn

- How the package exposes its normative schema, TypeScript result types, and validator through one public entry point.
- How Ajv validates the schema and why format validators must be registered.
- How tests check the synthetic result and invalid values through the package export.
- Which rules belong to result structure and which belong to future runner and M6 policy work.

## Current package boundary

The package owns the shared result document contract. Its public entry point exports the result v1 JSON Schema, TypeScript types, and `validateResult`. The schema is the normative contract for emitted result JSON; the TypeScript types help implementation code describe values that conform to it.

M4's accessibility result v1 extension is implemented in the schema, TypeScript types, synthetic example, and public-entry tests. Every case must include `effectiveSettings.accessibility` with `enabled`, `failOnViolation`, and resolved `tags`, even if disabled or without findings. `[]` records axe defaults without a tag filter; a selected list records effective scope. Runner-core now resolves plan/case inheritance through a pure helper and session snapshots; a future producer must record those values. This validator does not resolve settings. Finding-level `tags` describe the reported rule and can differ from the input list.

Each finding now includes its URL and `affectedNodes`. An affected node retains markup, structured target, and an explicit `relatedNodes` list, with optional summary, impact, and XPath. Related nodes retain markup/target and optional XPath. Preserve frame/shadow-DOM paths rather than joining them into one selector. Empty target arrays preserve unavailable upstream selector information. Finding severity permits `null`; optional node severity can be absent or `null`. No severity or summary is invented.

Runner-core's pure `mapAccessibilityFindings` helper now flattens related elements from axe's `any`, `all`, and `none` checks and retains one exact html/target/optional-xpath tuple. The mapper removes exact related-node duplicates and calculates each mapped finding's node count. The schema itself does neither: it rejects duplicate related objects but does not map/collect observations, calculate counts, or generate results. Per-case accumulation remains future work. See the [field mapping under TE-010](../../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-retained-fields) and the [package contract](../../../packages/result-model/README.md#accessibility-contract).

Unlike plan configuration, result tag arrays are not checked against the current engine catalogue. They preserve recorded tags from other engine versions as unique non-empty strings. A valid report is historical evidence, not permission to reuse those tags as current configuration without plan validation.

The pre-release result v1 contract now requires more information than the earlier minimal shape. Old examples/results missing case accessibility settings or finding URL/tags/node arrays need updating; no compatibility fallback or migration tool is supplied. This M4 feature extension does not reopen M3. The local Windows build and all 22 tests passed, as did a separate TypeScript public-import check; dev-container/CI and scanner integration remain outstanding.

The validator checks structure and registered JSON Schema formats. It does not compute the source fingerprint, load plan files, check relationships among case counts and outcomes, or decide how cases aggregate into a run outcome. The `plan-engine` loader now calculates the fingerprint while loading; a future runner will include it in the emitted result. Execution aggregation policy belongs to M6.

Each result step has a required zero-based `index` within its case. Traceability uses the case ID together with this index. The result contract has no separate step `id` field; plan authors do not assign step IDs.

## What the API teaches

- JSON Schema and TypeScript serve related but distinct roles: the JSON Schema validates runtime data, while TypeScript types support compile-time checking.
- Ajv compiles the Draft 2020-12 schema into a synchronous validator.
- Format validators must be registered for date-time and URI formats to be checked at runtime.
- A validation result is data: invalid user input returns structured issues instead of throwing an exception.
- Public-entry tests import `@stagehand/result-model`, ensuring consumers use the documented package boundary.

## Verify the package

Run `npm test --workspace @stagehand/result-model`. The command builds the TypeScript entry point and runs Node's built-in test runner against the public package import, the synthetic result example, and representative invalid values, including node evidence, required effective settings, structured targets, and duplicate related nodes.

## Practice

Add a synthetic invalid result that violates one schema constraint. Test that `validateResult` returns an issue with the expected JSON Pointer path and keyword. Do not add cross-field rules such as count aggregation to this validator unless the result schema itself is deliberately changed; those rules require an M6 policy decision.

Start with the synthetic example and validate it through the public import. Remove its findings while keeping effective accessibility settings: explain why that remains valid. Then remove the effective tags list and inspect the issue. Duplicate a related node to observe a uniqueItems issue; change its target or XPath to demonstrate distinct evidence. Remove a node summary/impact or use null severity without inventing a value. Explain why a structurally valid result can still have inconsistent counts or an outcome that requires M6 review.

## You are ready when

- You can explain why the JSON Schema is the runtime contract while TypeScript types support implementation code.
- You can describe what a validation issue's path and keyword tell a caller.
- You can distinguish schema validation from fingerprint calculation and outcome aggregation.
- You can run the package test command and explain what the public import verifies.

## References

- [JSON Schema Draft 2020-12 specification](https://json-schema.org/draft/2020-12)
- [Ajv format validation](https://ajv.js.org/guide/formats)
- [Ajv formats package](https://ajv.js.org/packages/ajv-formats.html)
- [Node.js test runner](https://nodejs.org/api/test.html)

## Reinforcement quiz

1. Which artifact defines the normative runtime shape of a Stagehand result document?
2. What does `validateResult` return when the input is invalid?
3. Does a passing result-schema check prove that `caseCounts` agree with case outcomes?
4. Does the result-model package calculate the `sha256-v1` fingerprint?
5. Does a finding's `tags` array tell you the complete configured scope of an assessment?
6. Are the selected affected-node fields already accepted by the current result schema?
7. Why may a tag pass result validation but fail current plan validation?

<details>
<summary>Answer key</summary>

1. The result v1 JSON Schema.
2. `{ valid: false, issues }`, with each issue giving a JSON Pointer path, schema keyword, and message.
3. No. Cross-field count consistency and outcome aggregation belong to execution policy, which M6 defines.
4. No. `plan-engine` calculates the fingerprint while loading source files; the future runner will include it in the result document.
5. No. Finding tags describe one reported rule; the effective input filter must be recorded separately to identify assessment scope, including a run with no findings.
6. Yes. The schema/types/example/tests now include them; the pure mapper is implemented, while its integration, per-case collection/count updates, and result production remain future execution work.
7. Results preserve recorded evidence across engine versions; current plans must use tags supported by the pinned engine. The two validators serve different purposes.

</details>

## Read next

- [Phase 1 lesson: versioned test-plan and result schemas](../../Phase%201/03-versioned-test-plan-and-result-schemas.md)
- [plan-engine package guide](../plan-engine/README.md)
- [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md)
- [Package README](../../../packages/result-model/README.md)
