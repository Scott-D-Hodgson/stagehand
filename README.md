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

Plans cover navigation, common browser actions, text and input assertions, variables, named data sets, shared steps, bounded loops, and localized expected values. Optional axe scans run after each step; findings are non-failing by default unless the plan or case says otherwise.

The MVP result format is JSON. JUnit and HTML reports, screenshots, production-specific controls, direct filesystem access, browser reload/back/forward actions, and .NET xUnit integration are later candidates. A general warning will remind operators that they are responsible for target authorization, side effects, and costs.

## Project status

The repository contains planning and learning documents, npm workspace scaffolds, and initial plan/case schemas with runtime schema validation, relative case-reference matching, parsed-bundle case validation, and absolute HTTP/HTTPS navigation URL checks in `packages/plan-schema`. The `packages/plan-engine` workspace loads a plan and its referenced cases, checks that case files stay inside the plan folder, validates the parsed bundle, and calculates a source fingerprint from the exact file contents. The `packages/result-model` workspace contains the normative result v1 JSON Schema, TypeScript result types, a public validator, and a synthetic example. The `packages/runner-core` workspace starts Chromium, manages isolated per-case browser contexts and pages, resolves unique case-session locators, runs ordered wait lists, navigates case sessions to absolute HTTP/HTTPS URLs, supports direct clicks, character typing, field filling, option selection by value or visible label, and exact locale-aware `assertText`, `assertHtml`, and `assertValue` checks, and dispatches `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps. Runner-core also resolves validated accessibility settings through a pure helper and per-session snapshots, preserving independent overrides and copied tag arrays. The expanded runner-core build and all 88 tests passed locally on Windows with the pinned Node.js/npm versions; this does not establish axe scan execution. Tests mock Playwright; dev-container, real-browser, and current CI verification of the `assertValue` slice remain outstanding. Axe scanning, result aggregation, and plan-driven execution remain future work. The Stagehand editor and CLI have not yet been implemented. M0 is recorded as complete, including a test PR. The intended workflow is to send changes through pull requests and review them before merging. While working solo, the owner uses a manual self-review checklist; automated review-policy enforcement is deferred until the project has more developers.

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

Changes should be proposed through a pull request so the author and reviewer can inspect the diff before it reaches `main`. The solo procedure is for the owner to self-review with a checklist and review contributions from others. When other reviewers join, the intended policy is to require an independent review. The planned merge convention is to use merge commits for the owner's PRs, preserving individual commits in `main`, and squash merges for outside contributions, grouping their incremental commits. GitHub does not enforce this choice based on authorship; select the appropriate method when merging. M0 records that the `Protect main` ruleset was configured and tested with a PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the review steps and merge conventions, and the [M0 repository bootstrap guide](Learning%20Plan/Phase%201/00-github-repository-bootstrap-and-pr-governance.md) for the repository setup approach. Keep plans and examples synthetic, and never commit credentials or real secrets.

## Licence

Stagehand is distributed under the [MIT Licence](LICENSE).

Third-party package notices and licence texts are provided in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
