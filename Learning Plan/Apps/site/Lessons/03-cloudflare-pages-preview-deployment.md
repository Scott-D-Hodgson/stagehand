# Lesson 3: Cloudflare Pages preview deployment

> “How can I test the public site without changing what visitors already see?” — Priya Preview

[Previous: Landing-page structure and accessibility](02-landing-page-structure.md) | [Course outline](../README.md) | [Next: Custom domains and rollback](04-custom-domains-and-rollback.md)

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

## Next step

The production and preview workflow is now joined by the public domain,
canonical redirect, editor subdomain, and rollback readiness described in
[custom domains and rollback](04-custom-domains-and-rollback.md). Do not put
Cloudflare API tokens or registrar credentials in repository files.

## Check your understanding

1. Why should the Pages project pin the same Hugo version as the development
   container?
2. Why are preview URLs useful before a change reaches `main`?
3. Why should the Hugo build watch path be limited to `apps/site/*`?

[Previous: Landing-page structure and accessibility](02-landing-page-structure.md) | [Course outline](../README.md) | [Next: Custom domains and rollback](04-custom-domains-and-rollback.md)
