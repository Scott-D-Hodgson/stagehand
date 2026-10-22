# Product vision

## Vision

Stagehand is a local-first browser end-to-end testing toolkit with a visual plan editor and a reusable execution runner. It is designed to help non-technical testers author and understand plans through a Vue editor before the CLI runner is prioritized, while still supporting technical users and CI/CD without requiring a central plan service.

## Problem

Teams need repeatable browser-based functional checks that can be run manually, on a schedule, or from delivery pipelines. Test definitions should be portable, reusable, data-driven, local-first, and report results in formats suitable for both people and automation.

## First user and intended users

- The developer is the first dogfooding user and will refine Stagehand through hands-on use.
- The primary intended MVP user is a non-technical tester who needs to create, inspect, and validate plans through a visual editor.
- Developers and test engineers authoring and maintaining plans or integrating execution.
- CI/CD maintainers integrating automated checks.
- Operators reviewing reports and diagnosing failures.
- Contributors developing Stagehand and its surrounding tools.

## Product principles

1. **Reusable execution core:** CLI, editor integrations, and future entry points share the same execution contracts.
2. **Local-first authoring:** the Vue SPA edits user-owned files and does not maintain a central test-plan repository.
3. **Versioned contracts:** plan and result schemas have explicit versions and validation.
4. **Observable outcomes:** hard failures, soft assertion failures, accessibility findings, and runner errors remain distinguishable.
5. **Secure by default:** secrets are referenced externally, redacted from outputs, and not committed in plan files.
6. **Composable delivery:** components are modular and can have separate build/release pipelines even within one monorepo.
7. **Accessible and multilingual:** test definitions and reports support localized user-facing descriptions; browser locale is configurable.
8. **Reproducible development:** contributors use a documented development container and shared agent guidance.
9. **Portable documentation:** Markdown is canonical and Hugo presents it as the primary documentation site.
10. **Operator accountability:** Stagehand is an enabler, not the owner of target-system permission, operating constraints, costs, or consequences. Recommend test/staging targets and make operator responsibilities clear.

## MVP scope and delivery order

The MVP is the complete set of Roadmap Phases 1–4. The first user-facing capability should be the Vue plan editor, delivered before the CLI runner so the developer can dogfood plan authoring and the intended non-technical tester can work visually.

The initial runner support baseline is Windows, the current Node.js LTS line pinned during the development-foundation work, and a Playwright-managed Chromium browser. Linux runner and Microsoft Edge support are planned after the MVP. During MVP development, prefer designs that work on both Windows and Linux when practical, so Linux support does not require avoidable rewrites. Branded Google Chrome is not a separate initial runner target; future need can be reviewed after the managed Chromium baseline.

The MVP-supported editor browsers are current stable desktop Chrome and Edge on Windows. User-owned plan files are handled through upload/import and download/export in both browsers. Direct filesystem access is deferred to [TE-020](technical-enablers/te-020-direct-filesystem-access-for-editor.md). The File System Access picker API is marked as limited availability and requires a secure context ([MDN: `showOpenFilePicker`](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker), [MDN: File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)). Firefox and Safari support are not in the MVP browser matrix and can be considered later.

## Initial scope

- Node.js/TypeScript reusable execution library.
- Playwright browser-based end-to-end tests, initially targeting Windows and Playwright-managed Chromium; Linux runner and Edge support follow after the MVP.
- Versioned JSON test plans and validation.
- Plans may reference separate case JSON files so users can organise plans at a size and structure that suits their needs.
- CLI execution and configuration overrides.
- Hard and soft assertions.
- Initial browser actions include URL navigation, selector-based click, typing and direct field-value setting, dropdown selection, bounded optional waits/delays, and optional scroll-into-viewport behaviour. Initial assertions compare inner text/HTML and input values, with an optional soft check of associated label text/HTML; detailed semantics are specified in ATR-008.
- Form-based plan/case authoring in Vue before CLI delivery, including variables, shared steps, loops, and culture-specific expected assertion values.
- Nested plan/case/step variable scopes, one-level shared steps, environment-variable references, and loops capped at 10 by default with configuration overrides.
- Case parallelism, cancellation, configurable 10-minute default plan/case timeouts, duration thresholds, and run/case timing.
- A versioned JSON result for MVP; JUnit-compatible XML and HTML conversions are later work.
- Optional axe scans after each step, grouped by URL and violation description with newly observed problematic markup appended, non-failing by default with plan/case failure overrides.
- Local-first Vue SPA editor.
- Markdown documentation rendered by Hugo.
- Monorepo, development container, CI validation, and AI-agent guidance.

The rollout order is: Phase 1 contracts and foundation; Phase 2 form-based visual plan authoring, including shared steps, variables, loops, and localization; Phase 3 execution engine and CLI; Phase 4 reports, integrations, and adoption. Linux runner and Edge support are follow-on work after MVP; cross-platform design during MVP is preferred when practical.

## Non-goals for the initial release

- Central hosted storage of customer test plans.
- Mandatory user accounts or hosted execution service.
- Long-term run-history database.
- Arbitrary executable JavaScript embedded in JSON plans.
- General-purpose workflow automation beyond defined test actions and controlled loops.
- Wiki migration/export tooling.
- Electron distribution unless prioritized after the web editor is validated.
- Interactive Vue report viewing; defer until the core MVP is complete ([TE-018](technical-enablers/te-018-local-report-viewer.md)).

## Open design questions

- Whether branded Google Chrome needs to be supported separately from Playwright-managed Chromium after the initial baseline.
- Later candidates for browser navigation/assertions and distinct click variants are tracked in [ATR-042](epics/E02-execution-engine/stories/ATR-042.md); they are outside the accepted MVP vocabulary.
- The precise selector-selection terminology, action-specific applicability/order of pre/post wait and delay options, and associated-label lookup behaviour when no label is found.
- Variable types and list iteration details beyond the agreed scope precedence and default loop bound.
- Exact JUnit XML dialect/task compatibility and the mapping from Stagehand outcomes/fields to Azure DevOps results.
- Whether to add Firefox or Safari editor support after the MVP baseline.
- How accessibility scan errors should affect case/run outcomes.
- Production-target identification and production-specific warning/acknowledgement are tracked for later in [TE-019](technical-enablers/te-019-production-target-identification-and-warning.md); the MVP has a general execution warning.
- Which additional user workflows should be used to test Stagehand beyond the initial [example journeys](example-journeys.md).
