# Proposed release plan

## MVP objectives

Deliver the complete MVP across Roadmap Phases 1–4. Prioritize a useful local-first Vue editor for visual plan authoring before the CLI runner, then deliver browser execution, reporting, integrations, and adoption materials.

The developer is the first dogfooding user; the primary intended MVP author is a non-technical tester. A minimum success path is: author or import a plan and its case files in the form-based Vue editor, validate and export them, execute them through the later runner/CLI phase, and understand the resulting report.

The first runner baseline is Windows with the Node.js version pinned in Phase 1 and a Playwright-managed Chromium browser. Linux runner and Edge support follow after the MVP and are not required to complete it. During MVP development, prefer designs that work on both Windows and Linux when practical. Playwright-managed Chromium is distinct from branded Google Chrome. Browser locale is a plan-run default inherited by each case unless overridden in that case.

Stagehand should recommend test/staging targets, without implying those environments are free of quotas, egress/download restrictions, or charges. The MVP gives a general, non-blocking warning before execution that browser automation can have side effects and incur costs, and that operators must use authorized targets. Stagehand does not identify production targets or require a production-specific acknowledgement; those behaviours are deferred to [TE-019](technical-enablers/te-019-production-target-identification-and-warning.md).

## Proposed MVP capabilities

- Versioned JSON plan schema and validation, with plans able to reference separately maintained case JSON files.
- MVP browser/platform support: Windows and Playwright-managed Chromium; expand runner support to Linux and browser support to Edge after MVP.
- Headless/headed mode, timezone, locale, viewport configuration.
- Initial browser actions: navigate to a URL with optional bounded DOM-ready/network-idle waits; locate and click page items; type characters or set field values directly; and select dropdown options. Applicable actions may use bounded pre/post selector-existence waits, fixed delays, navigation-state waits, and optional scroll-into-viewport behaviour.
- Initial assertions: compare selector-matched inner text or inner HTML with an expected value; compare an input's value with an expected value; optionally perform a soft check of the associated label's inner text or inner HTML.
- Hard assertions stop the current case; soft assertions record failure and continue.
- Recoverable case failures do not prevent independent cases from running.
- Plan/case/step variable scopes with documented shadowing; one-level shared steps; named data sets selected per case with default fallback; environment-variable secret references. MVP variable values have defaults and optional locale-specific variants and resolve to fixed text, number, or boolean inputs, referenced as whole field {"var":"name"} objects in action inputs and assertion expected values. Protected definitions use {"env":"NAME"}. Missing references, unknown selected data sets, and duplicate names fail before browser startup. Text fields convert numbers/booleans to text; types are preserved elsewhere.
- Case-level parallel execution, cancellation, 10-minute default active-case timeout, configurable timeout overrides and duration thresholds, with run/case elapsed times recorded. Each case uses an isolated Playwright context within a shared browser instance; default concurrency is five contexts, configurable at plan level.
- A general non-blocking CLI warning before execution that reminds operators to verify authorization and consider side effects, egress, downloads, limits, and costs.
- Current-run summary and step diagnostics.
- JSON-only run reporting for MVP. JUnit-compatible XML, HTML reports, and other output conversions are later candidates.
- The run JSON has one case record per case, with case ID/name, outcome, duration, failure detail, detailed step/assertion/accessibility diagnostics, and effective non-secret configuration.
- Optional axe scans after every step; only newly observed violations are accumulated, with non-failing default status and plan/case override.
- CLI overrides of plan and case configuration, with documented scope and precedence.
- Form-based local-first Vue SPA with import, edit, validate, and export; variables, shared steps, and culture-specific expected values are supported before the CLI. Raw JSON editing is deferred.
- Static hosting with current stable desktop Chrome and Edge on Windows as the MVP-supported editor browsers. Use upload/import and download/export for user-owned files in every supported browser. Direct filesystem access is deferred to [TE-020](technical-enablers/te-020-direct-filesystem-access-for-editor.md). An already-open editor remains usable offline; offline cold start is not required. Browser storage is a convenience.
- The local demo application/fixture and .NET xUnit integration are outside the MVP; see the Later candidates and ATR-033.
- Markdown documentation and Hugo site.
- Development container, agent guidance, and CI verification.

## Explicitly deferred unless reprioritized

- Central test-plan storage.
- Long-term run-history database.
- Remote multi-user execution service.
- Interactive Vue report viewer (future candidate; the MVP can use raw result and pipeline files).
- Electron desktop packaging.
- Wiki migration/export tool.
- Arbitrary JavaScript execution from plans.

Loops, list/nested-object values, text interpolation, run-wide data-set selection, page-value capture, variable reassignment, reference chains, and locator/browser/run-setting references are deferred beyond MVP. Loop editor controls, CLI limits, and iteration reporting are also deferred under [ATR-018](epics/E02-execution-engine/stories/ATR-018.md). No delivery point has been selected.

## Release acceptance themes

- Invalid plans fail before browser execution with actionable errors.
- Runner-level failures are distinguishable from test failures.
- Secrets do not appear in logs or reports.
- Soft assertion and accessibility outcomes are independently represented.
- Report generation and CLI exit behaviour are documented and tested.
- A new contributor can set up and verify the repository using the documented development container.
- The editor can work without a Stagehand-managed server or central repository.
- A non-technical tester can author plan and case configuration, variables, shared steps, and localized expected values using controlled forms before the CLI is delivered.
- A non-technical tester can author, inspect, validate, and export a plan through the Vue editor before CLI execution is delivered.
- The CLI can produce the authoritative raw JSON result without requiring an interactive Stagehand report viewer or non-JSON conversion for MVP.
- Documentation recommends test/staging targets and explains that operators are responsible for target authorization, side effects, network usage, downloads, and resulting costs or limits.

Variable/data-set/shared-group names are case-sensitive. Environment lookup uses effective execution inputs only; unselected/overridden references are not required, and present empty values are valid inputs. Secret redaction includes retained assertion/axe evidence and exposed retained observations; this is required design work, not current runner behaviour.
