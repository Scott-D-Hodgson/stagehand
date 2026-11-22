# Stagehand web editor

This workspace contains the local-first Stagehand Vue editor. [M8](../../Planning/Work%20Plan/M8-editor-foundation-and-document-state.md) established the Vite, Vue, TypeScript, localization, recovery, and conflict-handling foundation. [M9](../../Planning/Work%20Plan/M9-basic-plan-and-case-authoring.md) added controlled plan and case authoring: editable case references and documents, Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value steps, initial expandable case-reference workspaces, and adjacent reordering. [M10](../../Planning/Work%20Plan/M10-local-import-and-export.md) completed the browser-safe portable ZIP codec, validated protected import, valid-only browser download, and the representative round-trip walkthrough. Early [M11](../../Planning/Work%20Plan/M11-configuration-and-localized-assertions.md) slices add localized assertion values, supported plan/case browser configuration, plan/case/step timeout inheritance, generalized Before/After waits, and the current route-oriented presentation refactor. Remaining assertion options, further step authoring, and execution remain later Phase 2 work.

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

## Cloudflare Pages deployment

The Git-connected `stagehand-editor` Cloudflare Pages project deploys `main`
to `https://stagehand-editor.pages.dev/`. It builds from the repository root
with:

```bash
npm ci && npm run build --workspace @stagehand/web
```

Its output directory is `apps/web/dist`. Set `NODE_VERSION=26.12.1` and
`SKIP_DEPENDENCY_INSTALL=true` in both the Production and Preview
environments, so Cloudflare uses the repository's Node.js version and the
explicit `npm ci` command is the only dependency installation. Its build-watch
includes are `apps/web/*`, `packages/plan-schema/*`, `package.json`,
`package-lock.json`, and `tsconfig.base.json`.

Pull requests from this repository receive a separate preview deployment
without changing production. The first verified editor preview was
`https://caa9ba7c.stagehand-editor.pages.dev/` and used Node.js `26.12.1`.
The editor custom domain is `https://app.getstagehand.ca/`. The owner has
verified its HTTPS static loading and browser-local recovery behaviour, plus
the availability of a previous production deployment to roll back or promote.
The editor's offline-after-load verification remains later work. Do not add
Cloudflare API tokens, registrar credentials, or other deployment secrets to
this repository.

## Current foundation

- Vue 3.5.44, Vite 8.3.6, and TypeScript 6.0.3 are pinned exactly.
- The initial shell imports `validatePlan` through the public
  `@stagehand/plan-schema` entry point.
- Bootstrap 5.3.8 CSS and its bundle are loaded from a CDN. Vue owns editor
  state while Bootstrap owns the demonstrated modal mechanics. This keeps the
  initial presentation lightweight, but a cold offline start is not yet
  supported; M14 owns the offline styling follow-through.
- The Font Awesome kit browser script supplies the current icon set. Its
  `IconOnlyButton.vue` wrapper uses the icon as decoration, preserves the
  localized action name in visually hidden text. Keep an action's accessible
  text even when its button has no visible text. This kit, like the Bootstrap
  CDN dependency, is not available on a cold offline start.
- Vitest 5.1.0 is the selected unit-test runner. Focused tests cover shared
  plan/case validation, affected-step mapping, portable ZIP codec behaviour,
  and browser-selected archive-read failures.
- The Theme selector defaults to the browser light/dark preference. An explicit
  Light or Dark selection is stored under `stagehand.theme-preference` in local
  storage; System removes that override. This interface preference is separate
  from plan data and draft recovery.
- i18next 26.7.2 and i18next-vue 5.4.0 provide Canadian English (`en-CA`,
  default) and Canadian French (`fr-CA`) shell resources. Each locale has its
  own JSON file in `src/localization/locales/`; the selected language is stored
  under `stagehand.interface-language`, separately from plan and recovery data.
- `App.vue` owns application preferences, the active draft, recovery, and the
  breadcrumb shell. Vue Router provides Home (`/`), Plan (`/plan`), Case
  (`/plan/card/:cardIndex`), Step
  (`/plan/card/:cardIndex/step/:stepIndex`), and Wait
  (`/plan/card/:cardIndex/step/:stepIndex/wait/:position/:waitIndex`) contexts.
  The recovery-aware Home
  route offers New, Import, and (only for a discovered readable draft) Recover.
  `Plans/`, `Cases/`, `Steps/`, and `Waits/` divide route-page responsibilities,
  with one editable details component per supported step or wait type and
  reusable dialogs in `components/dialogs/`. Plan Locale uses the
  maintained JSON catalogue. Breadcrumbs expose a contextual Plan Locale menu
  with `en-CA`, `fr-CA`, and any locale found in localized assertions;
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
- The Plan route presents plan settings and responsive Case summary cards. A
  Case route presents that case's settings and responsive Step summary cards.
  Selecting a card navigates to the corresponding Case or Step route; Step
  fields are edited only on their dedicated Step route. Navigate, Click, Type,
  Fill, Select option, Assert text, Assert HTML, and Assert value Steps expose
  a Waits pill with separate Before and After read-only Wait-card lists. Add
  first selects Locator, Page state, or Delay, then opens a type-specific
  validated dialog; only Save adds its card. A card opens a dedicated Wait route
  for later editing. The breadcrumb records Plan, indexed
  Case, indexed action, and a non-link Before or After context for a Wait, so
  browser Back returns from Wait to Step to Case to Plan. Add and Edit use
  Bootstrap dialogs with a
  filename-safe path suggestion; removal of Cases, Steps, Waits, and locale
  overrides requires a
  Bootstrap confirmation dialog. Adjacent move controls reorder Case and Step cards
  immutably and animate their exchanged positions. The v1 recovery adapter
  migrates earlier plan-only drafts by creating empty case documents for their
  retained references. M10.2 can replace the active bundle from a validated
  browser-selected ZIP only after explicit confirmation. M10.3 validates the
  current bundle before it opens a filename-confirmation dialog and requests a
  browser download.
- A full-width status footer appears only for an open plan and reports
  local-save state separately from whether the current draft has unexported
  changes. It follows long content rather than overlaying it, while the page
  shell keeps it at the viewport bottom when content is short. The browser
  communicates a successful download directly.
- A sticky plan-action toolbar groups New, Import/Export/Validate, and View/Edit.
  Import accepts a ZIP candidate, validates it without changing the active draft,
  then always requests confirmation before replacement. Export accepts only a
  valid bundle, asks for a suggested filename, and then uses the browser download
  API. Rejected import and export candidates present localized static dialogs so
  their feedback cannot be missed. New plan collects a filename-safe ID, starts
  with default `en-CA` and no cases, and confirms replacement of changed work
  before the recovered bundle is replaced.
- Plan Browser authors supported Chromium run defaults: headless mode,
  viewport dimensions, and IANA time zone. Case Browser can explicitly override
  the viewport and time zone, beginning from copied effective plan values;
  removing that override restores inheritance without changing unrelated case
  settings. Headless mode remains run-wide and is therefore not a case option.
- Plan Accessibility authors scan enablement, the failure-on-violation policy,
  and axe rule tags from the shared schema catalogue. Case Accessibility can
  explicitly override those values, starting from copied effective plan
  settings and returning to inheritance when cleared. An explicit empty case
  tag list clears the inherited filter and uses axe defaults.
- Plan Overrides can explicitly override Stagehand's built-in 30,000 ms step
  timeout; Case Overrides can override the effective plan value; and each
  supported action or assertion card can provide the final override. Omitted
  plan and case fields remain absent from portable data while the editor shows
  their effective fallback. Locator and page-state wait-list item timeouts
  remain independent. The version 1 schema still accepts an imported Delay-wait
  timeout, but the editor deliberately does not display or edit that redundant
  field; [ATR-043](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-043.md)
  records its future contract removal.
- View/Edit is temporary interface state: it is not saved in a plan or recovery
  record. It affects the settings shown in the current route. Case and Step
  cards remain read-only navigational summaries, while their parent routes
  retain contextual move, edit, clone, and remove controls. View presents plan,
  case, and Step settings through the same Bootstrap-style tab controls with
  plain read-only summaries. Changing modes preserves the selected tab.
- Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and
  Assert value have dedicated Step routes whose fields switch between editable
  controls and read-only summaries. Case-route cards appear as
  numbered Bootstrap summaries. Navigate validates the shared absolute
  HTTP/HTTPS URL rule;
  Click has a constrained Role/Accessible-name locator form, with Role required
  and Accessible name optional. Type uses that locator form plus required literal
  Text, and Fill uses it plus required literal Value. Select option uses the
  same locator plus a deliberate literal Value-or-Label mode, and saves exactly
  one of those fields. Their Overrides panels author the default-enabled
  `scrollIntoView` setting: enabled stays omitted from portable data while an
  explicit disablement writes `false`. Assert text uses that locator and one literal default
  Expected text value. Assert text, Assert HTML, and Assert value have dedicated
  Step-page Locales tabs using the catalogue. They preview the configured Plan Locale
  by emphasizing its matching override, or the default when no override
  matches. Assert HTML uses the same locator, a literal default Expected HTML
  value, and multiline base and override fields. Assert value uses the same
  locator and literal default and override Expected values; its optional
  associated-label check is an optional always-soft assertion with its own
  default and localized expected values.
  Their Overrides panels also author assertion behaviour: Hard omits the
  contract-default `soft` property, while Soft stores `soft: true`; View mode
  summarizes the selected behaviour.
  Variable-backed text and values follow in M12.
  Each step-detail component owns its dedicated route-page fields;
  `StepReferences` coordinates ordered data, dialogs, and draft updates for
  Case-route cards. Add, Edit, Clone, Remove, and adjacent Promote/Demote
  controls preserve
  recovery and confirmation behaviour. Reordered step and reference cards
  animate into their new positions; the first and last cards disable the
  unavailable direction. The shared case validator identifies invalid authored
  steps through their issue paths. A Case card with an invalid step has a red
  border, while the Step page provides the field-level editing context.
  The dialog components live in `src/components/dialogs/`; Bootstrap focuses
  their first control after opening, retains a static backdrop, and completes
  hide cleanup before Vue removes them. Secondary dialog actions use Bootstrap
  outlined styling while Save, Create, Download, and destructive confirmations
  retain primary semantic emphasis. Step data is part of the recovered editor
  bundle. A two-tab conflict opens a blocking resolution dialog; the author
  must discard paused local edits or replace the newer saved draft before
  continuing.
- Plan, Case, Step, and Wait settings use local mini-forms: field edits remain
  local until a valid **Apply** action updates the editor draft. Apply remains
  disabled for invalid data and fields show feedback on blur. Step and Wait
  routes block navigation away from valid unapplied edits until the author
  discards or applies them. A Bootstrap toast in the application shell confirms
  an applied Step or Wait change; Wait Apply remains on the Wait route so Return
  is explicit.
