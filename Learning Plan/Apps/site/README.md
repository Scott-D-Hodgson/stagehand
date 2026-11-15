# Course: Stagehand public site

This course introduces the Hugo public site at `apps/site/`, from its local
landing-page foundation through its public Cloudflare deployment.

## In this course you will learn

- How Hugo turns Markdown content and templates into a static website.
- How the development container pins the Hugo version for repeatable local
  builds.
- How the landing page preserves Stagehand's local-first boundary in public
  copy.
- How Cloudflare Pages previews, custom domains, canonical redirects, and
  deployment rollback fit together.

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
4. [Custom domains and rollback](Lessons/04-custom-domains-and-rollback.md)

## Current boundary

The local Hugo site, Canadian-English landing page, Cloudflare Pages
production deployment, pull-request previews, custom domain, canonical `www`
redirect, and deployment rollback readiness are implemented. The editor is
separately available at `app.getstagehand.ca`. Do not infer a hosted service,
account system, central plan storage, or remote browser execution from the
public landing page.

Finish the implemented lessons, then verify the local preview and production
build before proposing a public-site change.
