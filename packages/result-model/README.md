# Result model

This package contains the normative JSON Schema for Stagehand result documents, matching TypeScript types, a runtime validator, and one synthetic example. The schema uses JSON Schema Draft 2020-12 and Stagehand result `schemaVersion: 1`.

The schema describes the source plan identity and fingerprint, run outcome and timing, case counts, per-case effective settings, steps, assertions, diagnostics, accessibility findings, and optional artifact references. It defines the result shape; M6 will define how execution outcomes and counts are produced.

The public entry point exports `resultSchemaV1`, the v1 result types, and `validateResult(input)`. The validator returns `{ valid: true }` for schema-conforming documents or `{ valid: false, issues }` with JSON Pointer paths, schema keywords, and messages. It does not throw for invalid JSON values. Registered format checks validate date-time and URI fields, including the schema's UTC timestamp requirement.

The synthetic [checkout result](examples/checkout-result.json) demonstrates one passing case. Its fingerprint is an example value, not a digest calculated from the plan files. The Node-side `plan-engine` loader now calculates the source fingerprint during loading; a future runner will carry it into the emitted result. Validation checks the result's structure and field formats. It does not check whether case counts agree with case outcomes or decide run aggregation; M6 owns those policies.

Run `npm test --workspace @stagehand/result-model` to build the package and exercise its public entry point against the example and invalid inputs.
