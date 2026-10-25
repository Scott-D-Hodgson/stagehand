# M3 — Versioned plan and result contracts

**Estimate:** 4–6 person-days (initial range; revisit before implementation once the contract and fixture scope are settled)
**Depends on:** M1  
**Roadmap item:** Versioned test-plan and result schemas

## Tasks

- [ ] Review [TE-001](../Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), [ATR-001](../Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md), and [ADR-003](../Backlog/decisions/ADR-003-versioned-plan-contract.md).
- [ ] Define the versioning policy and implementation arrangement for the accepted shared plan JSON Schema; select the JSON Schema draft and distinguish its `$schema` dialect URI from Stagehand's plan/result contract versions. Ensure the Vue editor and Node runner consume the same plan document and produce useful errors. Use a versioned JSON Schema as the normative validation contract for emitted result JSON, owned alongside the result model; define how any TypeScript representation is kept aligned with it.
- [ ] Define the plan envelope, metadata, explicit schema version, configuration sections, stable plan/case identifiers and their uniqueness scopes, and unsupported-version behaviour. Case IDs are unique within one plan; the plan ID identifies that plan, with no global uniqueness guarantee imposed by the contract.
- [ ] Define external case references as portable relative paths resolved from the plan file's directory. Reject absolute references and any reference that resolves outside that directory. Resolve shortcuts/symlinks/junctions/reparse points before checking containment; follow them only when their canonical target remains inside the canonical plan directory. The browser editor uses folder import to preserve relative paths when matching files to references. Unresolved or duplicate references make a plan invalid, though the editor may save it as a draft. Specify path normalization, validation, plan/case version compatibility, and safe failure before browser startup.
- [ ] Define the independent result contract and its version, run/case outcomes (`passed`, `failed`, `cancelled`, `error`; no `skipped` unless MVP supports deliberate omission), diagnostics, and source-plan identity using the stable plan ID and plan schema version plus a content fingerprint of the exact source inputs used for the run. Do not use machine-specific paths as identity. Define whether the fingerprint hashes raw bytes or canonicalized JSON; whether normalized relative paths and case-reference order are included; how inputs are unambiguously framed; and how the fingerprint algorithm/version is identified in the contract. M6 owns status mapping and run/case aggregation policy.
- [ ] Define result fields for run/case/step timing, cancellation, accessibility findings, and future artifact references. Encode timestamps as RFC 3339 UTC strings and durations as integer milliseconds; M6 distinguishes whole-run elapsed time from active-case timing and defines what each includes. M4 owns accessibility configuration and scan behaviour. Defer output-format conversion and Azure DevOps mapping to later backlog work.
- [ ] Specify which constraints are schema-level and which require semantic validation, including uniqueness and external-reference rules.
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
