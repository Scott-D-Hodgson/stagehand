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

The MVP runner baseline is Windows, the pinned Node.js version, and Playwright-managed Chromium. Linux runner and Edge support follow after the MVP; during development, prefer designs that work on both Windows and Linux when practical. The editor is intended for current desktop Chrome and Edge on Windows.

Plans cover navigation, common browser actions, text and input assertions, variables, named data sets, shared steps, and localized expected values. Optional axe scans run after each step; findings are non-failing by default unless the plan or case says otherwise.

The MVP result format is JSON. JUnit and HTML reports, screenshots, production-specific controls, direct filesystem access, browser reload/back/forward actions, and .NET xUnit integration are later candidates. A general warning will remind operators that they are responsible for target authorization, side effects, and costs.

## Project status

**Current status:** M0 through M10 are complete. M11 configuration and localized-assertion work remains in progress. M15 provides a Hugo landing page at `getstagehand.ca`, a canonical `www` redirect, and the static editor at `app.getstagehand.ca`, with verified Cloudflare Pages production, pull-request previews, HTTPS, and rollback readiness. The runner, CLI, reporting, and editor continue to be delivered incrementally through reviewable pull requests.

The repository contains planning and learning documents, npm workspaces, a Hugo public-site source, shared plan/result contracts, a visual editor, and browser-runner building blocks. The editor is local-first and its initial public presentation does not introduce a Stagehand account service, central plan store, or remote browser execution. The CLI, report-file writing, full production orchestration, and real-browser accessibility verification remain future work. The intended workflow is to send changes through a pull request and review them before merging. While working solo, the owner uses a manual self-review checklist; automated review-policy enforcement is deferred until the project has more developers.

Planning is a living set of AI-generated documents guided by the developer. The Learning Plan is generated from those materials to help developers understand and carry out the work. Neither should be treated as a substitute for reviewing the latest decisions and requirements.

## Find your way around

- [Planning](Planning/README.md) — backlog, roadmap, work plan, repository map, and security planning.
- [Public site](apps/site/README.md) — Hugo landing-page source and local preview/build instructions.
- [Backlog](Planning/Backlog/README.md) — vision, release scope, stories, technical enablers, examples, and decisions.
- [Roadmap](Planning/Roadmap/README.md) — the proposed phases and their outcomes.
- [Work Plan](Planning/Work%20Plan/README.md) — M0 and the Phase 1 milestones, with estimates and completion evidence.
- [Learning Plan](Learning%20Plan/README.md) — concept guides and exercises arranged by phase.
- [Repository map](Planning/Repository/README.md) — key current and proposed folders.
- [Security planning](Planning/Security/README.md) — an initial ITSG-33 control mapping, not a compliance claim.
- [Acronyms used in Planning](Planning/acronyms.md)
- [Acronyms used in the Learning Plan](Learning%20Plan/acronyms.md)

## Contributing

Changes should be proposed through a pull request so the author and reviewer can inspect the diff before it reaches `main`. The solo procedure is for the owner to self-review with a checklist and review contributions from others. When other reviewers join, the intended policy is to require an independent review. The planned merge convention is to use merge commits for the owner's PRs, preserving individual commits in `main`, and squash merges for outside contributions, grouping their incremental commits. GitHub does not enforce this choice based on authorship; select the appropriate method when merging. M0 records that the `Protect main` ruleset was configured and tested with a PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the review steps and merge conventions, and the [repository collaboration lesson](Learning%20Plan/Phase%201/Lessons/01-repository-collaboration.md) for the repository setup approach. Keep plans and examples synthetic, and never commit credentials or real secrets.

## Licence

Stagehand is distributed under the [MIT Licence](LICENSE).

Third-party package notices and licence texts are provided in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
