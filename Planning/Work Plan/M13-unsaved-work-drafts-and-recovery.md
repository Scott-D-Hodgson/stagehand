# M13 — Unsaved work, drafts, and recovery

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 4–7 focused human person-days  
**Depends on:** [M10–M12](M12-variables-data-sets-and-shared-steps.md)

## Objective

Complete protection across the full authoring workflow and integrate optional user-loaded personas.

## Tasks

- [ ] Audit create/import/reset/delete/replace/navigation flows; close gaps in confirmations and unsaved-export indicators without postponing protection from earlier milestones.
- [ ] Exercise restore/discard, failed writes, unreadable drafts, and multi-tab conflicts with all advanced authoring data.
- [ ] Document browser-storage limitations and how to remove local drafts and preferences.
- [ ] Define a validated data-only persona-file format, language coverage, missing-key fallback to Neutral, and compatibility handling before building persona import.
- [ ] Allow user-initiated optional persona loading and selection; persist preference separately from plan data and recovery drafts.
- [ ] Keep critical warnings unambiguous and prevent persona files from changing actions or validation rules.
- [ ] Verify malformed/incompatible persona input and unavailable selected personas without breaking Neutral guidance.

## Deliverables and completion evidence

Demonstrate protection and recovery across the complete workflow, with distinct local-save/export states. Load a synthetic optional persona and safely reject invalid content; Neutral works without any optional file.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: protection audit and recovery gaps; persona format/validation; persona loading and preference handling.

## Open decisions and exclusions

Persona loading is provisionally assigned here for owner review. Motivating and Cranky content generation is not required. Multiple saved projects, revision history, and released-format migrations are not silently added; assess separately if needed. Choose detailed persona rules and supported navigation warning limits before implementation.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
