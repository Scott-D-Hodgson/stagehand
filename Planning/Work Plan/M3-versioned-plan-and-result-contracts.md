# M3 — Versioned plan and result contracts

**Depends on:** M1  
**Roadmap item:** Versioned test-plan and result schemas

## Tasks

- [x] Review [TE-001](../Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), [ATR-001](../Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md), and [ADR-003](../Backlog/decisions/ADR-003-versioned-plan-contract.md).
- [x] Define the versioning policy and implementation arrangement for the accepted shared schemas.
  - [x] Select JSON Schema Draft 2020-12 and distinguish its `$schema` dialect URI from Stagehand contract versions.
  - [x] Use independent integer `schemaVersion` fields for plan and case documents, each initially `1`.
  - [x] Keep JSON Schema documents as JSON data and use TypeScript for package implementation code.
  - [x] Add initial synchronous `validatePlan` and `validateCase` helpers to `@stagehand/plan-schema`, using Ajv's Draft 2020-12 validator and returning structured issues for invalid input. Node's built-in tests verify valid examples, invalid inputs, non-throwing results, and imports through the public package entry point; M4/M5 own fixtures for action and data semantics.
  - [x] Use a versioned JSON Schema as the normative validation contract for emitted result JSON.
  - [x] Support plan v1 with case v1 initially. Reject unsupported versions; do not coerce or silently migrate documents. Defer migration tooling until another contract version is proposed.
  - [x] Define the shared `plan-schema` package as the source used by Node and browser consumers. The Node loader consumes it; connecting the Vue editor and checking its error presentation are deferred until editor implementation.
  - [x] Define how the result-model TypeScript representation stays aligned with its normative JSON Schema: export the schema and types from one public entry point, and test valid/invalid values against the schema through that entry point.
- [x] Define the initial plan and case envelopes, configuration sections, identifier scope, and unsupported-version behaviour. Plan IDs identify the logical plan and remain stable through edits; the source fingerprint distinguishes exact revisions. Case IDs are unique within a plan, while plan IDs have no global uniqueness guarantee. Plan defaults are inherited by cases where applicable; case viewport, time-zone, and accessibility settings may override plan values, while headless mode and locale are run-wide. Explicit CLI settings are the ultimate override at their targeted scope. Browser time zone is separate from locale. Whether a copied or forked plan receives a new ID is an authoring-workflow detail for the editor milestone.
- [x] Implement external case-reference validation and loading in the shared package and Node loader.
  - [x] Record the path rules in [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md): references use `/` relative to the plan file; absolute paths and backslashes are rejected; matching is case-sensitive; `.` segments and repeated `/` are normalized; `..` is resolved after following any preceding link and is allowed only while the canonical path stays inside the plan directory; duplicate detection uses normalized paths.
  - [x] Assign matching to shared `plan-schema` logic: normalize references and match against supplied relative file paths before reading file contents. Unreferenced imported files do not affect plan validity and are not parsed.
  - [x] Assign file reads, JSON parsing, and canonical filesystem/link containment to the Node-side loader. It resolves the original plan reference for the containment check and reads the checked target; the lexically normalized matcher key is only for logical matching. It reads only matched files. The planned editor folder-import flow must preserve relative paths and use the shared matcher; invalid plans may be saved as drafts. Both flows must keep parsed cases associated with matcher results and pass them to `validatePlanBundle` in plan-reference order so issues map to the right reference.
  - [x] Implement the shared relative-path matcher and tests for normalization, missing/duplicate/ambiguous matches, case sensitivity, plan-directory escapes, ignored unreferenced files, and partial matches when a reference is missing.
  - [x] Implement shared validation for parsed case schemas and case-ID uniqueness across a matched plan bundle, with tests for valid bundles, invalid case schemas, duplicate IDs, and reference/case count mismatches. The package build and all 17 tests pass in the dev container.
  - [x] Implement Node-side matched-file reading, JSON parsing, and failures for malformed, missing, unreadable, non-file, and outside-folder case references. Resolve the original plan reference one segment at a time, following links before later `..` segments, and read the final canonical target checked; keep every parsed case associated with its matcher result. Check reference capitalization against on-disk names on every platform. All 14 loader tests passed in the Linux dev container after the cross-platform path-resolution fix, and the PR was merged.
- [x] Define the independent result contract and its version, run/case outcomes (`passed`, `failed`, `cancelled`, `error`; no `skipped` unless MVP supports deliberate omission), diagnostics, and source-plan identity using the stable plan ID and plan schema version plus a content fingerprint of the exact source inputs used for the run. Do not use machine-specific paths as identity. The fingerprint recipe is decided: `sha256-v1` hashes raw plan bytes first, followed by raw case bytes in plan-reference order; each record's label/path and content byte sequences have unsigned 64-bit big-endian byte-length prefixes; the plan uses the fixed label `plan`, and cases use normalized plan-relative paths with `/` separators; encode the digest as lowercase hexadecimal. M6 owns status mapping and run/case aggregation policy.
  - [x] Add the initial result v1 JSON Schema and synthetic example to `@stagehand/result-model`.
  - [x] Add the TypeScript public entry point, result types, and `validateResult` runtime API. Public-entry tests cover the synthetic example, invalid schema version/fingerprint/timestamps/extra properties, and non-object input. All 8 package tests passed in the dev container. The validator checks shape and field formats; it does not calculate fingerprints or implement M6 aggregation policy.
  - [x] Implement `sha256-v1` fingerprint calculation in the Node-side plan-engine loader from the raw plan bytes and referenced case bytes, using normalized case labels and plan order. Return the fingerprint on successful load; tests include a fixed digest, repeatability, raw-byte sensitivity, and reference order.
  - [x] Run `npm test --workspace @stagehand/plan-engine` in the dev container; the build succeeded and all 17 tests passed, including the fingerprint tests.
  - [x] Verify the fingerprint tests on Windows CI in the PR; the Windows job passed.
- [x] Define result fields for run/case/step timing, cancellation, accessibility findings, non-secret effective settings, and optional artifact references in the result v1 JSON Schema. Encode timestamps as RFC 3339 UTC strings and durations as integer milliseconds; M6 distinguishes whole-run elapsed time from active-case timing and defines what each includes. M4 owns accessibility configuration and scan behaviour. Defer output-format conversion and Azure DevOps mapping to later backlog work.
- [x] Decide the initial validation boundary: JSON document shape is checked by the existing plan/case schema validators; shared `plan-schema` logic matches normalized paths before file reads, then validates parsed case schemas and case-ID uniqueness; file reads and canonical filesystem containment belong to Node-side loading.
- [x] Add representative M3 fixtures for malformed input, missing fields and wrong types, unsupported plan/case/result versions, case references, path/link safety, duplicate IDs, result-schema violations, and fingerprint repeatability/order/byte sensitivity. M4/M5 add fixtures for action shapes and data semantics.
- [x] Document initial compatibility principles: accept only v1 plan and case documents, reject unsupported versions, never silently drop instructions, and defer migration tooling until a later version is proposed.

## Deferred follow-through outside M3

- Connect Vue editor folder-import entries to the shared matcher in the editor implementation work; the decision to preserve relative paths and use shared matching is already recorded above.
- Verify that the runner validates the plan and all referenced cases before browser launch, with actionable diagnostics, during [M7 integration and Phase 1 review](M7-integration-and-phase-1-review.md). `runner-core` can launch Chromium, create case sessions, resolve case-session locators, run ordered waits, and dispatch validated `navigate` and `click` steps when supplied by a caller. No plan-driven orchestration yet connects `loadPlanFile` to `startBrowserRun`, so callers can still start a browser without loading or validating a plan.

## Contract and policy ownership across M3–M6

Keep the serialized contract separate from the rules that produce its values:

| Milestone | Owns | Leaves to another milestone |
|---|---|---|
| M3 — Plan and result contracts | Versioned plan/result shapes, fields, identifiers, validation layers, and compatibility rules; case IDs are unique within a plan, and the result JSON Schema is normative for emitted JSON. | M4 owns browser/action and accessibility configuration behaviour; M5 owns data/reuse semantics; M6 owns execution outcomes, status mapping, aggregation, and timing accounting. |
| M4 — Browser actions and assertions | Browser/action/assertion settings and local execution semantics; accessibility scan configuration, cadence, and finding collection. | M6 decides how assertion outcomes, accessibility failure settings, and execution errors affect case/run status and continuation. |
| M5 — Data and reuse | Variable, data-set, shared-step, and loop structures and behaviour, including their identity in diagnostics/results. | M6 decides how failures or cancellation in these operations affect status and run aggregation. |
| M6 — Errors and execution policies | Error/cleanup/cancellation/timeout policy, status mapping and aggregation, CLI signalling, and preservation of primary and secondary causes. | M3 defines the result fields used to record these outcomes; M4/M5 define the relevant plan constructs and local behaviour. |

M3 may establish outcome names and the fields needed to represent them, but it does not decide which combination of case outcomes produces a particular run outcome. Keep those examples and rules in M6.

## Completion evidence

- Versioned plan and result contracts are checked into their intended package/documentation locations, and emitted results validate against the normative result JSON Schema.
- Examples and fixtures demonstrate the accepted shape and key rejection cases.
- The M3 result contract defines fields and outcome vocabulary; M6 documents and demonstrates their execution semantics and aggregation.
- Validation behaviour is documented; runner integration must call it before browser launch when that execution path is implemented.
- Contract decisions and future compatibility policy are reviewed.

## Learning reference

[Versioned test-plan and result schemas](../../Learning%20Plan/Phase%201/03-versioned-test-plan-and-result-schemas.md)
