# Result model

This package contains the normative JSON Schema for Stagehand result documents, matching TypeScript types, a runtime validator, and one synthetic example. The schema uses JSON Schema Draft 2020-12 and Stagehand result `schemaVersion: 1`.

The schema describes the source plan identity and fingerprint, run outcome and timing, case counts, per-case effective settings, steps, assertions, diagnostics, accessibility findings, and optional artifact references. It defines the result shape; M6 will define how execution outcomes and counts are produced.

M4's accessibility work will extend the v1 result shape with each finding's page URL and available affected-node details, and record both effective `enabled` and `failOnViolation` settings plus the effective scan-tag scope. The accepted companion run-level tag filter narrows the assessment when tags are selected; omitted or empty tags leave axe's default rule selection unrestricted. This input filter is separate from the rule `tags` retained on findings. Findings remain attached to their case and are deduplicated within that case. See [ATR-019](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-019.md).

The accepted field selection adds finding-level `tags` and affected-node `html`, structured `target`, available `failureSummary` and `impact`, `xpath` when available, and `relatedNodes`. Related elements retain markup, structured target, and optional XPath. These additions are planned for the next result-model slice; they are not yet represented by the schema or TypeScript types. See the [accepted selection under TE-010](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-retained-fields).

The public entry point exports `resultSchemaV1`, the v1 result types, and `validateResult(input)`. The validator returns `{ valid: true }` for schema-conforming documents or `{ valid: false, issues }` with JSON Pointer paths, schema keywords, and messages. It does not throw for invalid JSON values. Registered format checks validate date-time and URI fields, including the schema's UTC timestamp requirement.

The synthetic [checkout result](examples/checkout-result.json) demonstrates one passing case. Its fingerprint is an example value, not a digest calculated from the plan files. The Node-side `plan-engine` loader now calculates the source fingerprint during loading; a future runner will carry it into the emitted result. Validation checks the result's structure and field formats. It does not check whether case counts agree with case outcomes or decide run aggregation; M6 owns those policies.

Run `npm test --workspace @stagehand/result-model` to build the package and exercise its public entry point against the example and invalid inputs.
