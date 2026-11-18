# M11 — Configuration and localized assertions

**Status:** In progress; browser-configuration and early localized-assertion
slices complete out of sequence
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10](M10-local-import-and-export.md) for the broader milestone; the early localized-assertion slices are accepted exceptions

## Objective

Author supported plan/case configuration and localized assertion values without editing JSON.

## Tasks

- [x] Provide controls for supported browser/run defaults and case overrides, with inherited versus explicit values explained.
- [ ] Cover supported waits, interaction options, and hard/soft assertions; the supported plan, case, and step timeout hierarchy is complete.
- [x] Edit expected-value defaults and locale overrides using shared canonicalization and duplicate-locale validation for Assert text, Assert HTML, and Assert value.
- [x] Keep interface language separate from execution locale and expected-value selection for the implemented localized-assertion slices.
- [ ] Verify the route-oriented responsive authoring presentation: recovery-aware Home, Plan, Case, and Step routes; responsive summary-card grids; editable step detail pages; breadcrumbs; and temporary View/Edit presentation state.
- [ ] Verify recovery and M10 import/export preservation for all implemented configuration; existing draft-copy paths retain the current fields, but cross-flow evidence remains outstanding.
- [ ] Verify invalid settings, inheritance restrictions, locale fallback, and English/French feedback.

## Deliverables and completion evidence

Author and round-trip representative configuration and localized assertions; demonstrate default fallback and rejection of equivalent duplicate locale keys.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Early localized-assertion slices

The owner authorized this focused M11 capability before M10 so that the editor
could explore localized expected values while the authoring surface is small.
Plan Locale and Assert text, Assert HTML, or Assert value override Locale now
use the same reviewed JSON catalogue of 66 canonical locale tags. The catalogue is a
maintained supported set, not an attempt to enumerate every possible BCP 47
tag. A recovered or
imported out-of-catalogue value remains visible as a disabled current option
rather than being silently rewritten.

An Assert text, Assert HTML, or Assert value card keeps its required
`expected.default` value. Its Locale overrides panel lists entries
alphabetically, supports Bootstrap-dialog Add and Edit flows, confirms removal,
and retains values through base-step editing, cloning, autosave, and recovery.
Assert HTML uses a multiline override value field; Assert text and Assert value
use single-line values. The configured Plan Locale previews the value that
would be used at execution: the matching override is primary-coloured, or the
default is primary-coloured when no override matches. A locale pill identifies
an active override without shifting neighbouring content.

Focused tests cover the catalogue's canonical unique entries and recovery-copy
isolation for Assert-text, Assert-HTML, and Assert-value locale maps. The owner reported
passing web-editor tests, a passing type check and production build, and passing
manual validation of the catalogue, override dialogs, preview, save, refresh,
and recovery.

## Browser-configuration slice

Plan Default and Browser tabs now author the supported plan browser defaults:
Chromium headless mode, viewport width and height, and IANA time zone. Case
Browser offers an explicit override toggle. An enabled override begins as a
copy of the effective plan viewport and time zone; removing it returns the
case to inherited settings without disturbing other case settings. Case
overrides deliberately do not offer run-wide headless mode.

The draft helpers copy browser settings without sharing nested viewport data
and preserve unrelated case settings when an override is removed. The existing
recovery and portable-bundle paths carry the draft fields; end-to-end
configuration preservation remains part of M11 integration evidence. Shared
validation supplies field feedback for invalid browser values. The owner
reported passing the web-editor tests, type check, production build, and
manual checks of browser settings, case inheritance, card presentation, and
case switching.

This slice also clarified presentation ownership: plan and case details own
their cards, each Step detail owns its route-page fields, and
`StepReferences` coordinates ordered data, dialogs, and draft updates for
Case-route cards. Edit mode exposes authoring controls only in the current
route context; View mode uses read-only summaries.

## Accessibility-configuration slice

Plan Accessibility now authors the supported `enabled`, `failOnViolation`, and
axe rule-tag defaults. The editor derives its alphabetized tag catalogue from
the public shared schema, preventing a divergent browser-only inventory. The
filter narrows a visible wrapping checkbox list without hiding the catalogue by
default. Case Accessibility provides an explicit override toggle; enabling it
copies the effective plan values, including tags, and removing it returns the
case to inheritance while preserving browser and other future case settings. An
explicit empty case tag list clears the inherited filter and uses axe defaults.

Focused draft tests cover plan accessibility updates, tag-array copy isolation,
and case override creation/removal alongside unrelated browser settings. The
owner reported passing the web-editor tests, type check, production build, and
manual checks of plan settings, case inheritance, clearing an override, tag
filtering, and the unaffected Browser tab.

## Step-timeout hierarchy slice

The v1 contract now permits an optional `defaults.timeout` on a plan and an
optional `settings.timeout` on a case. A supported step's existing `timeout`
field remains the most-specific setting. The effective action/assertion timeout
is therefore step, then case, then plan, then Stagehand's built-in 30,000 ms
fallback. Wait-list entries retain their independently authored timeout
semantics.

The editor makes the plan and case settings explicit opt-in overrides: an
omitted plan value displays the Stagehand fallback, and an omitted case value
displays the effective plan or fallback value. Step cards offer the final,
optional override and preserve it through action-dialog edits and cloning.
Runner-core resolves supplied run-level and case settings before dispatching
supported actions and assertions; a future CLI must map the serialized plan
and case settings into that public API. The owner reported passing schema, runner-core, and
web-editor tests, type checks, production build, and manual verification of
the inheritance controls, validation, and View-mode summaries.

View mode now presents plan, case, and Step settings through the same
Bootstrap-style tab controls used for Edit mode, but with read-only summary
content. Changing modes retains the selected tab rather than replacing the
author's current context.

## Route-oriented authoring presentation slice

The current presentation refactor replaces the nested expandable-workspace
layout with Vue Router routes that provide one authoring context at a time:
Home (`/`), Plan (`/plan`), Case (`/plan/card/:cardIndex`), and Step
(`/plan/card/:cardIndex/step/:stepIndex`). The Home route offers New and
Import, and exposes Recover only when the startup recovery check finds a
readable local draft. After recovery resolves, the Plan route presents plan
Default, Browser, and Accessibility settings alongside responsive Case summary
cards. A Case route presents its settings and responsive read-only Step cards;
card navigation opens the dedicated Step route, where that step's settings are
editable in Edit mode and summarized as plain read-only details in View mode.

Breadcrumbs expose the Plan, indexed Case, and indexed action name while
preserving browser Back navigation through the nested route history. View/Edit
remains temporary interface state. It affects only the settings for the current
route; Case and Step cards remain navigational summaries. Case and Step
authoring controls stay on their parent route cards so that moving, editing,
cloning, and removing do not require nested cards inside a mobile viewport.

The assertion Step routes use Default, Overrides, and Locales tabs. Their
shared Locales panel supports the same canonical locale catalogue and dialog
workflow for Assert text, Assert HTML, and Assert value. The card and dialog
presentation uses compact Bootstrap button groups and outlined secondary
actions; Save, Create, Download, and destructive confirmation actions retain
their primary semantic emphasis. Font Awesome kit icons use a shared
icon-only button component that keeps a localized visually hidden action name
for assistive technology.

This slice is implemented in the current editor work but has not yet recorded
its focused automated, type-check, build, and manual responsive-route evidence.

## Incremental delivery

Suggested remaining PR slices: verify the route-oriented presentation, add
wait and assertion options, then collect M11 integration evidence.

## Open decisions and exclusions

Do not add unsupported browser types, actions, or execution controls. Review the form grouping and inheritance presentation before building complex controls.

The editor can export the timeout settings, but no CLI currently maps an
exported plan/case bundle into runner-core settings; execution integration
remains later work.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.

## Learning plan reference

- [Web editor course](../../Learning%20Plan/Apps/web/README.md)
- [Step-timeout inheritance and View summaries](../../Learning%20Plan/Apps/web/Lessons/30-step-timeout-inheritance-and-view-summaries.md)
- [Route-oriented authoring presentation](../../Learning%20Plan/Apps/web/Lessons/32-route-oriented-authoring-presentation.md)
- [Step View/Edit summaries](../../Learning%20Plan/Apps/web/Lessons/34-step-view-edit-summaries.md)
