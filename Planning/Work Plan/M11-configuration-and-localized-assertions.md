# M11 — Configuration and localized assertions

**Status:** Complete
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10](M10-local-import-and-export.md) for the broader milestone; the early localized-assertion slices are accepted exceptions

## Objective

Author supported plan/case configuration and localized assertion values without editing JSON.

## Tasks completed

- [x] Provide controls for supported browser/run defaults and case overrides, with inherited versus explicit values explained.
- [x] Deliver the agreed interaction configuration: supported action and assertion Before/After waits, scrolling overrides, hard/soft assertions, and the plan, case, and step timeout hierarchy.
- [x] Edit expected-value defaults and locale overrides using shared canonicalization and duplicate-locale validation for Assert text, Assert HTML, and Assert value.
- [x] Keep interface language separate from execution locale and expected-value selection for the implemented localized-assertion slices.
- [x] Verify the route-oriented responsive authoring presentation: recovery-aware Home, Plan, Case, Step, and Wait routes; responsive summary-card grids; editable detail pages; breadcrumbs; and temporary View/Edit presentation state.
- [x] Verify recovery and M10 import/export preservation for implemented configuration, including browser, accessibility, timeout, wait, locale, and associated-label data.
- [x] Verify invalid settings, inheritance restrictions, locale fallback, and English/French feedback.

## Decisions made

- Keep the current M11 interaction vocabulary bounded to the supported v1
  actions and assertions; do not select additional candidates from
  [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md) without a
  dedicated scope decision.
- Preserve the version 1 Delay-wait timeout for imported documents while
  intentionally omitting it from editor authoring until the versioned contract
  work in [ATR-043](../Backlog/epics/E01-plan-definition/stories/ATR-043.md).
- Require explicit local-form Apply actions and explicit recovery restoration;
  recovery uses the closest valid route rather than silently opening a stale
  deep link.

## Deferred work

- [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md) retains
  extended browser navigation, action variants, and assertion vocabulary as
  later work.
- [ATR-043](../Backlog/epics/E01-plan-definition/stories/ATR-043.md) retains
  removal of the fixed-delay timeout as a later versioned-contract change.
- CLI execution mapping for exported browser, case, and timeout settings
  remains outside the web-authoring milestone.

## Completion evidence

Author and round-trip representative configuration and localized assertions; demonstrate default fallback and rejection of equivalent duplicate locale keys.

Focused editor, schema, runner-core, recovery, and portable-bundle checks cover
the delivered slices. The owner reported passing development-container test
suite, type check, production build, and manual English/French authoring,
inheritance, recovery, export/import, and route-fallback walkthroughs. The
implementation follows the localization and presentation baseline in
[ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md)
and recovery baseline in
[ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Supporting detail

### Early localized-assertion slices

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

The current polish keeps destructive locale-override removal behind the shared
confirmation dialog. Breadcrumbs always expose a Plan Locale menu containing
Canadian English, Canadian French, the active locale, and any locale found in
assertion overrides, so an author can inspect locale previews without leaving a
Case or Step route. Browser viewport feedback is attached to its invalid field
and translated through the interface resources rather than exposing raw schema
wording.

Assert value now also authors its optional always-soft `associatedLabel` check.
Authors explicitly enable the check, enter its default expected label, and may
maintain independent localized label overrides. Editing an override's locale
replaces its original key rather than retaining both entries. Disabling and
applying removes the optional property from the draft.

The owner reported that the development-container test suite, type check,
production build, and manual associated-label checks passed for this slice.

### Browser-configuration slice

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

### Accessibility-configuration slice

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

### Step-timeout hierarchy slice

The v1 contract now permits an optional `defaults.timeout` on a plan and an
optional `settings.timeout` on a case. A supported step's existing `timeout`
field remains the most-specific setting. The effective action/assertion timeout
is therefore step, then case, then plan, then Stagehand's built-in 30,000 ms
fallback. Locator and page-state wait-list entries retain independently
authored timeout semantics. The editor authoring surface deliberately omits a
Delay-wait timeout while preserving a legacy imported value until the
versioned contract change recorded in [ATR-043](../Backlog/epics/E01-plan-definition/stories/ATR-043.md).

The editor makes the plan and case settings explicit opt-in Overrides-panel
settings: an omitted plan value displays the Stagehand fallback, and an omitted
case value displays the effective plan or fallback value. Step cards offer the
final, optional override and preserve it through action-dialog edits and
cloning.
Runner-core resolves supplied run-level and case settings before dispatching
supported actions and assertions; a future CLI must map the serialized plan
and case settings into that public API. The owner reported passing schema, runner-core, and
web-editor tests, type checks, production build, and manual verification of
the inheritance controls, validation, and View-mode summaries.

View mode now presents plan, case, and Step settings through the same
Bootstrap-style tab controls used for Edit mode, but with read-only summary
content. Changing modes retains the selected tab rather than replacing the
author's current context.

### Route-oriented authoring presentation slice

The current presentation refactor replaces the nested expandable-workspace
layout with Vue Router routes that provide one authoring context at a time:
Home (`/`), Plan (`/plan`), Case (`/plan/card/:cardIndex`), Step
(`/plan/card/:cardIndex/step/:stepIndex`), and Wait
(`/plan/card/:cardIndex/step/:stepIndex/wait/:position/:waitIndex`). The Home route offers New and
Import. New first collects a Plan ID. A readable local draft instead opens a
blocking restoration confirmation before any bundle becomes active. After
recovery resolves, the Plan route presents plan
Default, Browser, and Accessibility settings alongside responsive Case summary
cards. A Case route presents its settings and responsive read-only Step cards;
card navigation opens the dedicated Step route, where that step's settings are
editable in Edit mode and summarized as plain read-only details in View mode.
Each supported Step's Waits pill presents read-only Before and After wait-card
summaries; each opens a dedicated Wait route for editing.

Breadcrumbs expose the Plan, indexed Case, and indexed action name while
preserving browser Back navigation through the nested route history. View/Edit
remains temporary interface state. It affects only the settings for the current
route; Case and Step cards remain navigational summaries. Case and Step
authoring controls stay on their parent route cards so that moving, editing,
cloning, and removing do not require nested cards inside a mobile viewport.
A Wait breadcrumb adds its unlinked Before or After position before the indexed
Wait, and its Return action follows the hierarchy back to the Step.

The assertion Step routes use Default, Overrides, and Locales tabs. Their
shared Locales panel supports the same canonical locale catalogue and dialog
workflow for Assert text, Assert HTML, and Assert value. The card and dialog
presentation uses compact Bootstrap button groups and outlined secondary
actions; Save, Create, Download, and destructive confirmation actions retain
their primary semantic emphasis. Font Awesome kit icons use a shared
icon-only button component that keeps a localized visually hidden action name
for assistive technology.

The owner reported passing the focused web-editor tests, type check,
production build, and manual responsive-route verification for this presentation
and Step-wait authoring work.

### Step-wait authoring slice

Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and
Assert value Step pages expose a Waits pill beside their other settings.
Authors maintain ordered Before and After lists using read-only card summaries
on the Step page. Add first opens a static Bootstrap chooser for Locator, Page
state, or Delay, then a type-specific validated dialog; only Save adds the new
card. Each existing card opens a dedicated Wait route for editing. The parent
Step page retains Promote, Demote, Edit, and Remove controls, while the Wait
route owns its fields and Return navigation. Removing a wait uses the same
static Bootstrap confirmation pattern as removing a Step, so the author must
explicitly confirm “Remove this wait?” before its list changes.

The v1 schema shares the same waitable-step boundary across these supported
actions and assertions. Runner-core executes each list in order: Before waits,
then the action or assertion, then After waits. A soft assertion still runs its
After list; a hard action or assertion failure stops execution before it.
Navigate completes at `domcontentloaded`; its Before/After lists are the sole
explicit authoring mechanism for additional waits.

The v1 schema no longer accepts Navigate's former `waitUntil` property, and
runner-core no longer exposes it as a Step or direct-navigation option. This
keeps `networkidle` and other later completion requirements in an After
Page-state wait, using the same portable representation as every other
supported Step.

Focused schema, runner-core, and web-editor checks cover wait-list acceptance,
immutable draft updates, and execution ordering. The owner reported that all
development-container checks and manual authoring checks passed for this slice.

Locator and Page state waits may set their independent timeout. Delay waits
author only a bounded delay; although version 1 still permits a legacy optional
timeout beside a delay, the editor preserves rather than displays it. The future
public-contract removal is recorded in
[ATR-043](../Backlog/epics/E01-plan-definition/stories/ATR-043.md).

### Assertion-behaviour slice

Assert text, Assert HTML, and Assert value now author the version 1 `soft`
setting through a shared Assertion behaviour control in their Overrides panel.
Hard is the default behaviour and is represented by omitting `soft`; selecting
Soft stores only `soft: true`. View mode summarizes the selected behaviour.
Focused draft-state tests cover all three assertion actions, the omission of the
hard default, and preservation of unrelated non-assertion steps. The owner
reported passing the web-editor tests, type check, production build, and manual
verification.

### Interaction-scrolling slice

Click, Type, Fill, and Select option Step pages now expose the shared
`scrollIntoView` interaction setting in Overrides. The version 1 schema default
is enabled, so the editor omits the property when enabled and writes only
`scrollIntoView: false` when the author disables it. View mode reports the
effective Enabled or Disabled setting. A focused immutable draft helper updates
only the four supported interaction actions and leaves other steps unchanged.

The owner reported passing web-editor tests, type check, production build, and
manual verification that toggling persists across route navigation and that
re-enabling removes the explicit portable-data field.

### Applied-forms and navigation-gates slice

Plan, Case, Step, and Wait configuration panels now retain edits in local
mini-forms until an author selects **Apply**. Field feedback appears on blur,
and invalid forms disable Apply so an incomplete value cannot update the
underlying draft or its IndexedDB recovery record. A valid but unapplied Step
or Wait form blocks route navigation with an explicit discard confirmation.

Successful Step and Wait applications display a short Bootstrap toast owned by
the application shell. It remains visible through route changes; Wait Apply
itself intentionally stays on the Wait route so Return remains the author's
explicit navigation choice. The owner reported passing the development-container
web tests, type check, production build, and manual checks for this slice.

### M11 integration-evidence slice

A representative valid plan and case now exercise plan and case browser and
accessibility settings, timeout overrides, interaction waits, scrolling,
localized assertion expectations, and Assert Value's localized associated
label expectation. Focused browser-safe tests verify that the complete bundle
round-trips through the M10 export/import boundary and that an IndexedDB
recovery record retains the applied settings without sharing a mutable
snapshot.

Startup recovery now treats a saved bundle as pending rather than active. A
blocking confirmation asks whether to restore the dated local copy; declining
returns to Home, while accepting restores the bundle and retains the deepest
valid Plan, Case, Step, or Wait route. Invalid route segments fall back to
their nearest valid ancestor. New plans always collect an author-provided Plan
ID and return to the Plan route, including when they replace a Case-route
bundle. The owner reported that the recovery, export, import, and route-fallback
manual walkthrough passed, together with the development-container test suite,
type check, and production build after the follow-up startup-recovery
presentation adjustments.

### Boundaries

Do not add unsupported browser types, actions, or execution controls. Review the form grouping and inheritance presentation before building complex controls.

The editor can export the timeout settings, but no CLI currently maps an
exported plan/case bundle into runner-core settings; execution integration
remains later work.

The original estimate remains a historical planning range. Follow-on interaction
work is deferred to the backlog and later milestones.

## Learning plan reference

- [Web editor course](../../Learning%20Plan/Apps/web/README.md)
- [Step-timeout inheritance and View summaries](../../Learning%20Plan/Apps/web/Lessons/30-step-timeout-inheritance-and-view-summaries.md)
- [Route-oriented authoring presentation](../../Learning%20Plan/Apps/web/Lessons/32-route-oriented-authoring-presentation.md)
- [Step View/Edit summaries](../../Learning%20Plan/Apps/web/Lessons/34-step-view-edit-summaries.md)
- [Step-wait authoring and wait routes](../../Learning%20Plan/Apps/web/Lessons/35-interaction-wait-authoring.md)
- [Assertion behaviour](../../Learning%20Plan/Apps/web/Lessons/36-assertion-behaviour.md)
- [Interaction scrolling overrides](../../Learning%20Plan/Apps/web/Lessons/37-interaction-scrolling-overrides.md)
- [Applied forms and navigation gates](../../Learning%20Plan/Apps/web/Lessons/38-applied-forms-and-navigation-gates.md)
- [Associated-label assertions](../../Learning%20Plan/Apps/web/Lessons/39-associated-label-assertions.md)
- [M11 configuration round trips](../../Learning%20Plan/Apps/web/Lessons/40-m11-configuration-round-trips.md)
