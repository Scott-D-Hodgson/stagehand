# Lesson 1: Hugo site foundation

## Goal

Understand where the public site lives, how Hugo is supplied by the development
container, and how to produce a local static build.

## What is implemented

`apps/site/` is a Hugo site. Its `hugo.yaml` holds the canonical production
URL, Canadian English language code, site title, and public project links.
The development-container Dockerfile pins Hugo `0.170.0`; the site therefore
does not rely on whichever Hugo version happens to be available through a Linux
package repository.

The canonical public URL is `https://getstagehand.ca/`. Its Cloudflare custom
domain is active; the configuration keeps local Hugo output aligned with the
published address.

## Practice

From the repository root, confirm the installed Hugo version:

```bash
hugo version
```

Create a production build:

```bash
hugo --source apps/site --minify
```

Hugo writes generated files to `apps/site/public/`. That output is ignored and
must not be committed. Start the local preview when you need to inspect the
site in a browser:

```bash
hugo server --source apps/site --buildDrafts
```

## Check your understanding

1. Why is `HUGO_VERSION` pinned in the development-container image instead of
   installing Hugo interactively?
2. Why is a successful local build alone not evidence that a hosted deployment
   or the custom production domain works?

## Next lesson

Continue to [Landing-page structure and accessibility](02-landing-page-structure.md).
