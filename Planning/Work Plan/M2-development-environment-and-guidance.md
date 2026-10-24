# M2 — Development environment and contributor/agent guidance

**Estimate:** 3–5 person-days  
**Depends on:** M0, M1  
**Roadmap item:** Development container and contributor/agent guidance

## Tasks

- [x] Identify required tools and record the initial local baseline for the current repository: Node.js 26.12.1, npm 11.20.0, WSL 3.0.3.0 with Ubuntu on WSL 2, and Docker Desktop 4.96.3 (Docker CLI/Engine 29.9.2). These are observed versions, not minimum supported versions; define container requirements with the configuration.
- [x] Pin Node.js 26.12.1 and npm 11.20.0, and document how the pinned versions will be updated. [Node.js release guidance](https://nodejs.org/en/about/previous-releases/) recommends Active or Maintenance LTS for production applications.
- [x] Document runner OS/browser support separately from the development-container OS: focus initial CLI validation on Windows with Playwright-managed Chromium, schedule Linux runner support after the MVP, and keep Edge as a later browser expansion. During development, prefer designs that work on both Windows and Linux when practical.
- [x] Add a Linux-based development container definition and pin the critical tools; treat its OS separately from the runner support matrix.
  - Initial `.devcontainer/devcontainer.json` and Dockerfile use Node.js 26.12.1, npm 11.20.0, Git, and `npm ci` on first creation. The container does not prescribe personal editor extensions. The owner confirmed that VS Code opens the container, the project loads, Git commands respond, Node.js is `v26.12.1`, npm is `11.20.0`, and `npm ls --workspaces --depth=0` resolves all seven workspaces.
  - The repository is mounted at `/workspaces/stagehand`; the container's `/home/node` is not mounted from the host. Document that tools may keep credentials in a user-level credential store or user home, and that `.gitignore` only filters files within the repository—it is not a credential store or a way to secure files outside the repository.
- [x] Document the Playwright/Chromium dependency and setup approach for the development container, even though browser execution is implemented later.
  - The initial container does not install Chromium. When runner-core pins Playwright, use that same version's CLI to install Chromium and its Linux system dependencies (for example, `npx playwright install --with-deps chromium`); do not introduce a second Playwright version in the container. The OS dependency step needs privileges to install system packages. This does not add Linux runner support to the MVP.
- [ ] Write or update the first-contributor guide with setup, currently available commands, expected outcomes, and troubleshooting pointers.
- [ ] Review and update the existing root/scoped `AGENTS.md` guidance and contributor guide for architecture, coding conventions, security, verification, and change workflow; add scoped guidance only where it materially differs.
- [x] Add least-privilege agent guidance: keep work within the project directory, avoid system-wide access, and do not expose host credentials or broad filesystem mounts by default.
- [x] Explain that repository guidance states expectations but cannot enforce isolation; describe runtime-enforced limits accurately and do not claim a boundary that the agent host does not provide.
- [x] Use GitHub Actions to verify the container build or critical setup steps. Add further workflow checks incrementally as implementation milestones introduce the commands and artifacts they can verify.
  - The initial workflow runs on pull requests targeting `main` and pushes to `main`. It checks the Node.js/npm pins, installs and lists workspaces, validates the Dev Container JSON, and builds the container image. The owner confirmed that the workflow passed on the PR.

## Completion evidence

- A fresh setup can follow the documented path and reach the baseline verification commands.
- Node.js 26.12.1 and npm 11.20.0 are pinned and verified in the container. Playwright/Chromium setup is documented to use the version pinned by runner-core when that dependency is introduced; Chromium is not installed in the current container.
- The initial Windows host baseline was verified with WSL 3.0.3.0/Ubuntu on WSL 2 and Docker Desktop 4.96.3 using Docker CLI/Engine 29.9.2; these observations do not define minimum supported versions.
- Inside the development container, the owner verified Node.js `v26.12.1`, npm `11.20.0`, and all seven workspace packages with `npm ls --workspaces --depth=0`.
- `npm ci` succeeds with Node.js 26.12.1 and npm 11.20.0, and `npm ls --workspaces --depth=0` resolves all seven workspace packages.
- Agent guidance recommends project-directory scope and distinguishes written expectations from controls the runtime actually enforces.
- Contributor guidance explains where credentials may be cached, keeps host credential directories out of the workspace mounts, and does not rely on `.gitignore` to protect credentials outside the repository.
- The initial GitHub Actions workflow passed on the PR, verifying the Node.js/npm pins, workspace installation and listing, Dev Container JSON, and container image build. Later checks are added with their implementation milestones.

## Learning reference

[Development container and contributor/agent guidance](../../Learning%20Plan/Phase%201/02-development-container-and-contributor-guidance.md)
