# 2. Development container and contributor/agent guidance

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, use the exercise to see whether you can apply the distinctions to a real setup.

- [ ] I can explain what a development container can make repeatable.
- [ ] I understand why a container does not automatically provide a secure isolation boundary.
- [ ] I can distinguish written agent instructions from controls that enforce access.
- [ ] I know why host mounts, credentials, and network access need deliberate limits.
- [ ] I can identify which mechanism enforces a particular development-environment restriction.
- [ ] I can explain why `.gitignore` is not secure credential storage.

## What you will learn

- How a development container makes setup more repeatable.
- The difference between a reproducible toolchain and a secure isolation boundary.
- What useful contributor instructions contain.
- Why written agent guidance and runtime restrictions solve different problems.

## Core ideas

A **development container** describes a development environment, commonly through a container image and configuration. It can pin a Node.js version, install project tools, and document browser prerequisites so contributors start from a similar baseline. Reproducibility means fewer “works on my machine” differences; it does not guarantee every machine or build is identical.

In VS Code, reopening a folder in a development container changes where terminal commands and remote extensions run. The project folder is mounted into the container, so edits remain in the same checkout; however, the container needs its own tools such as Git, and extensions may need to be installed in the container environment. A host VS Code window and a container-connected VS Code window can therefore show different installed extensions and available commands even while displaying the same project files.

In Stagehand's current configuration, the checkout is mounted at `/workspaces/stagehand` and the container runs as `node`, whose home directory is separate from the checkout. Store credentials in an appropriate user-level credential store or the relevant tool's home directory, not in project files; treat file-based authentication caches as secrets. The repository's `.gitignore` filters matching files under the checkout (including `.env` files), but does not protect credentials stored elsewhere, prevent programs from reading them, or untrack a file that Git already tracks. Never paste tokens into source files or commit them.

Imagine a shared stage crew kit: the labelled tools make it easier for different people to prepare the set the same way. The kit's inventory sheet tells people how to use the tools, but it does not stop someone from opening a door to the rest of the building.

That distinction matters for AI coding agents too. `AGENTS.md`-style guidance can explain architecture, conventions, security expectations, and verification steps. It is an instruction document, not an enforcement mechanism. A sandbox or runtime policy controls actual access to files, credentials, processes, and network resources. A dev container alone is not a security boundary if the agent retains unrestricted host access.

## Concepts to understand

- **Pinned toolchain:** explicitly selected versions of Node.js, package manager, and critical dependencies/tools.
- **Reproducible setup:** documented steps that reliably produce an environment capable of the expected development tasks.
- **Host mounts:** host paths exposed inside a container; mounted credentials or broad home-directory access can defeat isolation.
- **Git ignore rules:** patterns that exclude untracked paths under a repository from normal Git status and commits; they are not access controls or secure storage.
- **Least privilege:** provide only the access needed for the task.
- **Network policy:** explicitly consider which external connections are required and which can be restricted.
- **Contributor guidance:** durable repository instructions about architecture, coding style, tests, secrets, and review workflow.
- **Runtime enforcement:** controls imposed by the agent host, container runtime, operating system, or CI—not by prose alone.

## Apply this to Stagehand

[TE-013](../../Planning/Backlog/technical-enablers/te-013-development-container.md) and [ATR-036](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-036.md) call for a pinned toolchain, Playwright prerequisites, common commands, and a fresh setup path. Make sure the setup covers the actual required workflows (tests, lint/type checks, builds, CLI, SPA, and docs) as they become implemented.

The selected baseline is Node.js 26.12.1 and npm 11.20.0. The Linux-based development container is implemented and locally verified. The GitHub Actions workflow now builds/tests plan-schema and plan-engine on Linux, and tests plan-engine on Windows so its file handling gets checked on the initial runner platform. Add further workflow checks as implementation milestones introduce commands and outputs they can check. Do not create placeholder checks for features that do not exist yet.

The initial VS Code container setup includes Git with `core.autocrlf=true` so Git handles the CRLF working files mounted from Windows consistently with the LF content in its index. This Git setting is baked into the container image, so it remains in effect when the container is recreated. The container definition does not prescribe editor extensions; contributors can install personal tools in the environment where they want to use them.

The initial container does not install Chromium. When `@stagehand/runner-core` adds and pins Playwright, use that same project-pinned CLI to install the matching Chromium build and Linux system dependencies, for example with `npx playwright install --with-deps chromium`. This avoids a second Playwright version in the container definition. Installing OS dependencies requires privileges to install system packages. This is development-container setup only; Stagehand's initial runner validation remains focused on Windows, with Linux runner support after the MVP.

The Linux GitHub Actions job runs for pull requests targeting `main` and pushes to `main`. It checks the pinned Node.js/npm versions, runs `npm ci` and `npm ls --workspaces --depth=0`, tests `@stagehand/plan-schema` and `@stagehand/plan-engine`, validates the Dev Container configuration, and builds its image. A Windows job runs the plan-engine tests with the same pinned toolchain. These checks cover the current container setup and plan-file loader; add app build and test steps when implementation milestones introduce those commands. Contributors can reproduce the Linux checks locally from the repository root with the documented toolchain and Docker.

On Windows, the planned container workflow uses Docker Desktop with WSL 2. Docker Desktop has licensing terms that contributors should consider when contributing on behalf of an employer. Docker currently requires a paid subscription for commercial use in organisations with more than 250 employees or more than US$10 million in annual revenue; check the [current Windows installation and licensing information](https://docs.docker.com/desktop/setup/install/windows-install/) because terms may change.

Stagehand's MVP runner baseline is Windows with Playwright-managed Chromium; Linux runner and Edge support follow after the MVP. Prefer designs that work on both Windows and Linux when practical, even though initial CLI validation focuses on Windows. The development container may use Linux independently of the runner's MVP support matrix.

[TE-014](../../Planning/Backlog/technical-enablers/te-014-agent-sandbox-and-guidance.md), [ATR-037](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-037.md), and [ATR-038](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-038.md) distinguish vendor-neutral instructions from enforced containment. Avoid mounting production secrets or host credentials by default. Document the actual limits of each supported runtime rather than claiming the container guarantees safety on its own.

For Stagehand, agent guidance should say to keep work within the project directory and avoid system-wide access, broad host mounts, and credentials unless a task requires them and the user authorizes them. These are working expectations, not controls: only the agent host or operating system can enforce filesystem and process boundaries. State clearly when no such enforcement is configured.

## Exercise

Write a first-day setup checklist for a new contributor: required tools, setup steps, commands to verify the setup, and expected result. Then create a threat-oriented checklist for an agent environment: files it can read/write, credentials it can access, processes it can launch, and network access. For each boundary, identify which mechanism enforces it and what remains only a documented expectation.

## You are ready when

- A new contributor can follow one documented path and confirm the environment is working.
- You can distinguish toolchain consistency, user instructions, and actual security enforcement.
- The setup does not silently expose broad host files or credentials, and its limitations are stated plainly.

## Read next

- [TE-013 — Development container](../../Planning/Backlog/technical-enablers/te-013-development-container.md)
- [ATR-036 — Reproducible development container](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-036.md)
- [ATR-037 — Agent guidance](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-037.md)
- [ATR-038 — Agent containment](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-038.md)

## Reinforcement quiz

Answer these from memory, then check the answer key.

1. What problem does a pinned development toolchain address?
2. Why is an `AGENTS.md` instruction not the same as a sandbox?
3. How can a broad host mount weaken the intended isolation of a container?
4. What does least privilege mean for an agent environment?
5. For a rule that says “the agent cannot read my home-directory credentials,” what should you identify before trusting the claim?
6. What does `.gitignore` protect, and what should you do with a credential stored in a user's home directory?

<details>
<summary>Answer key</summary>

1. It reduces differences in tool versions and setup between contributors, making the environment more repeatable.
2. The file describes expected behaviour; it does not technically prevent file, process, credential, or network access. A runtime or operating-system control must enforce those limits.
3. It can expose host files and credentials to processes inside the container, giving them access beyond the project workspace.
4. Give the environment only the file, process, credential, and network access needed for its task.
5. Identify the enforcing mechanism (such as the runtime, OS, or host policy), its configuration, and how to verify it. Documentation alone is not enforcement.
6. `.gitignore` affects matching untracked paths under the repository. Store credentials outside the project tree in a suitable user-level credential store, and restrict which processes can access them.

</details>
