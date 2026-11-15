# Public-site deployment

The Stagehand public site is deployed as the `stagehand-site` Cloudflare Pages
project. Its initial production address is
`https://stagehand-site.pages.dev/`.

## Hugo Pages configuration

Configure the Git-connected Pages project with these values:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `apps/site` |
| Build command | `hugo --minify` |
| Build output directory | `public` |
| Hugo version | `0.170.0` |

Set `HUGO_VERSION=0.170.0` in both the Production and Preview environments.
The Pages configuration must match the version pinned in
`.devcontainer/Dockerfile`.

## Build watch paths

Set the Pages project's include path to `apps/site/*` and leave its exclude
paths empty. The trailing wildcard includes nested files and directories, so
site content, layouts, assets, configuration, and future localization changes
all trigger a build. Unrelated editor, package, planning, and development-
container changes do not.

## Deployment behaviour

Cloudflare Pages deploys commits to `main` to the production `pages.dev` URL.
Pull requests originating from this repository should receive their own preview
deployment without changing production. Record the observed preview URL and
status-check behaviour in the M15 work plan after the first successful
verification.

## Boundaries

Do not add Cloudflare API tokens, registrar credentials, or other deployment
secrets to this repository. Custom-domain configuration, DNS migration,
`www` redirect behaviour, editor deployment, minimum permissions, and manual
rollback procedures are later M15 work.
