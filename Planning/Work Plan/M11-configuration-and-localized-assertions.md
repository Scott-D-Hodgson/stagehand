# M11 — Configuration and localized assertions

**Status:** In progress; browser-configuration and early localized-assertion
slices complete out of sequence
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10](M10-local-import-and-export.md) for the broader milestone; the early localized-assertion slices are accepted exceptions

## Objective

Author supported plan/case configuration and localized assertion values without editing JSON.

## Tasks

- [x] Provide controls for supported browser/run defaults and case overrides, with inherited versus explicit values explained.
- [ ] Cover supported timeouts, waits, interaction options, hard/soft assertions, and accessibility configuration.
- [x] Edit expected-value defaults and locale overrides using shared canonicalization and duplicate-locale validation for Assert text, Assert HTML, and Assert value.
- [x] Keep interface language separate from execution locale and expected-value selection for the implemented localized-assertion slices.
- [ ] Preserve configured values through recovery and M10 import/export; recovery is complete for all implemented assertion locale-override slices, while their portable-file preservation remains to be verified.
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
their cards, each step detail composes the reusable step-card presentation,
and `CaseStepEditor` coordinates ordered data, dialogs, and draft updates.
Edit mode exposes authoring controls only for the active case; View mode and
non-active edit cases use a reduced read-only case and step presentation.

## Incremental delivery

Suggested remaining PR slices: remaining run configuration, wait and assertion
options, and accessibility configuration.

## Open decisions and exclusions

Do not add unsupported browser types, actions, or execution controls. Review the form grouping and inheritance presentation before building complex controls.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
