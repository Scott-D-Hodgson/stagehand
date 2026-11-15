# Lesson 4: Custom domains and rollback

> “A deployment is only truly public when visitors can find it—and only truly safe when we can undo a bad release.” — Casey Cache

[Previous: Cloudflare Pages preview deployment](03-cloudflare-pages-preview-deployment.md) | [Course outline](../README.md)

## Goal

Understand how Stagehand's public hostnames map to two static Pages projects,
why `www` redirects to the canonical site, and how a static release is rolled
back without touching locally stored editor data.

## What is implemented

Cloudflare is authoritative for `getstagehand.ca`. The public Hugo site uses
`https://getstagehand.ca/` as its canonical address. A proxied
`www.getstagehand.ca` record receives requests so a permanent Cloudflare rule
can redirect them to the apex while retaining the requested path and query
string. The separately deployed editor uses
`https://app.getstagehand.ca/`.

The two addresses intentionally lead to different static applications:

- The apex explains the Stagehand project.
- The `app` subdomain serves editor assets only; it does not turn the editor
  into an account service or move plan data to a server.

If a release must be undone, open the relevant Pages project's deployment
history, select the last known-good production deployment, and use Cloudflare's
available rollback or promote action. Then check both the custom domain and the
project's `pages.dev` address. That changes the static files served to future
visitors; it does not alter an editor draft saved in a browser's IndexedDB.

## Practice

1. Open `https://getstagehand.ca/` and confirm the certificate and landing
   page load.
2. Open `https://www.getstagehand.ca/a-path?source=practice` and confirm it
   reaches the apex with the path and query string retained.
3. Open `https://app.getstagehand.ca/` and confirm the editor loads.
4. In each Pages project, locate a previous successful production deployment
   and identify its rollback or promote action without activating it.
5. Review [deployment guidance](../../../../apps/site/DEPLOYMENT.md) and name
   one item that must remain outside the repository.

## Readiness check

You are ready to manage a small public-site change when you can explain why a
proxied hostname is needed for the redirect, distinguish a Pages deployment
rollback from a nameserver rollback, and verify both public projects after a
deployment change.

[Previous: Cloudflare Pages preview deployment](03-cloudflare-pages-preview-deployment.md) | [Course outline](../README.md)
