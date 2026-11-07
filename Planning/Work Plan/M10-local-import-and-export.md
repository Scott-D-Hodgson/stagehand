# M10 — Local import and export

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M9](M9-basic-plan-and-case-authoring.md)

## Objective

Complete the first portable file workflow using upload/import and download/export.

## Tasks

- [ ] Import a versioned plan and associated cases; retain portable paths relative to the plan.
- [ ] Use browser-safe shared reference matching and parsed-bundle validation; do not import the Node filesystem loader.
- [ ] Explain malformed JSON, unsupported versions, missing references, duplicates, and invalid documents without replacing current work silently.
- [ ] Export plan and case files while retaining the reference layout; distinguish invalid drafts from valid plans.
- [ ] Track local recovery status separately from edits not yet exported, and state what a download does and does not confirm.
- [ ] Protect current work before replacement and verify cancellation and failed imports.

## Deliverables and completion evidence

Import a synthetic bundle, edit it, export it, and re-import the output with equivalent contract content and resolved references. Demonstrate missing/duplicate reference feedback and invalid-draft export without a valid-plan claim.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: file selection and reference matching; validated import/replacement; export and round-trip verification.

## Open decisions and exclusions

Choose the portable multi-file download packaging and supported folder-selection/fallback interaction before implementation. Direct filesystem access remains deferred; no permission-based filesystem integration is included.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
