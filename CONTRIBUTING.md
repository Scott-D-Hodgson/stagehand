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

Keep Node.js on a supported LTS release. Update the Node.js and npm pins together in a PR when adopting a newer supported patch release or LTS line. Update `.nvmrc`, the root `package.json`, the lockfile, and `.devcontainer/Dockerfile` together; update any CI workflow pins when those workflows are added. Verify a clean install with the new versions so the environments stay aligned.

The planned development environment uses Docker Desktop with WSL 2 on Windows. Contributors using Docker Desktop for commercial work on behalf of an organisation should check Docker's current [Docker Desktop licensing terms](https://docs.docker.com/desktop/setup/install/windows-install/): commercial use in an organisation with more than 250 employees or more than US$10 million in annual revenue requires a paid subscription. Docker's terms can change; contributors are responsible for confirming that their use is covered.

To use the Linux development container, install the VS Code Dev Containers extension, start Docker Desktop with its WSL 2 backend, open the repository in VS Code, and run **Dev Containers: Reopen in Container** from the Command Palette. The first container creation runs `npm ci`. The container includes Git with `core.autocrlf=true` to match the Windows checkout's line endings. Check the toolchain with `node --version`, `npm --version`, `git status`, and `npm ls --workspaces --depth=0` inside the container.

The initial container does not install Chromium. When `@stagehand/runner-core` adds and pins Playwright, use that same project-pinned Playwright CLI to install Chromium and its Linux system dependencies (for example, `npx playwright install --with-deps chromium`). Do not add a separately versioned Playwright CLI to the container. The system-dependency installation needs the privileges required to install OS packages. This development setup does not change the MVP's Windows runner focus; Linux runner support remains post-MVP.

The GitHub Actions workflow runs on pull requests targeting `main` and pushes to `main`. It checks the pinned Node.js/npm versions, installs and lists the workspaces, runs the plan-schema package tests (which build the package), validates the Dev Container JSON, and builds the container image. Reproduce these checks locally from the repository root with the pinned toolchain and Docker available: `npm ci`, `npm ls --workspaces --depth=0`, `npm test --workspace @stagehand/plan-schema`, `node -e "JSON.parse(require('node:fs').readFileSync('.devcontainer/devcontainer.json', 'utf8'))"`, and `docker build --file .devcontainer/Dockerfile --tag stagehand-devcontainer:local .devcontainer`.

The repository folder is mounted into the container, so files and uncommitted changes remain in the same checkout. VS Code runs on the host while terminal commands run in the container. The project does not prescribe personal editor extensions; install them in the environment where you want them to run. Use the Source Control view or `git status` to see the mounted checkout's changes.

## Architecture and code changes

The implementation is being built incrementally. `packages/plan-schema` contains the initial plan and case JSON Schemas and synchronous runtime schema validators with package tests; semantic validation and execution are not implemented. `apps/cli/`, `apps/web/`, and the other packages remain workspace scaffolds. Use TypeScript for new implementation code and keep schemas and synthetic plan/case documents as JSON data. Before changing package boundaries or shared contracts, read the [repository map](Planning/Repository/structure.md) and the relevant decisions and milestones linked from [Planning](Planning/README.md). Keep package responsibilities and dependency direction consistent with those decisions.

No general formatting or lint configuration has been established yet. Follow the conventions of the files you are changing, keep changes focused, and avoid adding abstractions or tooling without a concrete need. Run the schema package build and tests with `npm test --workspace @stagehand/plan-schema`. Semantic validation, other package builds, application checks, and lint are not available yet; add checks as their implementation milestones introduce runnable behaviour.

## Troubleshooting the development container

- **Container start reports `distro mount service` or a missing `ubuntu.sock`:** make sure Docker Desktop is running with WSL 2 enabled and that WSL integration is enabled for the Ubuntu distribution in Docker Desktop settings. Apply the setting, restart Docker Desktop if prompted, then run **Dev Containers: Reopen in Container** again.
- **`git status` shows many or all files as modified inside the container:** check `git config --show-origin --get core.autocrlf`; the container should report `true`. If the Dockerfile setting has changed or the current container predates it, run **Dev Containers: Rebuild Container** and check again.
- **Node.js or npm versions do not match the pins:** run `node --version` and `npm --version` in the same terminal where you are working. Host and container terminals use different installations; inside the container, rebuild it after changing the Dockerfile pins.
- **Workspace installation or listing fails:** from the repository root, confirm the pinned versions and run `npm ci`, then `npm ls --workspaces --depth=0`. To build and test the schema package, run `npm test --workspace @stagehand/plan-schema`; application tests and lint are not available yet.

## Self-review your PR

Before asking for review or merging your own PR:

- Read the complete diff in GitHub, including files you did not expect to change.
- Check for accidental, unrelated, generated, or machine-specific files.
- Update relevant documentation and examples.
- Run the applicable checks and record their results in the PR description.
- Confirm that the change contains no credentials, real secrets, or private data.
- Resolve open PR conversations.

The repository owner currently works alone. GitHub does not count an author's approval as an independent review of their own PR, so the documented solo-phase policy is zero required approvals. The owner uses the PR checklist as a manual self-review. It is a useful pause, not a second reviewer or an automated gate.

## Review a contributor PR

While the owner is the only maintainer, the owner reviews PRs from other contributors before merging:

1. Check the PR's purpose, full diff, and reported checks.
2. Leave comments or request changes for anything that needs attention.
3. Review the updated diff after changes are pushed, and confirm the conversations are resolved.
4. Submit an approval when satisfied, then squash-merge the PR.

## Merge methods

The documented merge convention is to use merge commits for the owner's PRs so the owner's individual commits remain visible in `main`'s history. PRs from other contributors are generally squash-merged so their incremental commits are grouped into one commit on `main`. M0 records that merge commits and squash merging were enabled and rebase merging disabled. GitHub does not select or enforce the method based on who authored a PR; choose the appropriate method when merging.

## When independent reviewers join

When trusted reviewers are available, update the `Protect main` ruleset to require at least one approval from someone other than the PR author. Consider dismissing stale approvals or requiring approval of the latest reviewable push. Keep the self-review checklist; independent review supplements it.

## Keep the repository safe

Do not commit credentials, real secrets, private customer data, or sensitive test data. Use synthetic examples. Keep sensitive security details out of public issues and PRs. Store sign-in data in a user-level credential store or the relevant tool's user home directory, outside the project checkout. Treat file-based authentication caches as secrets. `.gitignore` only filters matching untracked paths inside the repository: it does not secure credentials stored elsewhere or remove files already tracked by Git.
