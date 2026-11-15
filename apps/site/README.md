# Stagehand public site

This Hugo site provides the public landing page for Stagehand. Its canonical
production address is `https://getstagehand.ca/`.

## Local development

The development container pins Hugo in `.devcontainer/Dockerfile`. Confirm the
available version from the repository root:

```bash
hugo version
```

Start a local development server with draft content included:

```bash
hugo server --source apps/site --buildDrafts
```

Hugo prints the local address, normally `http://localhost:1313/`. Stop it with
`Ctrl+C`.

Build the production site locally:

```bash
hugo --source apps/site --minify
```

The generated output is `apps/site/public/`, which is ignored and must not be
committed.

## Deployment boundary

Cloudflare Pages deployment, preview behaviour, custom-domain configuration,
and rollback procedures are deliberately documented and configured in later
M15 slices. Do not add Cloudflare API tokens, registrar credentials, or other
deployment secrets to this repository.
