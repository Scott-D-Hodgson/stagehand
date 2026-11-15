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

## Custom domains

Cloudflare is the authoritative DNS provider for `getstagehand.ca`.

- `https://getstagehand.ca/` is the canonical public-site address.
- `https://www.getstagehand.ca/` uses a proxied CNAME and a permanent
  Cloudflare redirect to the apex, preserving the requested path and query
  string.
- `https://app.getstagehand.ca/` is attached to the separate
  `stagehand-editor` Pages project.

Verify the apex, `www` redirect, and editor over HTTPS after any DNS,
redirect-rule, or Pages-domain change. Do not create a conflicting DNS record
for `www` merely to support the redirect.

## Rollback and access

For a release rollback, open the affected Pages project's deployment history,
select the last known-good production deployment, and use its rollback or
promote action. Verify the relevant custom domain and `pages.dev` URL after
the change. The owner verified that this action is available for both Pages
projects; it was not exercised against production.

Cloudflare access should be limited to the narrowest role that can manage the
project's DNS and redirect rule, its Pages custom domain, and its deployment
history. Git-connected Pages deployment requires no repository API token.
Never add Cloudflare API tokens, registrar credentials, or other deployment
secrets to this repository. A registrar nameserver rollback is not an
immediate substitute for Pages rollback because the prior registrar zone held
only parking records.
