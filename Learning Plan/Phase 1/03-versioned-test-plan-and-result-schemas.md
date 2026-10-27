# 3. Versioned test-plan and result schemas

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, try the exercise to confirm you can design clear validation behaviour.

- [ ] I can distinguish valid JSON syntax from a valid Stagehand plan.
- [ ] I can explain what a schema checks and when domain-specific validation is also needed.
- [ ] I understand why a plan and a result may need separate version numbers.
- [ ] I can explain what should happen when software receives an unsupported plan version.
- [ ] I know why changing a contract requires examples and updates to its consumers.

## What you will learn

- What a data contract/schema does for JSON documents.
- How validation differs from execution.
- Why contracts need explicit versions and compatibility rules.
- How to design clear rejection and migration behaviour.

## Core ideas

A **schema** describes the shape and permitted values of data. A validator compares an input document with that contract and reports violations. A schema can check that a field exists and is the right kind of value; domain rules may need additional validation code where a generic schema cannot express the rule clearly.

Think of a schema as a form with labelled boxes and rules for each box. Validation checks the form before it is handed to the operator. If a new form version adds a field or changes a meaning, the version number tells the operator which instructions apply.

The plan describes shared steps, executable cases, and named data sets. A case is one executable test case with steps; plans can reference case JSON files, and a case file may contribute a named data set to the plan-level collection. Those references use portable relative paths from the plan file's directory; references that escape that directory are rejected, including through a symlink or junction whose canonical target is outside the plan directory. Shared `plan-schema` logic matches case-sensitive relative paths after normalizing `.` segments and repeated `/`. It reports missing, duplicate, ambiguous, and escaping references, and keeps successful matches available when other references fail. The planned browser editor folder-import flow will preserve relative paths for matching without requiring direct filesystem access. Missing or duplicate references make a plan invalid, though the editor may save it as a draft. Stagehand plans are intended to be consumed by both the runner and editor, so both must agree about what a valid plan means. The plan schema is one shared package designed to work in Node.js and the browser. Results have a separate common, versioned contract owned by the result-model package, with a versioned JSON Schema as the normative validation contract for emitted result JSON. The runner core will provide results; the CLI will select the output, and reporters will format those results. JSON is the initial output type. Result identity includes the stable plan ID and plan schema version for logical identity, plus a content fingerprint of the exact plan and referenced case contents for source provenance. JSON Schema Draft 2020-12 is selected; its `$schema` URI identifies the schema-language dialect, separately from Stagehand's integer contract versions. Migration policy and tooling remain to be defined during M3.

## Concepts to understand

### What is meant by “schema representation/validator approach”?

The project has chosen a shared, versioned JSON Schema document for plans and a versioned JSON Schema as the normative contract for result JSON. The Vue editor and runner must both consume the same plan schema and report useful errors. Runtime semantic checks may supplement schema validation, but must not make the editor and runner disagree about valid plans. Result JSON must validate against its result schema, and the result-model package representation must remain aligned with it. The MVP's initial run output is JSON; optional converters for alternate formats may be added later. The plan and result contracts are versioned separately. JSON Schema Draft 2020-12 is selected; `$schema` names that dialect, while each Stagehand document's integer `schemaVersion` identifies its contract version.

- **Syntax vs. semantics:** valid JSON syntax does not imply the document describes a meaningful plan.
- **Required fields, types, and enumerations:** basic schema constraints that catch missing or malformed values.
- **Version selection:** choose the rules for the declared version before interpreting the document.
- **Backward compatibility:** whether newer software can correctly consume older documents.
- **Breaking change:** a change that causes existing producers or consumers to interpret the contract differently or fail.
- **Migration:** an explicit transformation from one contract version to another; migration should preserve intent or report what cannot be preserved.
- **Fixtures:** representative valid and invalid documents used to demonstrate and check contract behaviour.
- **No silent loss:** unknown instructions must not be dropped as though they had been executed.

## Current implementation footing

The initial schemas live in `packages/plan-schema/src/plan-v1.schema.json` and `packages/plan-schema/src/case-v1.schema.json`. Each document has an independent integer `schemaVersion`; both begin at `1`, so the intended initial compatibility pairing is plan v1 with case v1. The package exports those schema objects as `planSchemaV1` and `caseSchemaV1`, plus `validatePlan` and `validateCase`, through `packages/plan-schema/src/index.ts`. TypeScript is the default for new implementation code, with shared strict settings in the root `tsconfig.base.json`.

The package has a test command (`npm test --workspace @stagehand/plan-schema`) and synthetic examples under `packages/plan-schema/examples/`. Its 17 tests build the package and exercise schema validation, normalized and case-sensitive reference matching, partial results, parsed case schemas, bundle cardinality, and duplicate IDs through its public entry point. The Node-only `@stagehand/plan-engine` package provides `loadPlanFile`; its 14 tests cover plan and case file reading, JSON errors, filesystem links, path containment, case-sensitive on-disk spelling, association of each loaded case with its plan reference, and use of shared bundle validation. File loading is not execution: variable resolution and secrets, plan/case compatibility, and executable step definitions remain future work. Plan locale is run-scoped; case settings can override browser and accessibility settings, and CLI settings override plan/case settings. Effective run settings should be recorded in results, whose schema is still to be implemented.

## Apply this to Stagehand

Read [ATR-001](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md), [TE-001](../../Planning/Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), and [ADR-003](../../Planning/Backlog/decisions/ADR-003-versioned-plan-contract.md). Plan validation should happen before browser launch, so a malformed plan is a plan error rather than a misleading failed test. Keep result versioning separate from plan versioning because each contract has its own consumers and change pace.

For every field, ask: who writes it, who reads it, whether it is required, what values are allowed, what its default means, and what error a user sees when it is invalid. Result identity uses stable plan/case identifiers rather than machine-specific paths; case IDs are unique within a plan. Results include both a logical plan identity and a version-identified fingerprint of the exact source contents used for a run. M3 must define whether it hashes raw bytes or canonical JSON, whether paths/order are included, how inputs are framed, and how the algorithm is identified. Timestamps are RFC 3339 UTC strings and durations are integer milliseconds. M6 defines elapsed-time measurement separately from wall-clock timestamps. Do not make a default hide an unsupported or misspelled instruction.

## Exercise

Draft a tiny fictional plan contract with a declared version, browser configuration, one case, one named data set, and one action. Create one valid example and invalid examples for a missing required field, wrong value type, unknown action, unsupported version, escaping case reference, incompatible plan/case versions, duplicate identifier, and semantic validation failure. Describe the error each should produce and verify that none can launch a browser. Repeat the thought exercise for a result that validates against the normative versioned result JSON Schema, including stable source identity, UTC timestamps, and millisecond durations.

## You are ready when

- You can explain the difference between parsing JSON, schema validation, and validating execution-specific rules.
- You can describe how a plan version is selected and what happens when it is unsupported.
- You can identify which changes require a version decision, fixtures, docs, and consumer updates.

## Read next

- [ATR-001 — Versioned JSON test-plan schema](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md)
- [ATR-002 — Load and validate a test plan](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md)
- [TE-001 — Versioned plan and result schemas](../../Planning/Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md)
- [ADR-003 — Versioned test-plan contract](../../Planning/Backlog/decisions/ADR-003-versioned-plan-contract.md)

## Reinforcement quiz

Try these before opening the answer key.

1. Does successfully parsing JSON prove that it is a valid Stagehand test plan? Why?
2. What is the difference between schema validation and execution?
3. Why might plan and result contracts have separate versions?
4. What should a runner do with an unsupported plan version?
5. Name two artifacts or consumers that should be reviewed when a contract changes.

<details>
<summary>Answer key</summary>

1. No. Parsing only proves the text follows JSON syntax; schema and domain rules determine whether the document is a meaningful supported plan.
2. Validation checks the document and rules before running it. Execution performs the actions described by an accepted plan.
3. Plans and results have different producers, consumers, and rates of change; versioning them separately avoids coupling their compatibility decisions.
4. Reject it clearly rather than silently interpreting or dropping instructions.
5. Examples include valid/invalid fixtures, the runner, editor, result/report consumers, documentation, and migration behaviour.

</details>
