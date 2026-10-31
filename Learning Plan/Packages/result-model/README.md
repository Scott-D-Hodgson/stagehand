# `result-model` package learning guide

This guide focuses on the current `@stagehand/result-model` package. For the contract decisions and broader Phase 1 context, see the [versioned plan and result schemas lesson](../../Phase%201/03-versioned-test-plan-and-result-schemas.md) and the [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md).

## Self-assessment

Before reading, check which statements you can explain:

- [ ] I can explain the difference between JSON Schema runtime validation and TypeScript compile-time types.
- [ ] I can describe the `validateResult` success and failure results.
- [ ] I can identify what this validator checks and what remains execution policy.
- [ ] I can distinguish accepted accessibility fields from the current schema and explain scan-tag input scope versus finding tags.
- [ ] I can run the package tests through its public entry point.

## What you will learn

- How the package exposes its normative schema, TypeScript result types, and validator through one public entry point.
- How Ajv validates the schema and why format validators must be registered.
- How tests check the synthetic result and invalid values through the package export.
- Which rules belong to result structure and which belong to future runner and M6 policy work.

## Current package boundary

The package owns the shared result document contract. Its public entry point exports the result v1 JSON Schema, TypeScript types, and `validateResult`. The schema is the normative contract for emitted result JSON; the TypeScript types help implementation code describe values that conform to it.

M4's accessibility work will extend the v1 result shape with finding URLs, available affected-node details, and effective `enabled` and `failOnViolation` settings plus the effective scan-tag scope. The accepted companion run-level tag filter narrows the assessment when tags are selected; omitted or empty tags leave axe's default rule selection unrestricted. This input filter is separate from the rule `tags` retained on findings. Findings stay attached to their case and are deduplicated within that case, as specified in [ATR-019](../../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-019.md). These result-shape updates are planned work, not yet present in the package schema.

The owner selected finding-level `tags` and affected-node `html`, `target`, `failureSummary`, `impact`, `xpath` when available, and `relatedNodes`. Tags describe the rule; node details describe the affected elements. Axe provides related elements inside individual checks, so retaining them requires mapping that information into Stagehand's result shape. Preserve structured selectors for frames/shadow DOM and optional related-node XPath; do not replace missing upstream details with invented values. See the [accepted field selection under TE-010](../../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-retained-fields). As an exercise, separate rule-level tags from node-level details in a synthetic finding and identify which fields may be absent. The schema, types, examples, and validation tests still need the corresponding implementation slice.

The validator checks structure and registered JSON Schema formats. It does not compute the source fingerprint, load plan files, check relationships among case counts and outcomes, or decide how cases aggregate into a run outcome. The `plan-engine` loader now calculates the fingerprint while loading; a future runner will include it in the emitted result. Execution aggregation policy belongs to M6.

Each result step has a required zero-based `index` within its case. Traceability uses the case ID together with this index. The result contract has no separate step `id` field; plan authors do not assign step IDs.

## What the API teaches

- JSON Schema and TypeScript serve related but distinct roles: the JSON Schema validates runtime data, while TypeScript types support compile-time checking.
- Ajv compiles the Draft 2020-12 schema into a synchronous validator.
- Format validators must be registered for date-time and URI formats to be checked at runtime.
- A validation result is data: invalid user input returns structured issues instead of throwing an exception.
- Public-entry tests import `@stagehand/result-model`, ensuring consumers use the documented package boundary.

## Verify the package

Run `npm test --workspace @stagehand/result-model`. The command builds the TypeScript entry point and runs Node's built-in test runner against the public package import, the synthetic result example, and representative invalid values.

## Practice

Add a synthetic invalid result that violates one schema constraint. Test that `validateResult` returns an issue with the expected JSON Pointer path and keyword. Do not add cross-field rules such as count aggregation to this validator unless the result schema itself is deliberately changed; those rules require an M6 policy decision.

For the upcoming accessibility extension, sketch a synthetic finding with rule tags, one affected node, optional XPath, and a related element. Keep the run's selected scan-tag list separate from the finding's rule tags. Explain how a node without a failure summary or severity should avoid inventing evidence. This is a design exercise: the new fields are not yet valid input to the current result schema. Map the proposed fields to schema/type/example/test changes before implementation, and leave related-node duplicate handling explicit until defined.

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

<details>
<summary>Answer key</summary>

1. The result v1 JSON Schema.
2. `{ valid: false, issues }`, with each issue giving a JSON Pointer path, schema keyword, and message.
3. No. Cross-field count consistency and outcome aggregation belong to execution policy, which M6 defines.
4. No. `plan-engine` calculates the fingerprint while loading source files; the future runner will include it in the result document.
5. No. Finding tags describe one reported rule; the effective input filter must be recorded separately to identify assessment scope, including a run with no findings.
6. No. Their selection is agreed, but the schema, TypeScript types, example, and tests still need the M4 extension.

</details>

## Read next

- [Phase 1 lesson: versioned test-plan and result schemas](../../Phase%201/03-versioned-test-plan-and-result-schemas.md)
- [plan-engine package guide](../plan-engine/README.md)
- [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md)
- [Package README](../../../packages/result-model/README.md)
