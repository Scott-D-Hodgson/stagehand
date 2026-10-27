# `result-model` package learning guide

This guide focuses on the current `@stagehand/result-model` package. For the contract decisions and broader Phase 1 context, see the [versioned plan and result schemas lesson](../../Phase%201/03-versioned-test-plan-and-result-schemas.md) and the [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md).

## Self-assessment

Before reading, check which statements you can explain:

- [ ] I can explain the difference between JSON Schema runtime validation and TypeScript compile-time types.
- [ ] I can describe the `validateResult` success and failure results.
- [ ] I can identify what this validator checks and what remains execution policy.
- [ ] I can run the package tests through its public entry point.

## What you will learn

- How the package exposes its normative schema, TypeScript result types, and validator through one public entry point.
- How Ajv validates the schema and why format validators must be registered.
- How tests check the synthetic result and invalid values through the package export.
- Which rules belong to result structure and which belong to future runner and M6 policy work.

## Current package boundary

The package owns the shared result document contract. Its public entry point exports the result v1 JSON Schema, TypeScript types, and `validateResult`. The schema is the normative contract for emitted result JSON; the TypeScript types help implementation code describe values that conform to it.

The validator checks structure and registered JSON Schema formats. It does not compute the source fingerprint, load plan files, check relationships among case counts and outcomes, or decide how cases aggregate into a run outcome. Fingerprint generation belongs to the future source-loading/execution flow; execution policy belongs to M6.

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

<details>
<summary>Answer key</summary>

1. The result v1 JSON Schema.
2. `{ valid: false, issues }`, with each issue giving a JSON Pointer path, schema keyword, and message.
3. No. Cross-field count consistency and outcome aggregation belong to execution policy, which M6 defines.
4. No. Fingerprint calculation belongs to the future source-loading or execution flow.

</details>

## Read next

- [Phase 1 lesson: versioned test-plan and result schemas](../../Phase%201/03-versioned-test-plan-and-result-schemas.md)
- [M3 work plan](../../../Planning/Work%20Plan/M3-versioned-plan-and-result-contracts.md)
- [Package README](../../../packages/result-model/README.md)
