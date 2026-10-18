# M2 — Development environment and contributor/agent guidance

**Estimate:** 3–5 person-days  
**Depends on:** M0, M1  
**Roadmap item:** Development container and contributor/agent guidance

## Tasks

- [ ] Identify required tools and supported versions for the current repository baseline.
- [ ] Select and pin an exact version from the current Node.js LTS line; document how the supported LTS version is updated. [Node.js release guidance](https://nodejs.org/en/about/previous-releases/) recommends Active or Maintenance LTS for production applications.
- [ ] Document the initial support baseline as Windows with Playwright-managed Chromium; list Linux and Edge as the next planned expansion after the baseline is proven.
- [ ] Add a development container definition and pin the critical toolchain.
- [ ] Document required Playwright/browser system dependencies and setup steps, even if browser execution is implemented later.
- [ ] Write a first-contributor guide with setup, common commands, expected outcomes, and troubleshooting pointers.
- [ ] Add vendor-neutral contributor/agent instructions for architecture, coding conventions, security, verification, and change workflow.
- [ ] Decide which sandbox/runtime configurations are supported; document filesystem, credential, process, and network boundaries accurately.
- [ ] Ensure credentials and broad host mounts are not enabled by default; state when a runtime cannot enforce a desired boundary.
- [ ] Add a CI check for the container build or critical setup steps, consistent with the acceptance criteria in ATR-036.

## Completion evidence

- A fresh setup can follow the documented path and reach the baseline verification commands.
- Tool versions and browser prerequisites are discoverable and appropriately pinned.
- Guidance distinguishes written instructions from controls actually enforced by the runtime.
- CI verifies the container definition or its critical setup checks.

## Learning reference

[Development container and contributor/agent guidance](../../Learning%20Plan/Phase%201/02-development-container-and-contributor-guidance.md)
