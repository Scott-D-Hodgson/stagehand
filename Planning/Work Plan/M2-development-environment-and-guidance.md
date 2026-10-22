# M2 — Development environment and contributor/agent guidance

**Estimate:** 3–5 person-days  
**Depends on:** M0, M1  
**Roadmap item:** Development container and contributor/agent guidance

## Tasks

- [ ] Identify required tools and supported versions for the current repository baseline.
- [x] Pin Node.js 26.12.1 and npm 11.20.0, and document how the pinned versions will be updated. [Node.js release guidance](https://nodejs.org/en/about/previous-releases/) recommends Active or Maintenance LTS for production applications.
- [x] Document runner OS/browser support separately from the development-container OS: focus initial CLI validation on Windows with Playwright-managed Chromium, schedule Linux runner support after the MVP, and keep Edge as a later browser expansion. During development, prefer designs that work on both Windows and Linux when practical.
- [ ] Add a Linux-based development container definition and pin the critical tools; treat its OS separately from the runner support matrix.
- [ ] Document required Playwright/browser system dependencies and setup steps, even if browser execution is implemented later.
- [ ] Write or update the first-contributor guide with setup, currently available commands, expected outcomes, and troubleshooting pointers.
- [ ] Review and update the existing root/scoped `AGENTS.md` guidance and contributor guide for architecture, coding conventions, security, verification, and change workflow; add scoped guidance only where it materially differs.
- [x] Add least-privilege agent guidance: keep work within the project directory, avoid system-wide access, and do not expose host credentials or broad filesystem mounts by default.
- [x] Explain that repository guidance states expectations but cannot enforce isolation; describe runtime-enforced limits accurately and do not claim a boundary that the agent host does not provide.
- [ ] Use GitHub Actions to verify the container build or critical setup steps. Add further workflow checks incrementally as implementation milestones introduce the commands and artifacts they can verify.

## Completion evidence

- A fresh setup can follow the documented path and reach the baseline verification commands.
- Node.js 26.12.1, npm 11.20.0, and browser prerequisites are discoverable and appropriately pinned.
- `npm ci` succeeds with Node.js 26.12.1 and npm 11.20.0, and `npm ls --workspaces --depth=0` resolves all seven workspace packages.
- Agent guidance recommends project-directory scope and distinguishes written expectations from controls the runtime actually enforces.
- GitHub Actions verifies the container definition or its critical setup checks; later checks are added with their implementation milestones.

## Learning reference

[Development container and contributor/agent guidance](../../Learning%20Plan/Phase%201/02-development-container-and-contributor-guidance.md)
