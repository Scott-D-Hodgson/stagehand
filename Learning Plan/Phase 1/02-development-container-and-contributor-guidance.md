# 2. Development container and contributor/agent guidance

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, use the exercise to see whether you can apply the distinctions to a real setup.

- [ ] I can explain what a development container can make repeatable.
- [ ] I understand why a container does not automatically provide a secure isolation boundary.
- [ ] I can distinguish written agent instructions from controls that enforce access.
- [ ] I know why host mounts, credentials, and network access need deliberate limits.
- [ ] I can identify which mechanism enforces a particular development-environment restriction.

## What you will learn

- How a development container makes setup more repeatable.
- The difference between a reproducible toolchain and a secure isolation boundary.
- What useful contributor instructions contain.
- Why written agent guidance and runtime restrictions solve different problems.

## Core ideas

A **development container** describes a development environment, commonly through a container image and configuration. It can pin a Node.js version, install project tools, and document browser prerequisites so contributors start from a similar baseline. Reproducibility means fewer “works on my machine” differences; it does not guarantee every machine or build is identical.

Imagine a shared stage crew kit: the labelled tools make it easier for different people to prepare the set the same way. The kit's inventory sheet tells people how to use the tools, but it does not stop someone from opening a door to the rest of the building.

That distinction matters for AI coding agents too. `AGENTS.md`-style guidance can explain architecture, conventions, security expectations, and verification steps. It is an instruction document, not an enforcement mechanism. A sandbox or runtime policy controls actual access to files, credentials, processes, and network resources. A dev container alone is not a security boundary if the agent retains unrestricted host access.

## Concepts to understand

- **Pinned toolchain:** explicitly selected versions of Node.js, package manager, and critical dependencies/tools.
- **Reproducible setup:** documented steps that reliably produce an environment capable of the expected development tasks.
- **Host mounts:** host paths exposed inside a container; mounted credentials or broad home-directory access can defeat isolation.
- **Least privilege:** provide only the access needed for the task.
- **Network policy:** explicitly consider which external connections are required and which can be restricted.
- **Contributor guidance:** durable repository instructions about architecture, coding style, tests, secrets, and review workflow.
- **Runtime enforcement:** controls imposed by the agent host, container runtime, operating system, or CI—not by prose alone.

## Apply this to Stagehand

[TE-013](../../Planning/Backlog/technical-enablers/te-013-development-container.md) and [ATR-036](../../Planning/Backlog/epics/E08-developer-experience/stories/ATR-036.md) call for a pinned toolchain, Playwright prerequisites, common commands, and a fresh setup path. Make sure the setup covers the actual required workflows (tests, lint/type checks, builds, CLI, SPA, and docs) as they become implemented.

The selected baseline is Node.js 26.12.1 and npm 12.2.0. M2 uses a Linux-based development container and GitHub Actions to validate the container or its critical setup steps. Add more CI workflows as implementation milestones introduce the commands and outputs those workflows can check; do not create placeholder checks for features that do not exist yet.

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

<details>
<summary>Answer key</summary>

1. It reduces differences in tool versions and setup between contributors, making the environment more repeatable.
2. The file describes expected behaviour; it does not technically prevent file, process, credential, or network access. A runtime or operating-system control must enforce those limits.
3. It can expose host files and credentials to processes inside the container, giving them access beyond the project workspace.
4. Give the environment only the file, process, credential, and network access needed for its task.
5. Identify the enforcing mechanism (such as the runtime, OS, or host policy), its configuration, and how to verify it. Documentation alone is not enforcement.

</details>
