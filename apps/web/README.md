# Stagehand web editor

This workspace contains the local-first Stagehand Vue editor. [M8](../../Planning/Work%20Plan/M8-editor-foundation-and-document-state.md) established the Vite, Vue, TypeScript, localization, recovery, and conflict-handling foundation. The current [M9](../../Planning/Work%20Plan/M9-basic-plan-and-case-authoring.md) slices add controlled plan and case authoring: editable case references and documents, Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value steps, expandable case-reference workspaces, and adjacent reordering. Complete step authoring, imported files, and execution remain later Phase 2 work.

## Commands

Run these commands from the repository root:

- `npm run dev --workspace @stagehand/web` starts the Vite development server.
- In a development container, append `-- --host 0.0.0.0`, forward port 5173,
  and use the forwarded browser URL for a visual check.
- The Vite server uses polling so edits made through the shared development
  workspace trigger a reliable live reload in the container.
- `npm run type-check --workspace @stagehand/web` checks the Vue and TypeScript source.
- `npm test --workspace @stagehand/web` runs the editor unit tests once.
- `npm run test:watch --workspace @stagehand/web` starts Vitest in watch mode.
- `npm run build --workspace @stagehand/web` builds `@stagehand/plan-schema`,
  type-checks the editor, and creates the production bundle in `dist/`.
- `npm run preview --workspace @stagehand/web` serves an existing production
  bundle for local inspection.

## Current foundation

- Vue 3.5.44, Vite 8.3.6, and TypeScript 6.0.3 are pinned exactly.
- The initial shell imports `validatePlan` through the public
  `@stagehand/plan-schema` entry point.
- Bootstrap 5.3.8 CSS and its bundle are loaded from a CDN. Vue owns editor
  state while Bootstrap owns the demonstrated modal mechanics. This keeps the
  initial presentation lightweight, but a cold offline start is not yet
  supported; M14 owns the offline styling follow-through.
- Vitest 5.1.0 is the selected unit-test runner. Focused validation tests cover
  valid/invalid plans and the mapping from shared case-validation issue paths
  to unique affected step indexes.
- The Theme selector defaults to the browser light/dark preference. An explicit
  Light or Dark selection is stored under `stagehand.theme-preference` in local
  storage; System removes that override. This interface preference is separate
  from plan data and draft recovery.
- i18next 26.7.2 and i18next-vue 5.4.0 provide Canadian English (`en-CA`,
  default) and Canadian French (`fr-CA`) shell resources. Each locale has its
  own JSON file in `src/localization/locales/`; the selected language is stored
  under `stagehand.interface-language`, separately from plan and recovery data.
- `App.vue` owns application preferences and the active draft. `AppHeader`
  provides the sticky Stagehand heading, tagline, and shell controls;
  `PlanBundle` composes the plan details, case-reference workspaces, and
  shared-contract assessment. Plan Locale uses the maintained JSON catalogue;
  it is separate from the remembered interface language. An out-of-catalogue
  recovered value remains visible as a disabled current option rather than
  being silently changed.
- `src/recovery/draft-storage.ts` defines the browser-storage boundary and its
  IndexedDB adapter for one versioned recovery record. On startup, the recovery
  gate offers Restore or Discard for a readable copy and requires explicit
  discard for unreadable data. Once resolved, autosave writes a plain draft
  snapshot one second after the latest edit and reports saving, saved, or failed
  local status. Conditional IndexedDB writes detect multiple-tab conflicts;
  the affected tab pauses autosave until the author discards local edits or
  explicitly replaces the saved draft.
- `PlanBundle` composes case-reference workspaces inside Plan details. A
  reference-card header expands or collapses its case; only one case workspace
  is open at a time. Collapsed cards show localized 0/1/many step wording;
  the expanded card contains the independently stored Case ID, steps, and
  authoring controls. Add and Edit use a Bootstrap dialog with a filename-safe
  path suggestion; removal and sample reset require a Bootstrap confirmation
  dialog. Adjacent move controls reorder reference cards immutably and animate
  their exchanged positions. The expanded card uses Bootstrap theme-aware
  active styling, and its action controls do not toggle the workspace. The v1
  recovery adapter migrates earlier plan-only drafts by creating empty case
  documents for their retained references. Plan/case data remains draft-only
  until M10 adds export.
- A full-width fixed status footer announces the local-save state. Its current
  placement can overlap the final controls on a long page; revisit that layout
  in a later M9 UI slice.
- A sticky plan-action bar provides New plan and Reset sample. New plan collects
  a filename-safe ID, starts with default `en-CA` and no cases, and confirms
  replacement of changed work before the recovered bundle is replaced.
- An expanded case-reference workspace supports Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value steps. Steps appear as numbered
  Bootstrap cards. Navigate validates the shared absolute HTTP/HTTPS URL rule;
  Click has a constrained Role/Accessible-name locator form, with Role required
  and Accessible name optional. Type uses that locator form plus required literal
  Text, and Fill uses it plus required literal Value. Select option uses the
  same locator plus a deliberate literal Value-or-Label mode, and saves exactly
  one of those fields. Assert text uses that locator and one literal default
  Expected text value. Assert text also has a card-level Locale overrides panel
  using the catalogue. It previews the configured Plan Locale by emphasizing
  its matching override, or the default when no override matches. Assert HTML
  uses the same locator, a literal default
  Expected HTML value, and a multiline field. Assert value uses the same
  locator and a literal default Expected value; its optional associated-label
  check has no editor form yet. Localized expected values for Assert HTML and
  Assert value remain M11 work.
  Variable-backed text and values follow in M12. Click, Type, Fill, Select
  option, Assert text, Assert HTML, and Assert value share `LocatorFields.vue`
  for their target fields, but retain their action-specific dialogs and
  validation.
  Add, Edit, Clone, Remove, and adjacent Move up/Move down controls preserve
  recovery and confirmation behaviour. Reordered step and reference cards
  animate into their new positions; the first and last cards disable the
  unavailable direction. The shared case validator identifies invalid authored
  steps through their issue paths. The expanded case shows a concise localized
  summary and an actionable message on each affected step card; its enclosing
  reference card has a red border, including while collapsed.
  The dialog components live in `src/components/dialogs/`; Bootstrap focuses
  their first control after opening, retains a static backdrop, and completes
  hide cleanup before Vue removes them. Step data is part of the recovered editor
  bundle.
