# M3 — Versioned plan and result contracts

**Status:** Complete
**Original estimate:** Not retained (not actual effort)
**Depends on:** M1

## Objective

Established versioned plan, case, and result contracts with shared validation, safe Node-side loading, and reproducible source identity.

## Tasks completed

- Implemented synchronous public plan/case validators, examples, unsupported-version rejection, and structured issues.
- Implemented shared path matching and parsed-bundle validation, including duplicate IDs and reference ordering.
- Implemented Node-side matched-file loading, case-sensitive path checks, canonical link containment, and malformed/unreadable input diagnostics.
- Implemented the normative result JSON Schema, TypeScript types, runtime validation, synthetic example, and `sha256-v1` fingerprint calculation.

## Decisions made

- Used JSON Schema Draft 2020-12 with independent integer document versions, initially `1`; unsupported versions are rejected without silent migration.
- Kept plan IDs stable through edits, case IDs unique within a plan, and exact source revision identity in a raw-byte fingerprint rather than machine paths.
- Assigned portable reference matching and parsed validation to plan-schema, filesystem reads/containment and fingerprints to plan-engine, and result shape validation to result-model.
- Selected `passed`, `failed`, `cancelled`, and `error` result vocabulary; M6 owns aggregation and execution policy.

## Deferred work

- Browser editor matching and error presentation now belong to [M10](M10-local-import-and-export.md); copied/forked plan identity remains an authoring-workflow decision.
- M7 demonstrated pre-browser validation hand-offs with mocks. Production plan-file-to-runner orchestration remains Phase 3 work.
- Migration tooling awaits another proposed contract version; format conversion and Azure integration remain later reporting work.

## Completion evidence

- M3 recorded 17 passing plan-schema tests, 17 plan-engine tests including fingerprints, and 8 initial result-model tests in the development container at their respective slices.
- The loader path-resolution correction and fingerprint Windows CI passed as recorded in the milestone history.
- Public-entry fixtures cover invalid versions, references, duplicate IDs, containment, result formats, and fingerprint order/raw-byte sensitivity. M7 later verified the expanded suites together.

## Learning plan reference

[Plan and case contracts](../../Learning%20Plan/Phase%201/Lessons/04-plan-case-contracts.md), [result contracts](../../Learning%20Plan/Phase%201/Lessons/05-result-contracts.md), and [plan loading](../../Learning%20Plan/Phase%201/Lessons/06-plan-loading.md).

## Supporting detail

### Source identity and reference rules

The `sha256-v1` recipe hashes raw plan bytes first and raw case bytes in plan-reference order. Each record's label/path and content have unsigned 64-bit big-endian byte-length prefixes. The plan label is `plan`; case labels are normalized plan-relative paths using `/`. The digest is lowercase hexadecimal. Logical plan ID and exact source fingerprint serve different purposes.

References use case-sensitive portable paths relative to the plan; absolute paths and backslashes are rejected. Shared matching normalizes logical paths, while the Node loader follows links before later `..` segments and enforces canonical containment. Only matched files are read; unreferenced imported files do not affect validity. Parsed cases retain their matcher association and plan-reference order for bundle diagnostics.

### Contract and policy ownership across M3–M6

Keep the serialized contract separate from the rules that produce its values:

| Milestone | Owns | Leaves to another milestone |
|---|---|---|
| M3 — Plan and result contracts | Versioned plan/result shapes, fields, identifiers, validation layers, and compatibility rules; case IDs are unique within a plan, and the result JSON Schema is normative for emitted JSON. | M4 owns browser/action and accessibility configuration behaviour; M5 owns data/reuse semantics; M6 owns execution outcomes, status mapping, aggregation, and timing accounting. |
| M4 — Browser actions and assertions | Browser/action/assertion settings and local execution semantics; accessibility scan configuration, cadence, and finding collection. | M6 decides how assertion outcomes, accessibility failure settings, and execution errors affect case/run status and continuation. |
| M5 — Data and reuse | Variable, data-set, and shared-step structures and behaviour (loops deferred beyond MVP), including their identity in diagnostics/results. | M6 decides how failures or cancellation in these operations affect status and run aggregation. |
| M6 — Errors and execution policies | Error/cleanup/cancellation/timeout policy, status mapping and aggregation, CLI signalling, and preservation of primary and secondary causes. | M3 defines the result fields used to record these outcomes; M4/M5 define the relevant plan constructs and local behaviour. |

M3 may establish outcome names and the fields needed to represent them, but it does not decide which combination of case outcomes produces a particular run outcome. Keep those examples and rules in M6.
