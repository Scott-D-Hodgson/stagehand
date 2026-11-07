# M2 — Development environment and contributor/agent guidance

**Status:** Complete
**Original estimate:** 3–5 person-days (not actual effort)
**Depends on:** M0, M1

## Objective

Established a repeatable development setup and contributor/agent guidance while distinguishing the development container from supported runner environments.

## Tasks completed

- Pinned Node.js 26.12.1 and npm 11.20.0 and added a Linux-based development container using `npm ci`.
- Documented first-day setup, available checks, troubleshooting, credential handling, architecture, and contribution practices.
- Reviewed agent instructions and their enforcement limits; added initial GitHub Actions checks for version pins, dependencies, container configuration, and image build.

## Decisions made

- Kept Windows with Playwright-managed Chromium as the initial runner target; using a Linux development container does not establish Linux runner support.
- Kept host credential directories out of container mounts and distinguished repository guidance from runtime-enforced isolation.
- Did not install Chromium for mocked lifecycle tests; real-browser setup must use the matching pinned Playwright CLI and system dependencies when introduced.

## Deferred work

- Actual Chromium installation and real-browser verification await the project-owned test site and corresponding test slice.
- Linux runner support and additional runner browsers remain later work. Baseline CI expands as implementation introduces meaningful checks.

## Completion evidence

- The owner verified VS Code container startup, Git, Node.js `v26.12.1`, npm `11.20.0`, and resolution of all seven workspaces.
- The owner confirmed the initial CI workflow passed on the PR, including container image build.
- The recorded host observations were WSL 3.0.3.0 with Ubuntu on WSL 2 and Docker Desktop 4.96.3 / Docker 29.9.2; these were observed versions, not minimum requirements.
- The contributor guide and container configuration document the setup. M7 later recorded clean-install verification across the completed foundation.

## Learning plan reference

[Development environment](../../Learning%20Plan/Phase%201/Lessons/03-development-environment.md).
