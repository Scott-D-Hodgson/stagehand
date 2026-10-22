# Contributing to Stagehand

Thanks for considering a contribution. Stagehand is still taking shape, so a clear pull request (PR) and a careful look at the changes are more useful than ceremony for ceremony's sake.

## Propose a change

1. Create a branch for your change; do not push directly to `main`.
2. Keep the change focused and explain what it changes and why.
3. Open a PR to `main` and fill in the sections of the [PR template](.github/pull_request_template.md). The template is copied into the PR description by GitHub; it is not attached as a file to each PR.
4. List the checks you ran and their results. If a check was not applicable or could not be run, say so.
5. Address PR comments and resolve conversations before merging.

## Development toolchain

Use Node.js 26.12.1 and npm 11.20.0 for repository work. The Node.js version is recorded in `.nvmrc`; the root `package.json` declares the expected Node.js and npm versions and the package manager. With `nvm`, select the version using `nvm install 26.12.1` and `nvm use 26.12.1`. Confirm the versions with `node --version` and `npm --version`, then install the workspace dependencies with `npm ci`.

Keep Node.js on a supported LTS release. Update the Node.js and npm pins together in a PR when adopting a newer supported patch release or LTS line. Update `.nvmrc`, the root `package.json`, and the lockfile together, then verify a clean install with the new versions. When the development container and CI are added, update their pins in the same change so the environments stay aligned.

## Self-review your PR

Before asking for review or merging your own PR:

- Read the complete diff in GitHub, including files you did not expect to change.
- Check for accidental, unrelated, generated, or machine-specific files.
- Update relevant documentation and examples.
- Run the applicable checks and record their results in the PR description.
- Confirm that the change contains no credentials, real secrets, or private data.
- Resolve open PR conversations.

The repository owner currently works alone. GitHub does not count an author's approval as an independent review of their own PR, so the documented solo-phase policy is zero required approvals. The owner uses the PR checklist as a manual self-review. It is a useful pause, not a second reviewer or an automated gate. M0 records this setting, but the current effective ruleset configuration has not been verified as active.

## Review a contributor PR

While the owner is the only maintainer, the owner reviews PRs from other contributors before merging:

1. Check the PR's purpose, full diff, and reported checks.
2. Leave comments or request changes for anything that needs attention.
3. Review the updated diff after changes are pushed, and confirm the conversations are resolved.
4. Submit an approval when satisfied, then squash-merge the PR.

## Merge methods

The documented merge convention is to use merge commits for the owner's PRs so the owner's individual commits remain visible in `main`'s history. PRs from other contributors are generally squash-merged so their incremental commits are grouped into one commit on `main`. M0 records that merge commits and squash merging were enabled and rebase merging disabled; the current effective settings have not been verified as active. GitHub does not select or enforce the method based on who authored a PR; choose the appropriate method when merging.

## When independent reviewers join

When trusted reviewers are available, update the `Protect main` ruleset to require at least one approval from someone other than the PR author. Consider dismissing stale approvals or requiring approval of the latest reviewable push. Keep the self-review checklist; independent review supplements it.

## Keep the repository safe

Do not commit credentials, real secrets, private customer data, or sensitive test data. Use synthetic examples. Keep sensitive security details out of public issues and PRs.
