# M14 — Integration, usability, and Phase 2 review

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M8–M13](M13-unsaved-work-drafts-and-recovery.md)

## Objective

Verify the complete authoring experience and document evidence against Phase 2 outcomes.

## Tasks

- [ ] Dogfood a representative synthetic authoring/import/edit/validate/export/re-import workflow and record usability findings.
- [ ] Verify current stable desktop Chrome and Edge on Windows, recording versions and differences.
- [ ] Review Canadian English/French coverage, Neutral wording, optional persona loading, keyboard access, focus, labels, and validation announcements.
- [ ] Demonstrate static hosting and offline-after-load editing, validation, and recovery writes without claiming offline cold-start support.
- [ ] Resolve CDN styling follow-through with an agreed approach if needed, such as project-owned CSS or an offline shim; record and verify the choice.
- [ ] Publish project-owned synthetic examples and a short authoring walkthrough as repository documentation; update learning guidance.
- [ ] Review package boundaries and baseline checks; record actual automated/manual evidence, unresolved issues, and explicit deferrals.
- [ ] Trace roadmap outcomes to evidence and update milestone/backlog status only where supported.

## Deliverables and completion evidence

A reviewer can follow the authoring walkthrough in both supported browsers, inspect round-tripped files, reproduce recovery/conflict checks, and trace every Phase 2 outcome to evidence or an explicitly agreed exception.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: integrated workflow fixes; accessibility/localization/offline follow-through; documentation and phase review.

## Open decisions and exclusions

Choose the static-host smoke-check environment and offline styling approach before the relevant checks. Browser execution, CLI, reporting, direct filesystem access, and offline cold-start remain outside Phase 2.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
