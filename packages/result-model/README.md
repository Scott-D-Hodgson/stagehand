# Result model

This package contains the normative JSON Schema for Stagehand result documents, matching TypeScript types, a runtime validator, and one synthetic example. The schema uses JSON Schema Draft 2020-12 and Stagehand result `schemaVersion: 1`.

The schema describes source identity/fingerprint, timing, case counts, effective settings, steps, assertions, diagnostics, accessibility findings, and optional artifacts. It validates structure and formats; it does not produce results, calculate fingerprints, collect/deduplicate scan findings, check cross-field counts, or enforce M6 outcome policy.

The public entry point exports `resultSchemaV1`, the v1 result types, and `validateResult(input)`. The validator returns `{ valid: true }` or `{ valid: false, issues }` with JSON Pointer paths, schema keywords, and messages. Invalid JSON values do not throw. Registered formats check UTC date-time and URI fields. Validation does not insert defaults or modify input.

## Accessibility contract

M4's result-shape extension is implemented in the schema, types, example, and public-entry tests. Scanner execution and result production remain future work. See [ATR-019](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-019.md) and the [field mapping under TE-010](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-retained-fields).

Every case must record `effectiveSettings.accessibility` with all three fields, even when disabled or when there are no findings:

| Field | Meaning |
| --- | --- |
| `enabled` | Effective scan switch. |
| `failOnViolation` | Effective policy setting; the validator does not apply it to outcomes. |
| `tags` | Resolved input filter. `[]` means axe defaults without a tag restriction; a non-empty list records the selected filter. |

Runner-core now provides `resolveAccessibilitySettings` and per-session snapshots. A future result producer must carry those effective settings into the document; this validator does not calculate them. Omitted case tags inherit; non-empty lists replace the plan list; explicit `[]` clears it. Tags do not enable scanning. The result requires a resolved list rather than an omitted value or inserted default.

Each finding requires `url`, `ruleId`, `impact`, `description`, `help`, `helpUrl`, `affectedNodeCount`, `tags`, and `affectedNodes`. Finding `tags` describe its rule and are separate from the effective input filter. URLs use absolute URI syntax so an actual scan location such as `about:blank` can be retained. The existing count is retained; producers must calculate it consistently with collected nodes, but this validator does not compare it with array length.

| Node scope | Required fields | Optional fields |
| --- | --- | --- |
| Affected node | `html`, `target`, `relatedNodes` | `failureSummary`, `impact`, `xpath` |
| Related node | `html`, `target` | `xpath` |

`target` preserves axe's array structure: strings identify frame/element segments and nested arrays of at least two strings identify shadow-DOM paths. An empty target can preserve unavailable upstream selectors. XPath is a string array, not a joined path. Unknown finding severity is `null`; node severity may be omitted or `null`, while other optional unavailable details are omitted. No diagnostic value is invented.

For the future scanner, flatten related elements from the affected node's `any`, `all`, and `none` checks into `relatedNodes`. Keep exact duplicates of the `html`/structured `target`/optional `xpath` tuple once. Different targets or XPath evidence remain distinct; absence and an explicitly empty XPath list are distinct representations. The schema rejects duplicate related objects but does not perform this mapping. It excludes full check records, arbitrary check data, ancestry, and live DOM references. Case-level finding grouping/deduplication by URL, description, and problematic markup remains scanner work.

Result tag lists require unique non-empty strings, but deliberately do not embed the current engine's tag allowlist: stored results from other engine versions must remain readable. Current plan/case validation still rejects unknown configuration tags against the pinned catalogue.

## Compatibility and example

This is the planned M4 refinement of result v1, not a reopening of M3. It tightens the pre-release contract: earlier results missing the required case accessibility settings, or findings missing URL/tags/node arrays, must be updated. There is no legacy fallback or migration tool in this slice.

The synthetic [checkout result](examples/checkout-result.json) demonstrates a functionally passing case with a non-failing accessibility finding, frame/shadow targets, and related-node evidence. It is hand-authored example data, not output from an executed axe scan or proof of aggregation policy. Its fingerprint is an example value, not a digest of the plan files. The plan-engine loader calculates source fingerprints; future execution will carry one into emitted results.

## Verification

Run `npm test --workspace @stagehand/result-model` from the repository root. The build and all 22 tests passed locally on Windows for this extension. A separate TypeScript public-import check covered the new exported types and expected type errors. Dev-container/CI and real scan integration remain unverified for this slice.
