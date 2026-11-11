# M11 — Configuration and localized assertions

**Status:** In progress; early Assert-text locale-override slice complete out of sequence
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10](M10-local-import-and-export.md) for the broader milestone; the early Assert-text slice is an accepted exception

## Objective

Author supported plan/case configuration and localized assertion values without editing JSON.

## Tasks

- [ ] Provide controls for supported browser/run defaults and case overrides, with inherited versus explicit values explained.
- [ ] Cover supported timeouts, waits, interaction options, hard/soft assertions, and accessibility configuration.
- [ ] Edit expected-value defaults and locale overrides using shared canonicalization and duplicate-locale validation. The Assert-text sub-slice is complete; Assert HTML and Assert value remain.
- [x] Keep interface language separate from execution locale and expected-value selection for the implemented Assert-text slice.
- [ ] Preserve configured values through recovery and import/export; recovery is complete for the Assert-text slice, while import/export remains M10 work.
- [ ] Verify invalid settings, inheritance restrictions, locale fallback, and English/French feedback.

## Deliverables and completion evidence

Author and round-trip representative configuration and localized assertions; demonstrate default fallback and rejection of equivalent duplicate locale keys.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Early Assert-text locale-override slice

The owner authorized this focused M11 capability before M10 so that the editor
could explore localized expected values while the authoring surface is small.
Plan Locale and Assert-text override Locale now use the same reviewed JSON
catalogue of 66 canonical locale tags. The catalogue is a maintained supported
set, not an attempt to enumerate every possible BCP 47 tag. A recovered or
imported out-of-catalogue value remains visible as a disabled current option
rather than being silently rewritten.

An Assert-text card keeps its required `expected.default` value. Its Locale
overrides panel lists entries alphabetically, supports Bootstrap-dialog Add and
Edit flows, confirms removal, and retains values through base-step editing,
cloning, autosave, and recovery. The configured Plan Locale previews the value
that would be used at execution: the matching override is primary-coloured, or
the default is primary-coloured when no override matches. Matching values group
in muted summary text and identify their locale codes on hover.

Focused tests cover the catalogue's canonical unique entries and recovery-copy
isolation for Assert-text locale maps. The owner reported 49 passing web-editor
tests, a passing type check and production build, and passing manual validation
of the catalogue, override dialogs, preview, save, refresh, and recovery.

## Incremental delivery

Suggested remaining PR slices: plan/case configuration; wait and assertion
options; then apply the proven override interaction to Assert HTML and Assert
value.

## Open decisions and exclusions

Do not add unsupported browser types, actions, or execution controls. Review the form grouping and inheritance presentation before building complex controls.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
