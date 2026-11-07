# Stagehand web editor

This workspace contains the local-first Stagehand Vue editor. M8.1 establishes
the Vite, Vue, and TypeScript application foundation. The current M8.2 slice
adds one synthetic plan draft with raw plan-locale editing; form authoring,
imported files, browser recovery, and execution remain later Phase 2 work.

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
- Bootstrap 5.3.8 CSS is loaded from a CDN. No Bootstrap JavaScript is used.
  This keeps the initial presentation lightweight, but a cold offline start is
  not yet supported; M14 owns the offline styling follow-through.
- Vitest 5.1.0 is the selected unit-test runner. The first shared-validation
  boundary has focused valid/invalid-plan unit tests.
- The Theme selector defaults to the browser light/dark preference. An explicit
  Light or Dark selection is stored under `stagehand.theme-preference` in local
  storage; System removes that override. This interface preference is separate
  from plan data and draft recovery.
- i18next 26.7.2 and i18next-vue 5.4.0 provide Canadian English (`en-CA`,
  default) and Canadian French (`fr-CA`) shell resources. Each locale has its
  own JSON file in `src/localization/locales/`; the selected language is stored
  under `stagehand.interface-language`, separately from plan and recovery data.
- `App.vue` owns application preferences and the active draft. `AppHeader`
  owns shell controls; `PlanBundle` composes the plan details, case references,
  and shared-contract assessment. The current draft deliberately preserves raw
  plan-locale input so shared validation can report invalid values rather than
  silently changing them.
