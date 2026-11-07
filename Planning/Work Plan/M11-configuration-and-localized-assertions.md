# M11 — Configuration and localized assertions

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10](M10-local-import-and-export.md)

## Objective

Author supported plan/case configuration and localized assertion values without editing JSON.

## Tasks

- [ ] Provide controls for supported browser/run defaults and case overrides, with inherited versus explicit values explained.
- [ ] Cover supported timeouts, waits, interaction options, hard/soft assertions, and accessibility configuration.
- [ ] Edit expected-value defaults and locale overrides using shared canonicalization and duplicate-locale validation.
- [ ] Keep interface language separate from execution locale and expected-value selection.
- [ ] Preserve configured values through recovery and import/export; do not materialize inherited defaults without a deliberate reason.
- [ ] Verify invalid settings, inheritance restrictions, locale fallback, and English/French feedback.

## Deliverables and completion evidence

Author and round-trip representative configuration and localized assertions; demonstrate default fallback and rejection of equivalent duplicate locale keys.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: plan/case configuration; wait and assertion options; localized expected-value forms.

## Open decisions and exclusions

Do not add unsupported browser types, actions, or execution controls. Review the form grouping and inheritance presentation before building complex controls.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
