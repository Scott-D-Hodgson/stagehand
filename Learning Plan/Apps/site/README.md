# Course: Stagehand public site

This course introduces the Hugo public site at `apps/site/`. It begins with
the local landing-page foundation and keeps deployment learning separate from
unverified Cloudflare configuration.

## In this course you will learn

- How Hugo turns Markdown content and templates into a static website.
- How the development container pins the Hugo version for repeatable local
  builds.
- How the landing page preserves Stagehand's local-first boundary in public
  copy.
- How later Cloudflare Pages, preview, custom-domain, and rollback work fit
  into the delivery plan.

## Do I need this course?

- [ ] I am changing public-site content, templates, or styling.
- [ ] I need to preview or build the Hugo site locally.
- [ ] I will configure Cloudflare Pages or the public domain in a later M15
  slice.

## Prerequisites

Complete the repository-development environment lesson. The Hugo executable is
pinned in the development-container image; confirm it with `hugo version`
before working on the site.

## Lessons

1. [Hugo site foundation](Lessons/01-hugo-site-foundation.md)
2. [Landing-page structure and accessibility](Lessons/02-landing-page-structure.md)
3. [Cloudflare Pages preview deployment](Lessons/03-cloudflare-pages-preview-deployment.md)
4. Custom domains and rollback — future M15 slice

## Current boundary

The local Hugo site, Canadian-English landing page, Cloudflare Pages
production deployment, and pull-request previews are implemented. HTTPS on the
`pages.dev` address is supplied by Pages; custom-domain setup, editor
deployment, and rollback evidence remain future work. Do not infer a hosted
service, account system, central plan storage, or remote browser execution from
the public landing page.

Finish the implemented lessons, then verify the local preview and production
build before proposing a public-site change.
