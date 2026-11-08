# M9 — Basic plan and case authoring

**Status:** In progress; first case-reference authoring slice implemented, pending verification
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md)

## Objective

Enable controlled creation and editing of basic plans, case references, cases, and ordered action/assertion steps.

## Tasks

- [ ] Create new plans and cases with clear identifier handling; preserve version 1 contract rules.
- [ ] Verify add, edit, and removal of plan case references while preserving the rest of the draft; require confirmation before removal and prevent duplicate entered paths.
- [ ] Reorder case references and steps; explain missing or duplicate references.
- [ ] Provide forms for the implemented action vocabulary, locators, required literal inputs, and basic default expected assertion values.
- [ ] Reuse shared validation and map errors to the selected case and step.
- [ ] Extend recovery and conflict comparison to all newly editable data; confirm destructive changes as they are introduced.
- [ ] Keep new UI text in Canadian English/French resources and verify keyboard operation.

## Current implementation evidence

The first M9 slice adds immutable draft helpers for adding, changing, and
removing a case-reference path. The editor presents existing references as
read-only values with Edit and Remove controls. Add and Edit share a Bootstrap
dialog that suggests a filename-safe `cases/*.json` path from the entered case
name; the reference path remains independently editable. A Bootstrap
confirmation dialog protects removal and sample reset. Canadian English and
French resources include the new interface text.

Focused plan-draft tests cover add, change, and remove operations without
mutating the source draft. Verification of the completed UI workflow, keyboard
operation, and updated automated checks remains pending for this PR.

## Deliverables and completion evidence

A user creates a small plan and case, adds navigation and an assertion, reorders steps, sees actionable validation errors, and recovers edits after reopening.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested remaining PR slices: plan/case creation; interaction forms; assertion forms and step ordering.

## Open decisions and exclusions

Advanced browser/run settings and localized assertion overrides belong to M11; variables and shared steps belong to M12. Resolve identifier generation and reference-update interactions before implementing them.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
