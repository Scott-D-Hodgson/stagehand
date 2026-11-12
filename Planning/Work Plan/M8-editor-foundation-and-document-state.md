# M8 — Editor foundation and document state

**Status:** Complete
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
Vite production build (116 transformed modules) all succeeded. The owner later
confirmed the Light, Dark, and System controls and their persistence through the
forwarded browser.

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

- [x] Resolve the first editable contract field before implementing the form.
- [x] Load a synthetic plan/case bundle; render plan details, case list, and validation summary.
- [x] Preserve untouched contract data and incomplete edits; do not coerce invalid input into apparently valid values.
- [x] Validate on opening, field blur, and an explicit Validate action through shared validation.
- [x] Associate understandable feedback with fields where possible and retain a useful summary for bundle-level errors.
- [x] Show edits that have not been exported separately from whether a recovery copy is saved locally.
- [x] Confirm before resetting edited work to the sample.

The accepted first editable field is `defaults.locale`. The completed slice has
a synthetic bundle, immutable raw-locale updates, a componentised
plan-details area, a read-only case-reference list, shared validation
presentation, an explicit Validate action, and a confirmation before a changed
sample is reset. The owner verified this slice in the development container on
7 November 2026: `npm test --workspace @stagehand/web` passed 12 tests across
five files; `npm run type-check --workspace @stagehand/web` passed; and
`npm run build --workspace @stagehand/web` built plan-schema, type-checked the
editor, and completed a 134-module Vite production build in 1.38 seconds. The
forwarded-browser check passed for raw invalid-locale feedback after blur and
explicit validation, reset cancellation and confirmation, language and theme
persistence, and live reload; the browser name and version were not recorded.
The temporary "not exported" indicator is not a
draft-recovery status: M8.4 still owns saved-local-copy and storage-failure
feedback.

### M8.3 — Localization and accessible Neutral guidance (1–2 person-days)

- [x] Assess i18next's Vue integration and record the selected dependency.
- [x] Provide Canadian English (`en-CA`, default) and Canadian French (`fr-CA`) resources for user-facing text and Neutral guidance.
- [x] Keep interface language independent of assertion locales; remember language outside the recovery draft.
- [x] Define a place for persona wording in localization without implementing optional persona files or loading.
- [x] Verify labelled controls, keyboard access, visible focus, and understandable validation/status feedback.

M8.3 uses i18next 26.7.2 and
i18next-vue 5.4.0 with one JSON resource file per initial Canadian locale. It
defaults to `en-CA`, remembers a selected interface language locally, and uses
locale-aware zero/one/other plural resources for validation status. Neutral
guidance, complete user-facing coverage, and accessibility verification were
verified. The owner verified the localization work alongside M8.2 on
7 November 2026, including French selection persistence, plural wording, and
forwarded-browser live reload; the browser name and version were not recorded.
The owner later completed the visual checklist for labelled controls, keyboard
operation, visible focus, and understandable validation and status feedback.

### M8.4 — Draft autosave and recovery (2–4 person-days)

- [x] Put IndexedDB operations behind a small storage interface and identify the initial draft format.
- [x] Store one plan/case draft, including incomplete form values, after one second without edits; validation failures do not block saving.
- [x] Show saving, saved locally only after success, and failure states. Do not rely on application closure to save.
- [x] Offer Restore or Discard with the last-saved time on reopening.
- [x] Preserve unreadable recovery data and require explicit discard before starting fresh.
- [x] Verify reopened recovery, invalid/incomplete values, storage failures, and sample-reset protection.

The initial storage boundary is a `DraftStorage` interface with load, save, and
explicit discard operations for one active recovery record. The v1 record keeps
the raw plan draft, a non-negative revision, and an ISO 8601 saved time. The
IndexedDB adapter keeps its internal key private, preserves unsupported records
as unreadable rather than deleting them. The startup gate now loads this record
before editing: it offers Restore or Discard with the saved time for a readable
record, and requires explicit discard for unreadable data. The owner verified
the recovery-gate behaviour in the development container on
7 November 2026: `npm test --workspace @stagehand/web` passed 21 tests across
seven files; `npm run type-check --workspace @stagehand/web` passed; and
`npm run build --workspace @stagehand/web` completed the plan-schema build,
editor type check, and 138-module Vite production build in 1.50 seconds. The
forwarded-browser check restored a seeded `recovered-plan` with `fr-CA`, then
discarded the recovery copy and returned to `editor-foundation` with `en-CA`.
The browser name and version were not recorded. Unreadable-record presentation
has automated coverage but still needs browser evidence.

Autosave now begins only after recovery is resolved. It snapshots the reactive
draft into plain data, waits one second after the latest edit, and writes an
invalid draft without coercing it. The owner verified Saving locally, Saved
locally, refresh, restore, and discard in the forwarded browser on 7 November
2026. The development-container checks passed 22 tests across eight files,
type check, and a production build. The owner also verified the remaining
forwarded-browser cases: an unsupported record withheld the editor until
explicit discard, and a simulated IndexedDB write failure showed failed-save
status while retaining the in-memory edit. Browser name and version were not
recorded.

### M8.5 — Multiple-tab conflict handling (2–3 person-days)

- [x] Compare the stored revision and write the replacement in one IndexedDB transaction.
- [x] On a conflict, pause autosave in the affected tab and retain its pending edits.
- [x] Compare pending edits with the saved draft; allow explicit local discard or saved-draft replacement.
- [x] Recheck the revision on replacement and detect intervening saves.
- [x] Allow a tab without pending edits to load the newer saved draft.
- [x] Verify competing saves, conflict choices, repeated conflicts, and reset/discard races across tabs.

Conditional saves now compare and write inside one IndexedDB transaction. A
conflict pauses autosave and retains the local draft. The editor offers explicit
Discard local edits and Replace saved draft choices; replacement compares the
latest revision again. The owner verified the initial two-tab flow in the forwarded
browser on 8 November 2026: stale saves conflicted, discard loaded the newer
draft without an extra write, a later save succeeded, replacement saved the
local draft, and refresh recovered that replacement. The development-container
test, type-check, and build commands passed. Browser name and version were not
recorded.

The owner completed those browser checks on 8 November 2026. Repeated
replacement correctly refreshed the conflict state, reset raced safely with a
newer tab save, and a stale recovery-discard prompt could not delete a newer
draft. Recovery actions are guarded while their IndexedDB operation is in
flight, preventing a rapid second discard from acting on a refreshed prompt.

Each slice can use more than one feature-sized PR if needed. The ranges sum to the milestone estimate; they are provisional and exclude additional learning time.

## Deliverables and completion evidence

- A documented, buildable Vue/TypeScript application established through owner-run commands.
- Synthetic bundle, basic form, shared validation, both interface languages, and Neutral guidance.
- Automated checks focused on state preservation, persistence, and revision-conflict behaviour; real-browser demonstrations in supported Chrome and Edge on Windows.
- Evidence covers editing, validation, restoring incomplete edits, storage failures, and competing tabs. Record browser versions, commands, outcomes, and limitations rather than assuming coverage from mocks.
- Updated application README and relevant learning guidance; no claim of offline cold-start or guaranteed storage retention.

## Open decisions before relevant slices

- **Plan locale control:** `defaults.locale` began as the accepted first editable raw text field in M8.2. The early M11 localized-assertion slices replaced its UI with a select backed by a deliberately maintained 66-entry locale catalogue; it remains separate from the editor's `en-CA`/`fr-CA` interface choices. A searchable control can be reassessed if the catalogue grows.
- Define the comparison presentation and a clear route through failed storage or unreadable data.

## Exclusions and follow-through

[M9](M9-basic-plan-and-case-authoring.md) adds authoring, [M10](M10-local-import-and-export.md) adds portable files, and [M13](M13-unsaved-work-drafts-and-recovery.md) completes protection across those workflows. CDN offline styling follow-through belongs to [M14](M14-integration-usability-and-phase-2-review.md).
