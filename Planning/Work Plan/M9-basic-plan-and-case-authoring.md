# M9 — Basic plan and case authoring

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md)

## Objective

Enable controlled creation and editing of basic plans, case references, cases, and ordered action/assertion steps.

## Tasks

- [ ] Create new plans and cases with clear identifier handling; preserve version 1 contract rules.
- [ ] Add, remove, and reorder case references and steps; explain missing or duplicate references.
- [ ] Provide forms for the implemented action vocabulary, locators, required literal inputs, and basic default expected assertion values.
- [ ] Reuse shared validation and map errors to the selected case and step.
- [ ] Extend recovery and conflict comparison to all newly editable data; confirm destructive changes as they are introduced.
- [ ] Keep new UI text in Canadian English/French resources and verify keyboard operation.

## Deliverables and completion evidence

A user creates a small plan and case, adds navigation and an assertion, reorders steps, sees actionable validation errors, and recovers edits after reopening.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: plan/case creation and references; interaction forms; assertion forms and step ordering.

## Open decisions and exclusions

Advanced browser/run settings and localized assertion overrides belong to M11; variables and shared steps belong to M12. Resolve identifier generation and reference-update interactions before implementing them.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
