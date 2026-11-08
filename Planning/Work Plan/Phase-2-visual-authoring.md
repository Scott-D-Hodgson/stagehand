# Phase 2 work plan — Visual authoring

**Status:** Draft work plan; milestone framework and referenced decisions accepted, task breakdown and estimates proposed.

## Objective and prerequisites

Deliver the [Phase 2 roadmap](../Roadmap/Phase-2-visual-authoring/README.md) as small, reviewable changes for a non-technical test author. [M7](M7-integration-and-phase-1-review.md) and [M8](M8-editor-foundation-and-document-state.md) are recorded complete. M9 is in progress with basic case-reference authoring. This plan does not claim later editor behaviour is implemented.

The accepted baselines are [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md) for M8 draft recovery and [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) for technology, localization, and presentation. The owner completed the Vite scaffolding through guided commands in M8.1. This planning document does not authorize or evidence later implementation by itself.

## Milestones and provisional estimates

| Milestone | Depends on | Focused human effort |
|---|---|---:|
| [M8 — Editor foundation and document state](M8-editor-foundation-and-document-state.md) | M7 | 8–14 person-days |
| [M9 — Basic plan and case authoring](M9-basic-plan-and-case-authoring.md) | M8 | 6–10 person-days |
| [M10 — Local import and export](M10-local-import-and-export.md) | M9 | 4–7 person-days |
| [M11 — Configuration and localized assertions](M11-configuration-and-localized-assertions.md) | M10 | 4–7 person-days |
| [M12 — Variables, data sets, and shared steps](M12-variables-data-sets-and-shared-steps.md) | M11 | 6–10 person-days |
| [M13 — Unsaved work, drafts, and recovery](M13-unsaved-work-drafts-and-recovery.md) | M10–M12 | 4–7 person-days |
| [M14 — Integration, usability, and Phase 2 review](M14-integration-usability-and-phase-2-review.md) | M8–M13 | 4–7 person-days |
| **Total** | | **36–62 person-days** |

These are proposed planning ranges, not agreed commitments or calendar dates. A person-day is roughly 6–7 focused hours, including implementation, documentation, appropriate verification, and self-review. They assume one contributor with basic TypeScript knowledge and exclude additional learning time, review waits, substantial redesign, and future features. Re-estimate each milestone before starting; M8 persistence/conflict handling and M13 optional persona loading carry particular uncertainty.

## Delivery boundaries

- Build in TypeScript inside the existing workspace; consume shared contracts through their public entry point. Browser editing must not depend on the Node filesystem loader or runner.
- Deliver Canadian English by default and Canadian French, with Neutral guidance. Optional user-loaded personas are assigned provisionally to M13 for review.
- Use Bootstrap 5 CSS from a CDN initially and keep custom styling minimal. Resolve offline styling by M14; do not silently weaken the offline-after-load requirement.
- Supported editor targets are current stable desktop Chrome and Edge on Windows. Browser execution, CLI work, report-file writing, direct filesystem access, raw JSON editing, and offline cold-start support are outside this phase.
- Basic autosave, recovery, and multi-tab conflict handling belong to M8. Add protection alongside new destructive actions in M9–M12; do not postpone it all to M13.
- Preserve contracts and distinguish invalid drafts from valid exportable documents. Later authoring features extend editor integration rather than reopen completed contract milestones automatically.

## Completion evidence

- A non-technical author can create, validate, export, and re-import a representative plan and its cases without editing JSON.
- Configuration, localized expected values, variables, data sets, shared steps, and protected environment-variable references follow the shared contracts.
- Recovery, conflict handling, destructive-action warnings, and draft/export status are demonstrated without silent loss of pending work.
- English and French workflows, keyboard operation, validation feedback, static hosting, and offline-after-load behaviour have recorded verification.
- Optional persona loading has a defined, verified scope or an explicitly agreed deferral.
- Synthetic examples and an authoring walkthrough support dogfooding. Limitations, outstanding decisions, verification environments, and deferred work are recorded.

## Review and tracking

Keep tasks unchecked until supported by evidence. Each implementation PR should update the applicable milestone and learning material, record checks actually performed, and include the owner's self-review. No commit, publication, or application scaffold is part of this planning change.
