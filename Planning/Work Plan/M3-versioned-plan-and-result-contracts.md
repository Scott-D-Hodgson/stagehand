# M3 — Versioned plan and result contracts

**Estimate:** 4–6 person-days  
**Depends on:** M1  
**Roadmap item:** Versioned test-plan and result schemas

## Tasks

- [ ] Review [TE-001](../Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), [ATR-001](../Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../Backlog/epics/E01-plan-definition/stories/ATR-002.md), and [ADR-003](../Backlog/decisions/ADR-003-versioned-plan-contract.md).
- [ ] Define the versioning policy and implementation arrangement for the accepted shared plan JSON Schema; ensure the Vue editor and Node runner consume the same document and produce useful errors. Decide separately whether result JSON also needs a formal JSON Schema document.
- [ ] Define the plan envelope, metadata, explicit schema version, configuration sections, stable identifiers, and unsupported-version behaviour.
- [ ] Define how a plan JSON references external case JSON files, including path resolution, validation, version compatibility, editor import/edit behaviour, and safe failure before browser startup.
- [ ] Define the independent result contract and its version, run/case outcomes (`passed`, `failed`, `cancelled`, `error`; no `skipped` unless MVP supports deliberate omission), aggregation rules, diagnostics, and source-plan identity.
- [ ] Include run/case/step elapsed durations, cancellation outcome, accessibility findings/failure policy, and fields reserved for future artifact references. Defer output-format conversion and Azure DevOps mapping to later backlog work.
- [ ] Specify which constraints are schema-level and which require semantic validation.
- [ ] Add representative valid and invalid fixtures, including malformed input, missing fields, wrong types, unknown instructions, and unsupported versions.
- [ ] Ensure validation happens before browser launch and errors identify the failing location and expected correction where feasible.
- [ ] Document compatibility and migration principles; do not silently drop unsupported instructions.

## Completion evidence

- Versioned plan and result contracts are checked into their intended package/documentation locations.
- Examples and fixtures demonstrate the accepted shape and key rejection cases.
- Validation behaviour is documented and an unsupported plan cannot proceed to execution.
- Contract decisions and future compatibility policy are reviewed.

## Learning reference

[Versioned test-plan and result schemas](../../Learning%20Plan/Phase%201/03-versioned-test-plan-and-result-schemas.md)
