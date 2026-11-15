# M15 — Public website and static deployment

**Status:** In progress; Hugo foundation and landing content complete locally, deployment work remains
**Estimate:** 3–5 focused human person-days  
**Depends on:** [M8](M8-editor-foundation-and-document-state.md) for the deployable editor build; the Hugo landing-site work may proceed alongside M9–M13

## Objective

Establish a small public project website and a repeatable static deployment path
for both the Hugo site and the local-first editor, without representing the
editor as a hosted account service or weakening its local-first boundary.

## Tasks

- [x] Create a Hugo site at `apps/site/` with documented local build and preview commands.
- [x] Deliver one accessible, responsive landing page that explains Stagehand's purpose, local-first boundary, current development status, and links to the source repository and project documentation.
- [x] Keep the initial landing-page content in Canadian English; record any future public-site localization scope before adding French content or language switching.
- [ ] Configure a Cloudflare Pages project for the Hugo site: repository-root directory `apps/site/`, `hugo --minify` build command, `public` output directory, and an explicitly pinned `HUGO_VERSION`.
- [ ] Configure a separate Cloudflare Pages project for the editor: repository-root build context, `npm ci && npm run build --workspace @stagehand/web` build command, and `apps/web/dist` output directory.
- [ ] Connect both Pages projects to the repository so `main` deploys production and pull requests receive preview deployments; document the observed branch and rollback behaviour.
- [ ] Move the project domain's authoritative nameservers to Cloudflare, then attach the apex domain to the Hugo project, redirect `www` to the apex, and attach `app.<project-domain>` to the editor project.
- [ ] Verify HTTPS, canonical-host redirects, production and preview URLs, build logs, and the editor's static asset loading. Record the actual domains only where the owner authorizes their publication.
- [ ] Document deployment ownership, the minimum Cloudflare permissions, secret/configuration boundaries, and a manual rollback procedure. Do not commit API tokens or registrar credentials.

## Deliverables and completion evidence

A visitor can reach the landing page at the project apex domain over HTTPS, a
`www` request reaches the same canonical site, and the editor is available at
`app.<project-domain>`. A pull request has an isolated preview deployment and
a documented production rollback path. Local and Cloudflare build output agree
for both static projects.

Record the exact build commands, Hugo version, deployment identifiers or URLs
that are safe to publish, verification date, browser, and observed redirect
behaviour. Cloudflare dashboard configuration is operational evidence, not a
substitute for repository documentation. Follow the Phase 2 presentation
baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md).

## Current implementation evidence

The Hugo foundation and landing-content slice uses Hugo `v0.170.0`, pinned in
the development-container image. The owner ran `hugo version`, built the site
with `hugo --source apps/site --minify`, and manually checked the local preview
at its responsive layouts, keyboard skip link, colour modes, and public links.
The generated `public/` directory is ignored. This is local evidence only; no
Cloudflare Pages project, preview deployment, DNS change, or public-domain
verification has occurred yet.

## Incremental delivery

Suggested PR slices: Hugo foundation and landing content; Hugo Pages preview
deployment; editor Pages deployment; domain, redirect, and rollback verification.
Keep each external configuration change paired with its corresponding
repository documentation.

## Decisions made

- The public Hugo site uses the project apex domain as its canonical hostname.
- `www` redirects to the apex domain.
- The editor uses `app.<project-domain>` on a separate Cloudflare Pages project.
- The owner will move the domain from registrar-managed DNS to Cloudflare
  nameservers before custom-domain activation.
- Cloudflare Pages is the accepted initial static-hosting platform. The
  deployment remains static; it does not introduce accounts, a Stagehand
  backend, remote plan storage, or browser execution.
- The public site canonical hostname is `getstagehand.ca`; `www.getstagehand.ca`
  will redirect to it, and `app.getstagehand.ca` remains reserved for the
  separately deployed editor.
- The initial landing page uses custom, dependency-free responsive CSS rather
  than a theme, logo, or illustration. It supports browser light and dark
  colour preferences.

## Open decisions and exclusions

Public-site localization scope remains open; French content and language
switching are deferred until that scope is explicitly accepted. Custom email,
analytics, contact forms, account features, a content management system, and
dynamic server-side functionality are out of scope.

The editor's offline-after-load verification and replacement of CDN-hosted
Bootstrap styling remain M14 work. Do not treat a successful Cloudflare
deployment as evidence that those offline requirements are satisfied.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.

## Learning plan reference

- [Public site course](../../Learning%20Plan/Apps/site/README.md)
