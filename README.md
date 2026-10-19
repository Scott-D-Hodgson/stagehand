# Stagehand

**Give browser tests a stage manager.**

Stagehand is a planned, local-first toolkit for creating and running repeatable browser tests. Testers will describe checks in versioned JSON plans, edit those plans in a visual Vue editor, and run them through a Node.js CLI backed by Playwright.

The first user is the developer, learning by dogfooding. The main intended author is a non-technical tester, which is why the visual editor comes before the CLI runner.

## The plan

Stagehand's MVP is the full sequence of Phases 1–4:

1. **Contracts and development foundation:** establish package boundaries, shared plan/result contracts, and the development workflow.
2. **Visual authoring:** build a form-based editor to create, validate, import, and export plans. Raw JSON editing and direct filesystem access are deferred.
3. **Execution and CLI:** run plans with Playwright, bounded concurrency, predictable failure handling, and JSON output.
4. **Reporting and adoption:** retain results as Azure DevOps pipeline artifacts and provide examples, tutorials, and published documentation.

The initial runner baseline is Windows, the current Node.js LTS line, and Playwright-managed Chromium. Linux and Edge runner support follow later. The editor is intended for current desktop Chrome and Edge on Windows.

Plans cover navigation, common browser actions, text and input assertions, variables, named data sets, shared steps, bounded loops, and localized expected values. Optional axe scans run after each step; findings are non-failing by default unless the plan or case says otherwise.

The MVP result format is JSON. JUnit and HTML reports, screenshots, production-specific controls, direct filesystem access, browser reload/back/forward actions, and .NET xUnit integration are later candidates. A general warning will remind operators that they are responsible for target authorization, side effects, and costs.

## Project status

The repository exists and currently contains planning and learning documents; the Stagehand editor, runner, and CLI have not yet been implemented. M0 documents the GitHub bootstrap process, and the repository settings still need review. The intended workflow is to send changes through pull requests and review them before merging. While working solo, the owner uses a manual self-review checklist; automated review-policy enforcement is deferred until the project has more developers.

Planning is a living set of AI-generated documents guided by the developer. The Learning Plan is generated from those materials to help developers understand and carry out the work. Neither should be treated as a substitute for reviewing the latest decisions and requirements.

## Find your way around

- [Planning](Planning/README.md) — backlog, roadmap, work plan, repository map, and security planning.
- [Backlog](Planning/Backlog/README.md) — vision, release scope, stories, technical enablers, examples, and decisions.
- [Roadmap](Planning/Roadmap/README.md) — the proposed phases and their outcomes.
- [Work Plan](Planning/Work%20Plan/README.md) — M0 and the Phase 1 milestones, with estimates and completion evidence.
- [Learning Plan](Learning%20Plan/README.md) — concept guides and exercises arranged by phase.
- [Repository map](Planning/Repository/README.md) — key current and proposed folders.
- [Security planning](Planning/Security/README.md) — an initial ITSG-33 control mapping, not a compliance claim.
- [Acronyms used in Planning](Planning/acronyms.md)
- [Acronyms used in the Learning Plan](Learning%20Plan/acronyms.md)

## Contributing

Changes should be proposed through a pull request so the author and reviewer can inspect the diff before it reaches `main`. The intended solo procedure is for the owner to self-review with a checklist and review contributions from others. When other reviewers join, the intended policy is to require an independent review. The planned merge convention is to use merge commits for the owner's PRs, preserving individual commits in `main`, and squash merges for outside contributions, grouping their incremental commits. GitHub does not enforce this choice based on authorship; both methods need to be enabled and selected per PR. Settings are still being reviewed, so this describes the project expectation rather than claiming that the rules are already active.

See the [M0 repository bootstrap guide](Learning%20Plan/Phase%201/00-github-repository-bootstrap-and-pr-governance.md) for the setup and review approach. Keep plans and examples synthetic, and never commit credentials or real secrets.

## Licence

Stagehand is distributed under the [MIT Licence](LICENSE).
