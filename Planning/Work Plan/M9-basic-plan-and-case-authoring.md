# M9 — Basic plan and case authoring

**Status:** Complete; basic plan and case authoring, recovery/conflict handling, and integration review complete
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md)

## Objective

Enable controlled creation and editing of basic plans, case references, cases, and ordered action/assertion steps.

## Tasks completed

- [x] Associate each referenced case with an in-memory version 1 case document and allow its identifier to be edited independently of its path.
- [x] Add, edit, and remove plan case references while preserving the rest of the draft; require confirmation before removal and prevent duplicate entered paths.
- [x] Create a fresh empty plan with an author-supplied identifier, default locale, and no references; confirm replacement when the active bundle has changes.
- [x] Provide a recoverable, shared-contract-validated Navigate step with a dialog-based Add/Edit flow.
- [x] Provide a recoverable, shared-contract-validated Click step with a constrained Role/Accessible-name locator form and Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Type step with constrained Role/Accessible-name locator and literal-text forms, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Fill step with constrained Role/Accessible-name locator and literal-value forms, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Select option step with a constrained Role/Accessible-name locator and exactly one literal Value or Label, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Assert text step with a constrained Role/Accessible-name locator and a literal default expected value, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Assert HTML step with a constrained Role/Accessible-name locator and a literal default expected value, plus Add/Edit/Clone/Remove flows.
- [x] Provide a recoverable, shared-contract-validated Assert value step with a constrained Role/Accessible-name locator and a literal default expected value, plus Add/Edit/Clone/Remove flows.
- [x] Reorder authored case steps with localized adjacent-move controls while preserving recovery behaviour.
- [x] Reorder case references with localized adjacent-move controls while preserving recovery behaviour.
- [x] Provide forms for the implemented action vocabulary, locators, required literal inputs, and basic default expected assertion values.
- [x] Reuse shared validation and map errors to the selected case and step.
- [x] Extend recovery and conflict comparison to all newly editable data; confirm destructive changes as they are introduced.
- [x] Keep new UI text in Canadian English/French resources and verify keyboard operation.

## Decisions made

- Basic case authoring stays in memory until M10 adds local import and export;
  it does not access the local filesystem directly.
- The supported M9 action vocabulary is Navigate, Click, Type, Fill, Select
  option, Assert text, Assert HTML, and Assert value with constrained
  Role/Accessible-name locators and literal values.
- IndexedDB recovery and two-tab revision conflicts protect every M9 editable
  value. A conflict now requires a centred static modal choice to discard the
  paused local edits or replace the newer saved draft.
- The fixed status footer was reviewed with long content and does not obscure an
  actionable control in the accepted M9 layout.

## Deferred work

- Explain references that lack case data after local-file import in M10; M9 has
  no import workflow from which such references can arise.
- The optional Assert value associated-label form requires a later focused scope
  decision.
- Apply the selected-step validation pattern to later authoring forms as those
  forms are introduced in their own milestones.
- Reassess footer placement if a later page design introduces an overlap.

## Completion evidence

The owner completed an integrated browser walkthrough using a fresh
`m9-integration` plan: case references and independent case IDs; every M9 step
form; editing, cloning, reordering, and removal; localized expected-value
overrides and fallback; English/French interface wording; Light/Dark/System
themes; recovery; reset; keyboard dialog operation; and both two-tab conflict
resolutions. The walkthrough found that an inline conflict warning could be
missed below the fold. The corrected blocking conflict-resolution modal was
then verified, including static backdrop, Escape suppression, initial focus,
resolution, and normal scrolling after close. The fixed footer was also
verified not to overlap an actionable control.

The owner reported that the development-container test, type-check, and
production-build commands passed for the completed integration review.

## Learning plan reference

The [web editor course](../../Learning%20Plan/Apps/web/README.md) documents
the current editor boundary and the M9 integration-review workflow.

## Supporting detail

### Current implementation evidence

The completed slice adds immutable plan/case bundle drafts. Existing recovery
records that stored only the plan are migrated on load: their reference paths
are retained and receive empty version 1 case documents with filename-derived
IDs. The editor presents references as cards in Plan details. One card can be
expanded at a time to show its Case ID, ordered steps, validation, and step
authoring controls; collapsed cards show a localized step count. Add and Edit
share a Bootstrap dialog with a filename-safe `cases/*.json` suggestion, while
removal and reset use Bootstrap confirmation dialogs. Canadian English and
French resources cover the new wording.

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

The completed Assert text slice adds an Assert text action with the same
constrained locator form and one required literal default expected value. Role
and Expected text feedback are independently blur-gated. An early M11 slice
now adds localized Assert-text expected values through the card-level Locale
overrides panel. Focused tests protect detached expected-value copying and
autosave. The owner reported that the development-container tests,
type check, production build, and manual Assert-text/recovery verification all
passed.

The completed Assert HTML slice follows the same constrained locator and
literal default expected-value boundary. It uses a multiline Expected HTML
field, while retaining independently blur-gated Role and expected-value
feedback. An early M11 slice now provides localized expected values for Assert
HTML. Focused tests
protect detached expected-HTML copying and autosave. The owner reported that
the development-container tests, type check, production build, and manual
Assert-HTML/recovery verification all passed.

The completed Assert value slice adds a literal default expected value with the
same constrained locator form and independently blur-gated feedback. Its
optional associated-label contract check is deliberately not authorable yet;
that conditional form needs its own design decision. An early M11 slice now
provides localized expected values for Assert value. Focused tests protect
detached expected-value copying and autosave. The owner reported that the development-container tests, type
check, production build, and manual Assert-value/recovery verification all
passed.

The completed step-reordering slice adds localized Move up and Move down
controls to the ordered case-step cards. Boundary controls are disabled, and
Vue animates the affected cards into their exchanged positions. Reordering
copies the step list rather than mutating its source, so it continues through
the existing recovery and conflict-comparison path. A focused unit test covers
valid and invalid list moves. The owner reported that the development-container
tests, type check, production build, and manual animated-reordering and
recovery verification all passed.

The completed case-reference-workspace slice makes each reference-card header
the accessible expand/collapse control for its case workspace. Adjacent case
reference moves use an immutable plan helper and animate the cards into their
new order. The expanded card has theme-aware active styling; action controls
do not change its expanded state. The application header remains first in the
sticky context, and the Plan ID remains inside the Plan details card. Visible
ID and BCP abbreviations use localized `abbr` expansions. The owner reported
that the development-container tests, type check, production build, light/dark
manual checks, expansion/collapse, reordering, recovery, and action-control
behaviour all passed.

The completed selected-step-validation slice reuses the shared case validator
and extracts the unique authored step indexes from its issue paths. An expanded
case presents a concise localized count and marks each affected step card with
an actionable localized message rather than exposing every failed `oneOf`
branch. Its enclosing case-reference card receives a red border even while
collapsed, so an author can find a case requiring attention before opening it.
Focused tests cover the index mapping and localized zero, one, and many
messages. The owner reported that the development-container tests, type check,
production build, and manual invalid-draft verification all passed.

Historical estimate: 6–10 focused human person-days. It remains the original
planning range, not a record of actual effort.
