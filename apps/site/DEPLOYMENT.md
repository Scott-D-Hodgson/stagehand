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

The Pages project's include path is `apps/site/*`, with no exclude paths. The
trailing wildcard includes nested files and directories, so site content,
layouts, assets, configuration, and future localization changes all trigger a
build. Unrelated editor, package, planning, and development-container changes
do not.

## Deployment behaviour

Cloudflare Pages deploys commits to `main` to the production `pages.dev` URL.
Pull requests originating from this repository receive their own preview
deployment without changing production. The first verified preview was
`https://4125b757.stagehand-site.pages.dev/`; it loaded correctly while the
production URL remained available. The corresponding build used Hugo
`0.170.0`.

## Preview verification

Use a pull request that changes a file under `apps/site/` to verify the Git
integration. Confirm that Cloudflare creates a preview build, GitHub reports
the corresponding check, the unique preview URL loads, and
`https://stagehand-site.pages.dev/` remains unchanged. Check the preview build
log for Hugo `0.170.0` before recording the result as M15 evidence.

## Boundaries

Do not add Cloudflare API tokens, registrar credentials, or other deployment
secrets to this repository. Custom-domain configuration, DNS migration,
`www` redirect behaviour, editor deployment, minimum permissions, and manual
rollback procedures are later M15 work.
