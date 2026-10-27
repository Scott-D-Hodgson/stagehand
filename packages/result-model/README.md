# Result model

This initial package slice contains the normative JSON Schema for Stagehand result documents and one synthetic example. The schema uses JSON Schema Draft 2020-12 and Stagehand result `schemaVersion: 1`.

The schema describes the source plan identity and fingerprint, run outcome and timing, case counts, per-case effective settings, steps, assertions, diagnostics, accessibility findings, and optional artifact references. It defines the result shape; M6 will define how execution outcomes and counts are produced.

The synthetic [checkout result](examples/checkout-result.json) demonstrates one passing case. Its fingerprint is an example value, not a digest calculated from the plan files.

The package does not yet export TypeScript result types or runtime validation. Those will be added with the package entry point and checks in a follow-up implementation step.
