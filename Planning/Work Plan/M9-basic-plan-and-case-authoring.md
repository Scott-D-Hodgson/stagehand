# M9 — Basic plan and case authoring

**Status:** In progress; Navigate-, Click-, Type-, Fill-, and Select-option-step authoring slices complete
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md)

## Objective

Enable controlled creation and editing of basic plans, case references, cases, and ordered action/assertion steps.

## Tasks

- [x] Associate each referenced case with an in-memory version 1 case document and allow its identifier to be edited independently of its path.
- [x] Add, edit, and remove plan case references while preserving the rest of the draft; require confirmation before removal and prevent duplicate entered paths.
- [x] Create a fresh empty plan with an author-supplied identifier, default locale, and no references; confirm replacement when the active bundle has changes.
- [x] Provide a recoverable, shared-contract-validated Navigate step with a dialog-based Add/Edit flow.
- [x] Provide a recoverable, shared-contract-validated Click step with a constrained Role/Accessible-name locator form and Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Type step with constrained Role/Accessible-name locator and literal-text forms, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Fill step with constrained Role/Accessible-name locator and literal-value forms, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Select option step with a constrained Role/Accessible-name locator and exactly one literal Value or Label, plus Add/Edit/Clone/Remove flows.
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
The owner later reported that the development-container test, type-check, and
production-build commands passed for the New plan and Navigate work.

The completed Navigate slice presents ordered steps as numbered Bootstrap cards
with action, URL, Edit, and Remove controls. Add and Edit use a shared dialog
that explains the absolute HTTP/HTTPS URL requirement. Contract feedback stays
hidden until the URL field blurs, but Save blocks an invalid URL and reveals its
feedback. The owner manually confirmed Add, Edit, Remove, card presentation,
dialog validation, local save, refresh, and recovery restore for a Navigate
step.

The completed Click slice adds a step-type chooser and a Click card that shows
its Role and optional Accessible name. Add, Edit, and Clone open the same
Role/Accessible-name dialog. Role is required and receives one focused,
localized author-facing message after blur or an attempted save; the full
schema remains the validation boundary for saved case content. Click locator
data is copied into a plain recovery snapshot so IndexedDB receives no Vue
reactive values. Step removal now uses the shared Bootstrap confirmation
dialog.

All editor dialogs now use Bootstrap lifecycle events: their first actionable
control receives focus after opening, they retain a static backdrop, and Vue
removes them only after Bootstrap has completed its hide transition. This
prevents close-induced validation feedback and stranded page scroll locks.
The owner reported 32 passing web-editor tests, a passing type check and
production build in the development container, and manual verification of
Click authoring, recovery, dialog focus, validation, cancellation, backdrop,
and scroll behaviour.

The completed Type slice extends the chooser and numbered cards with a Type
action. Its dialog uses the existing constrained Role/Accessible-name locator
form and a required literal Text field. Role and Text feedback are independently
hidden until their field blurs or the author attempts a save. Variable-backed
text remains deferred with variables to M12. Type steps use the existing plain
snapshot boundary, and focused tests cover both detached nested data and
autosave. The owner reported passing web-editor tests, type check, production
build, and manual Type-step/recovery verification in the development container.

The completed Fill slice adds a Fill action with the same constrained locator
form and a required literal Value field. Role and Value feedback are independently
blur-gated. Variable-backed values remain deferred with variables to M12. Click,
Type, and Fill now share one locator-fields component, while their action-specific
fields and validation remain in their own dialogs. Focused recovery tests cover
detached Fill-step copying and autosave. The owner reported passing web-editor
tests, type check, production build, and manual Fill-step/recovery verification
in the development container.

The completed Select option slice adds a Select option action with the same
constrained locator form and a deliberate By value or By label choice. The
dialog saves exactly one required literal field, so its saved shape cannot
contain both `value` and `label`. Each selected field has independently
blur-gated feedback. Variable-backed selections remain deferred with variables
to M12. Focused tests protect detached Label-based copying and Value-based
autosave. The owner reported passing web-editor tests, type check, production
build, and manual Select-option/recovery verification in the development
container.

## Deliverables and completion evidence

A user creates a small plan and case, adds navigation and an assertion, reorders steps, sees actionable validation errors, and recovers edits after reopening.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested remaining PR slices: assertion forms and step ordering.

## Open decisions and exclusions

Advanced browser/run settings and localized assertion overrides belong to M11; variables and shared steps belong to M12. Resolve identifier generation and reference-update interactions before implementing them.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
