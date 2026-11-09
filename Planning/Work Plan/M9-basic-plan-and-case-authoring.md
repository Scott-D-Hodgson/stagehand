# M9 — Basic plan and case authoring

**Status:** In progress; new-plan creation implemented, automated verification pending
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md)

## Objective

Enable controlled creation and editing of basic plans, case references, cases, and ordered action/assertion steps.

## Tasks

- [x] Associate each referenced case with an in-memory version 1 case document and allow its identifier to be edited independently of its path.
- [x] Add, edit, and remove plan case references while preserving the rest of the draft; require confirmation before removal and prevent duplicate entered paths.
- [x] Create a fresh empty plan with an author-supplied identifier, default locale, and no references; confirm replacement when the active bundle has changes.
- [ ] Reorder case references and steps; explain missing or duplicate references.
- [ ] Provide forms for the implemented action vocabulary, locators, required literal inputs, and basic default expected assertion values.
- [ ] Reuse shared validation and map errors to the selected case and step.
- [ ] Extend recovery and conflict comparison to all newly editable data; confirm destructive changes as they are introduced.
- [ ] Keep new UI text in Canadian English/French resources and verify keyboard operation.

## Current implementation evidence

The completed slice adds immutable plan/case bundle drafts. Existing recovery
records that stored only the plan are migrated on load: their reference paths
are retained and receive empty version 1 case documents with filename-derived
IDs. The editor presents references in the Plan details card; selecting a path
opens Case details, where its ID can change independently. Add and Edit share a
Bootstrap dialog with a filename-safe `cases/*.json` suggestion, while removal
and reset use Bootstrap confirmation dialogs. Canadian English and French
resources cover the new wording.

Focused checks cover bundle copying, legacy recovery migration, and case-ID
autosave. The owner reported that the development-container test, type-check,
and production-build commands passed. The forwarded-browser checks confirmed
case-ID recovery after refresh and restore, two-tab conflict resolution, and
reference selection. The fixed status footer can cover Reset controls on a long
page; its placement is an accepted follow-up for a later M9 UI slice.

The current follow-up adds a sticky plan-action bar containing New plan and
Reset sample. New plan collects a filename-safe identifier in a Bootstrap
dialog, replaces the active bundle only after confirmation when needed, and
retains the current IndexedDB revision so its first autosave does not create a
false multi-tab conflict. The owner manually confirmed that correction.
Focused automated verification for this follow-up remains pending.

## Deliverables and completion evidence

A user creates a small plan and case, adds navigation and an assertion, reorders steps, sees actionable validation errors, and recovers edits after reopening.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested remaining PR slices: interaction forms; assertion forms and step ordering.

## Open decisions and exclusions

Advanced browser/run settings and localized assertion overrides belong to M11; variables and shared steps belong to M12. Resolve identifier generation and reference-update interactions before implementing them.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
