# M8 — Editor foundation and document state

**Status:** In progress; M8.1 application foundation complete
**Estimate:** 8–14 focused human person-days  
**Depends on:** [M7](M7-integration-and-phase-1-review.md)

## Objective

Establish a working local Vue editor foundation with basic form editing, shared validation, Canadian English/French Neutral guidance, and one recoverable draft that can be edited in multiple tabs without silent overwrites.

## Scope and decisions

Follow [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md) and [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md). Begin with one bundled synthetic plan and associated cases. Show a plan-details area, read-only case list, and validation feedback. Keep document values, incomplete form input, interface state, and local preferences distinguishable; only contract fields belong in future JSON exports.

Case editing, import/export, new-plan creation, advanced configuration, optional persona loading, and revision history are outside M8. Version and identifiers remain read-only under the earlier accepted scope, subject to the editable-field question below.

## Proposed implementation slices and tasks

### M8.1 — Owner-led application setup (1–2 person-days)

- [x] Review the existing workspace and select compatible pinned Vite/Vue/TypeScript dependencies.
- [x] Give the owner setup commands with explanations and checkpoints; the owner runs the initial scaffold rather than the agent generating it.
- [x] Establish documented development, build, type-check, and suitable test commands in the existing workspace.
- [x] Demonstrate a browser build consuming the public plan-schema entry without Node-only dependencies.
- [x] Start with Bootstrap 5 CDN CSS; add JavaScript only for demonstrated needs.

M8.1 currently pins Vue 3.5.44, Vite 8.3.6, and TypeScript 6.0.3. The
repository TypeScript pin changed to 6.0.3 because the selected Vue type-check
tooling requires the TypeScript 6 API. The first shell imports `validatePlan`
from the public `@stagehand/plan-schema` entry point. The owner verified the
build in the development container on 7 November 2026: plan-schema built,
`vue-tsc -b` passed, and Vite transformed 114 modules for the production
bundle. The owner also started the development server with `--host 0.0.0.0`,
forwarded port 5173, and visually confirmed the editor shell in a local
browser. Record future browser checks with their browser and version.

The theme selector is an interface preference, not document or draft-recovery
data. It defaults to the browser colour scheme and stores only explicit Light or
Dark overrides locally; selecting System removes the override. Its unit and
build verification, reported by the owner from the development container on 7
November 2026, passed: six Vitest tests, `vue-tsc -b`, and the schema-backed
Vite production build (116 transformed modules) all succeeded. Browser
persistence verification must still be recorded with this PR before it becomes
completion evidence.

Vitest 5.1.0 is the selected unit-test runner for the editor. It shares Vite's
transformation pipeline. The first validation boundary delegates to the public
shared-contract validator and has focused valid/invalid-plan unit tests. Browser
interaction and accessibility checks remain separate work, not a substitute for
unit tests.

M8.1 completion evidence, reported by the owner from the development container
on 7 November 2026: `npm test --workspace @stagehand/web` passed one test file
with two tests; `npm run type-check --workspace @stagehand/web` passed; and
`npm run build --workspace @stagehand/web` built plan-schema, type-checked the
editor, and completed the Vite production build (115 transformed modules) in
1.77 seconds. The build and visual shell checks establish the application
foundation only; they do not verify later form, recovery, conflict, localization,
or offline behaviour.

This PR also configures a focused Linux GitHub Actions web job that installs the
workspace, builds the schema-backed editor bundle, and runs the web unit tests.
Its first remote result must be recorded before it is treated as CI verification.

### M8.2 — Document state and basic editing (2–3 person-days)

- [ ] Resolve the first editable contract field before implementing the form.
- [ ] Load a synthetic plan/case bundle; render plan details, case list, and validation summary.
- [ ] Preserve untouched contract data and incomplete edits; do not coerce invalid input into apparently valid values.
- [ ] Validate on opening, field blur, and an explicit Validate action through shared validation.
- [ ] Associate understandable feedback with fields where possible and retain a useful summary for bundle-level errors.
- [ ] Show edits that have not been exported separately from whether a recovery copy is saved locally.
- [ ] Confirm before resetting edited work to the sample.

### M8.3 — Localization and accessible Neutral guidance (1–2 person-days)

- [ ] Assess i18next's Vue integration and record the selected dependency.
- [ ] Provide Canadian English (`en-CA`, default) and Canadian French (`fr-CA`) resources for user-facing text and Neutral guidance.
- [ ] Keep interface language independent of assertion locales; remember language outside the recovery draft.
- [ ] Define a place for persona wording in localization without implementing optional persona files or loading.
- [ ] Verify labelled controls, keyboard access, visible focus, and understandable validation/status feedback.

### M8.4 — Draft autosave and recovery (2–4 person-days)

- [ ] Put IndexedDB operations behind a small storage interface and identify the initial draft format.
- [ ] Store one plan/case draft, including incomplete form values, after one second without edits; validation failures do not block saving.
- [ ] Show saving, saved locally only after success, and failure states. Do not rely on application closure to save.
- [ ] Offer Restore or Discard with the last-saved time on reopening.
- [ ] Preserve unreadable recovery data and require explicit discard before starting fresh.
- [ ] Verify reopened recovery, invalid/incomplete values, storage failures, and sample-reset protection.

### M8.5 — Multiple-tab conflict handling (2–3 person-days)

- [ ] Compare the stored revision and write the replacement in one IndexedDB transaction.
- [ ] On a conflict, pause autosave in the affected tab and retain its pending edits.
- [ ] Compare pending edits with the saved draft; allow explicit local discard or saved-draft replacement.
- [ ] Recheck the revision on replacement and detect intervening saves.
- [ ] Allow a tab without pending edits to load the newer saved draft.
- [ ] Verify competing saves, conflict choices, repeated conflicts, and reset/discard races across tabs.

Each slice can use more than one feature-sized PR if needed. The ranges sum to the milestone estimate; they are provisional and exclude additional learning time.

## Deliverables and completion evidence

- A documented, buildable Vue/TypeScript application established through owner-run commands.
- Synthetic bundle, basic form, shared validation, both interface languages, and Neutral guidance.
- Automated checks focused on state preservation, persistence, and revision-conflict behaviour; real-browser demonstrations in supported Chrome and Edge on Windows.
- Evidence covers editing, validation, restoring incomplete edits, storage failures, and competing tabs. Record browser versions, commands, outcomes, and limitations rather than assuming coverage from mocks.
- Updated application README and relevant learning guidance; no claim of offline cold-start or guaranteed storage retention.

## Open decisions before relevant slices

- **First editable field:** the v1 plan schema has no name or description property. Earlier conversational examples assumed one. With identifiers read-only, select an existing field for M8 or explicitly approve identifier editing. Do not invent a name field or change the contract silently.
- Select localization integration and storage implementation during their slices.
- Define the exact draft representation and comparison presentation, including a clear route through failed storage or unreadable data.

## Exclusions and follow-through

[M9](M9-basic-plan-and-case-authoring.md) adds authoring, [M10](M10-local-import-and-export.md) adds portable files, and [M13](M13-unsaved-work-drafts-and-recovery.md) completes protection across those workflows. CDN offline styling follow-through belongs to [M14](M14-integration-usability-and-phase-2-review.md).
