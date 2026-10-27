# M3 — Versioned plan and result contracts

**Estimate:** 4–6 person-days (initial range; revisit before implementation once the contract and fixture scope are settled)
**Depends on:** M1  
**Roadmap item:** Versioned test-plan and result schemas

## Tasks

- [ ] Review [TE-001](../Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), [ATR-001](../Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md), and [ADR-003](../Backlog/decisions/ADR-003-versioned-plan-contract.md).
- [ ] Define the versioning policy and implementation arrangement for the accepted shared schemas.
  - [x] Select JSON Schema Draft 2020-12 and distinguish its `$schema` dialect URI from Stagehand contract versions.
  - [x] Use independent integer `schemaVersion` fields for plan and case documents, each initially `1`.
  - [x] Keep JSON Schema documents as JSON data and use TypeScript for package implementation code.
  - [x] Add initial synchronous `validatePlan` and `validateCase` helpers to `@stagehand/plan-schema`, using Ajv's Draft 2020-12 validator and returning structured issues for invalid input. Node's built-in tests verify valid examples, invalid inputs, non-throwing results, and imports through the public package entry point; the broader semantic fixture matrix remains outstanding.
  - [x] Use a versioned JSON Schema as the normative validation contract for emitted result JSON.
  - [ ] Define compatibility and migration policy beyond the initial plan-v1/case-v1 pairing.
  - [ ] Ensure the Vue editor and Node runner consume the same plan schema and produce useful errors.
  - [ ] Define how the result-model TypeScript representation stays aligned with its normative JSON Schema.
- [ ] Define the plan envelope, metadata, configuration sections, stable identifiers, uniqueness scopes, and unsupported-version behaviour. Initial envelopes use an `id` field; case IDs are unique within one plan, while plan IDs have no global uniqueness guarantee. Plan defaults are inherited by cases; case browser/accessibility settings override them; explicit CLI settings are the ultimate override. Locale is per run, and browser time zone is separate. Remaining metadata, ID stability when editing/copying, and unsupported-version behaviour need definition.
- [ ] Implement external case-reference validation and loading.
  - [x] Record the path rules in [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md): references use `/` relative to the plan file; absolute paths and backslashes are rejected; matching is case-sensitive; `.` segments and repeated `/` are normalized; `..` is allowed only when canonical resolution stays inside the plan directory; duplicate detection uses normalized paths; and links are followed only when their canonical targets stay inside.
  - [x] Assign matching to shared `plan-schema` logic: normalize references and match against supplied relative file paths before reading file contents. Unreferenced imported files do not affect plan validity and are not parsed.
  - [x] Assign file reads, JSON parsing, and canonical filesystem/link containment to the Node-side loader. It resolves the original plan reference for the containment check and reads the checked target; the lexically normalized matcher key is only for logical matching. It reads only matched files. The editor preserves relative paths through folder import and reads only matched files. Both flows keep parsed cases associated with matcher results and pass them to `validatePlanBundle` in plan-reference order so issues map to the right reference; invalid plans may be saved as drafts.
  - [x] Implement the shared relative-path matcher and tests for normalization, missing/duplicate/ambiguous matches, case sensitivity, plan-directory escapes, ignored unreferenced files, and partial matches when a reference is missing.
  - [x] Implement shared validation for parsed case schemas and case-ID uniqueness across a matched plan bundle, with tests for valid bundles, invalid case schemas, duplicate IDs, and reference/case count mismatches. The package build and all 17 tests pass in the dev container.
  - [ ] Implement Node-side matched-file reading, JSON parsing, canonical containment based on the original plan reference, and safe errors before browser startup.
  - [ ] Connect editor folder-import entries to the shared matcher when editor implementation begins.
- [ ] Define the independent result contract and its version, run/case outcomes (`passed`, `failed`, `cancelled`, `error`; no `skipped` unless MVP supports deliberate omission), diagnostics, and source-plan identity using the stable plan ID and plan schema version plus a content fingerprint of the exact source inputs used for the run. Do not use machine-specific paths as identity. Define whether the fingerprint hashes raw bytes or canonicalized JSON; whether normalized relative paths and case-reference order are included; how inputs are unambiguously framed; and how the fingerprint algorithm/version is identified in the contract. M6 owns status mapping and run/case aggregation policy.
- [ ] Define result fields for run/case/step timing, cancellation, accessibility findings, and future artifact references. Encode timestamps as RFC 3339 UTC strings and durations as integer milliseconds; M6 distinguishes whole-run elapsed time from active-case timing and defines what each includes. M4 owns accessibility configuration and scan behaviour. Defer output-format conversion and Azure DevOps mapping to later backlog work.
- [x] Decide the initial validation boundary: JSON document shape is checked by the existing plan/case schema validators; shared `plan-schema` logic matches normalized paths before file reads, then validates parsed case schemas and case-ID uniqueness; file reads and canonical filesystem containment belong to Node-side loading.
- [ ] Add representative valid and invalid plan and result fixtures, including malformed input, missing fields, wrong types, unknown instructions, unsupported plan/result versions, absolute and escaping case references, link/junction targets inside and outside the plan directory, missing/duplicate references, incompatible plan/case versions, duplicate identifiers, semantic validation failures, and result JSON Schema violations. Verify identical-source inputs produce the same fingerprint across supported OSes and changed source contents produce a different fingerprint; cover the selected path/order inclusion and framing rules.
- [ ] Ensure validation happens before browser launch and errors identify the failing location and expected correction where feasible.
- [ ] Document compatibility and migration principles; do not silently drop unsupported instructions.
- [ ] Revisit the initial 4–6 person-day estimate before implementation after finalizing schema, path-containment, fingerprint, and fixture scope.

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
- Validation behaviour is documented and an unsupported plan cannot proceed to execution.
- Contract decisions and future compatibility policy are reviewed.

## Learning reference

[Versioned test-plan and result schemas](../../Learning%20Plan/Phase%201/03-versioned-test-plan-and-result-schemas.md)
