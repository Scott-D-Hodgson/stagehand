# Lesson 3: Cloudflare Pages preview deployment

## Goal

Understand the Git-connected Cloudflare Pages configuration for the Hugo site
and the difference between its production and pull-request preview deployments.

## What is implemented

The `stagehand-site` Pages project deploys `main` to
`https://stagehand-site.pages.dev/`. It builds from `apps/site/` with
`hugo --minify`, publishes `public/`, and pins Hugo `0.170.0` through
`HUGO_VERSION` in both Production and Preview environments.

Pull requests from this repository receive a distinct hash-based preview URL.
The first verified preview was
`https://4125b757.stagehand-site.pages.dev/`. It loaded successfully without
changing production. The project uses `apps/site/*` as its build-watch include
path, so unrelated monorepo changes do not trigger Hugo builds.

## Practice

1. Open the Pages project and find the production deployment for `main`.
2. Open a pull request with a change under `apps/site/`.
3. Confirm a Cloudflare check appears on the pull request and open the preview
   URL.
4. Confirm the preview build log reports Hugo `0.170.0`.
5. Confirm the production `pages.dev` URL is unchanged.

## Boundaries

The `pages.dev` deployment does not attach `getstagehand.ca`, configure the
`www` redirect, deploy the editor, or define a rollback procedure. Those tasks
remain later M15 work. Do not put Cloudflare API tokens or registrar credentials
in repository files.

## Check your understanding

1. Why should the Pages project pin the same Hugo version as the development
   container?
2. Why are preview URLs useful before a change reaches `main`?
3. Why should the Hugo build watch path be limited to `apps/site/*`?
