# Lesson 31: Cloudflare Pages editor deployment

## Goal

Understand how the editor is built and previewed on Cloudflare Pages without
changing its local-first product boundary.

## What is implemented

The Git-connected `stagehand-editor` Pages project deploys `main` to
`https://stagehand-editor.pages.dev/`. It starts at the repository root and
runs:

```bash
npm ci && npm run build --workspace @stagehand/web
```

The resulting static output is `apps/web/dist`. Cloudflare uses
`NODE_VERSION=26.12.1` and `SKIP_DEPENDENCY_INSTALL=true` in both Production
and Preview environments, so the explicit `npm ci` command remains the only
dependency installation.

The project watches `apps/web/*`, `packages/plan-schema/*`, `package.json`,
`package-lock.json`, and `tsconfig.base.json`. This captures the editor and its
browser-safe contract dependency while avoiding deployments for unrelated
repository changes. The first verified preview was
`https://caa9ba7c.stagehand-editor.pages.dev/`.

## Practice

1. Open the Pages project and inspect its production build for `main`.
2. Open a pull request containing an editor-source or editor-documentation
   change.
3. Confirm the Cloudflare check creates a distinct preview URL.
4. Confirm the build log uses Node.js `26.12.1` and that the preview editor
   loads normally.
5. Confirm production remains unchanged until the pull request merges.

## Boundaries

The Pages project publishes static editor assets only. It does not introduce a
Stagehand account, central plan storage, remote browser execution, or a hosted
plan service. `app.getstagehand.ca`, DNS migration, manual rollback evidence,
and offline-after-load verification remain later work.

## Check your understanding

1. Why must the editor Pages project build from the repository root instead of
   `apps/web/`?
2. Why is `SKIP_DEPENDENCY_INSTALL=true` paired with the explicit `npm ci`
   command?
3. Why are a Pages preview and the planned editor custom domain separate
   verification steps?
