# `@stagehand/runner-core`

This package starts one Playwright-managed Chromium process for a run and creates an isolated browser context and page for each case. Run-wide locale and headless settings use Stagehand defaults when omitted. Each case inherits the run's viewport and time zone, and may override either setting. Headless mode is run-wide because it is selected at browser launch.

The public entry point exports `startBrowserRun`, `resolveAccessibilitySettings`, and `mapAccessibilityFindings`. `startBrowserRun` returns a run with `createCaseSession` and `close` methods. Each case session exposes `navigate`, which accepts an absolute HTTP/HTTPS URL and uses `domcontentloaded` with a 30-second timeout by default; the supported `waitUntil` and timeout settings can be overridden. It also exposes `resolveLocator`, which accepts one schema locator (`role`, `label`, `css`, or `xpath`) and returns its unique Playwright locator. Role and label names are matched exactly. A missing match is retried up to three times, with one-second gaps, within the supplied timeout; the default is 30 seconds. The timeout is divided across the locator waits after reserving retry gaps. Multiple matches fail immediately. The `click` method uses the same locator rules and a 30-second default timeout; locator lookup and Playwright click actionability share that timeout budget. Scrolling is enabled by default, and `scrollIntoView: false` makes Playwright fail if the target is outside the viewport. The `type` method uses the same locator and timeout rules, enters characters sequentially with Playwright's default zero delay, and shares its timeout between locator lookup and typing. The `fill` method sets a field's value directly using the same locator and timeout rules. `selectOption` chooses exactly one option by its value or visible label and uses the same locator, timeout, and scroll rules. `assertText` compares inner text, `assertHtml` compares inner HTML, and `assertValue` compares the control's input value. All three compare exact, case-sensitive strings selected for the run locale, and share one timeout between locator resolution and reading the value. The `scrollIntoView` option applies to interactions, not assertions. Case sessions also expose `runWaitList`, which runs wait items sequentially: locator waits poll once per second for exactly one match, page-state waits support `domcontentloaded` and `networkidle`, and fixed delays may last 1 to 30,000 milliseconds. Each item defaults to a 30-second timeout; a shorter timeout bounds the wait and causes a `WaitExecutionError` if it expires. `executeSteps(caseId, steps)` dispatches validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps in sequence; interaction steps run their `before` and `after` waits. It throws a `StepExecutionError` with the case ID, zero-based step index, action, and original cause when a hard assertion or another step fails. Soft assertion mismatches, missing or ambiguous locators, and text/HTML/value-read timeouts are returned with case ID, step index, expected value, and a diagnostic; actual content is included when available, and later steps continue. Automatic after-step axe scanning, integration with plan loading, result records, and case/run outcome aggregation are not implemented by this dispatcher. Close each case session when its case finishes, and call the run's `close` method in a `finally` block. Closing the run waits for in-flight case setup, rejects sessions that have not finished setup when shutdown starts, closes any active case sessions, and then closes Chromium. Concurrent run `close` calls await the same cleanup.

`assertValue(locator, expected, options)` compares the control's input value exactly, using the run locale. Options accept `timeout` and an optional `associatedLabel` expected-value object. The label check uses the control's standard HTML `labels` association (wrapping labels or `for` attributes), compares visible text exactly, and shares the value assertion's timeout. A missing, ambiguous, mismatched, or timed-out label check returns an `AssociatedLabelFailure`; a successful check returns `undefined`. Value failures throw through the direct API. Through `executeSteps`, value assertions are hard by default and support `soft: true`; label failures are always soft and carry `check: "associatedLabel"`. A hard value failure stops the step before the label check. A soft value failure still permits the label check within the remaining timeout, so one step can return both a value failure and a label failure. Unexpected browser errors remain hard failures.

The `assertValue` slice builds and passes all 81 runner-core tests locally on Windows with the pinned toolchain. Tests use Playwright doubles, including checks for shared timeout budgets and label outcomes; dev-container, real-browser, and current CI verification of this slice remain outstanding.

Build and test from the repository root:

```sh
npm test --workspace @stagehand/runner-core
```

The tests import the public package name and replace the Playwright launch method with small test doubles, so they do not require a downloaded browser. Dispatcher tests cover ordered `navigate`/`click`/`type`/`fill`/`selectOption`/`assertText`/`assertHtml`/`assertValue` execution, interaction wait lists, scrolling, timeout handling, failure context, and the no-scroll viewport rule. The suite includes 19 added `assertValue` and associated-label test cases, alongside the existing 62 tests.

Playwright and its `playwright-core` dependency use Apache-2.0, not MIT. Their licence text and notices are recorded in the repository's [third-party notices](../../THIRD-PARTY-NOTICES.md), where this non-MIT dependency remains flagged for maintainer review.

`@axe-core/playwright` is pinned to 4.14.0 as a production dependency, with `axe-core` resolved to 4.14.0. The owner accepted MPL-2.0 for use of the upstream files unchanged. The [third-party notices](../../THIRD-PARTY-NOTICES.md#axe-accessibility-dependencies) contain the full licence text, source-availability instructions, engine copyright/trademark attribution, and bundled MIT/ISC notices. Installing this dependency does not implement accessibility scanning.

The adapter's ESM import and TypeScript compatibility with Playwright's `Page` type were checked locally on Windows. The runner-core build and all 81 existing mocked-browser tests also passed after installation. Real-browser scanning and release-artifact notice inclusion remain unverified.

The accepted scanner requirements include an optional companion run-level tag filter: selected tags scope the assessment; omitted or empty plan tags use axe's default rule selection without tag restriction. Plan/case schemas now accept `accessibility.tags`: cases inherit omission, replace the plan list with a non-empty list, or clear it with `[]`. This input option is separate from the retained rule `tags` on findings. Runner-core now resolves these settings and exposes them on sessions, and applies them when `scanAccessibility()` is explicitly called; automatic after-step scanning remains pending. See the [scan-scope decision under TE-010](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-scan-scope-option) and [retained finding/node fields](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-retained-fields) for the implementation requirements.

## Effective accessibility settings

`resolveAccessibilitySettings(planSettings?, caseSettings?)` accepts validated partial accessibility settings and returns a fresh `EffectiveAccessibilitySettings` object. Defaults are `enabled: false`, `failOnViolation: false`, and `tags: []`. Each case field independently overrides its plan value. Omitted fields inherit; explicit `false` is preserved. Omitted case tags inherit the plan list, a non-empty list replaces it, and `[]` clears the filter. Tags and failure policy do not enable scanning.

```ts
import { resolveAccessibilitySettings } from "@stagehand/runner-core";
const effective = resolveAccessibilitySettings(
  { enabled: true, failOnViolation: true, tags: ["wcag2a", "wcag2aa"] },
  { enabled: false, tags: [] },
);
// { enabled: false, failOnViolation: true, tags: [] }
```

`startBrowserRun({ accessibility })` captures a run-level settings snapshot before launch. `createCaseSession({ accessibility })` captures case overrides before asynchronous browser setup and exposes the resolved object as `session.accessibility`. Returned settings/tag arrays are independent mutable snapshots: modifying one does not modify caller inputs, run defaults, or other sessions. Readonly input tag arrays are supported.

The pure helper takes the inner objects (`plan.defaults.accessibility` and `case.settings.accessibility`), not the whole documents. The run/session APIs take their normal settings objects with an `accessibility` property. Caller-side loading/validation remains separate.

The helper is a settings resolver, not a validator: callers must validate untrusted plan/case input with plan-schema before using it. It neither checks the tag catalogue nor starts a browser. The session path still owns normal browser lifecycle; the pure helper does not start axe. Sessions scan only when `scanAccessibility()` is explicitly called; they do not yet emit result records or apply M6 status/continuation policy. The exported settings type is structurally compatible with result-model's accessibility settings. The mapping slice declares result-model as a package dependency for shared output types and validator-based tests; source type-only imports are erased at build time.

Before the explicit scan slice, the settings resolver build and all 88 tests passed locally on Windows, including seven settings tests and the earlier 81 tests. A separate TypeScript public-import check confirmed readonly input support and result-model type compatibility. Browser launch is mocked in these tests. Dev-container/CI and actual scan integration remain unverified for this slice.

## Explicit accessibility scans

Call `session.scanAccessibility()` to assess that session's page using its current `session.accessibility` settings. Each enabled invocation creates a fresh Deque `AxeBuilder`. Non-empty tags are copied into `withTags` before analysis; empty tags leave tag filtering unset and preserve axe defaults.

The promise returns an `AccessibilityScanOutcome`:

| Status | Meaning |
| --- | --- |
| `disabled` | Scanning is off; no analysis or page evaluation is requested and no fabricated findings are returned. |
| `completed` | The adapter resolved. `results` contains its raw axe observations, including violations, incomplete results, passes, and inapplicable rules. This does not mean the page passed accessibility checks. |

```ts
const outcome = await caseSession.scanAccessibility();
if (outcome.status === "completed") {
  console.log(outcome.results.violations);
}
```

`AccessibilityScanResults` is the adapter's analysis result type. The direct scan operation does not map or collect Stagehand findings; call the separate pure `mapAccessibilityFindings` helper explicitly when needed. `failOnViolation` does not turn observations into exceptions or case outcomes; M6 retains that policy. Incomplete observations, including per-rule error details supplied within them, are preserved for later interpretation. They are not automatically converted into a rejected scan, a violation, or a case outcome. A completed assessment with no violations is also different from a disabled call; it can still include incomplete observations.

Adapter configuration/analysis rejections throw `AccessibilityScanError` with the original rejection as `cause`. A rejection is distinct from a detected violation. Inputs still require prior plan-schema validation. The scan reads the session's mutable snapshot at invocation time; changes to that snapshot affect subsequent explicit calls but not other sessions or run defaults.

Session creation and `executeSteps` do not call this method automatically, even when enabled. Await each explicit scan before continuing case work. Automatic after-step cadence, mapping integration, per-case collection, and outcome policy remain separate slices.

At the explicit-scan slice, the runner-core build and all 99 tests passed locally on Windows, including 11 scan tests and the previous 88 tests. A TypeScript public-import check verified outcome narrowing and exported result/error types. Browser/adapter doubles cover orchestration and failures; no successful real-browser axe assessment, frame coverage, dev-container run, or CI result is established by these checks.

## Mapping axe observations

`mapAccessibilityFindings(results)` accepts a trusted raw `AccessibilityScanResults` object and returns shared `ResultAccessibilityFinding[]` values. It does not scan, validate arbitrary JSON, mutate raw observations, collect case history, or create a full result document.

```ts
import { mapAccessibilityFindings } from "@stagehand/runner-core";
const scan = await caseSession.scanAccessibility();
if (scan.status === "completed") {
  const findings = mapAccessibilityFindings(scan.results);
  console.log(findings);
}
```

The helper maps only `violations`, producing one finding per raw violation in input order. It copies the scan URL, rule metadata, and selected node evidence. Missing finding impact becomes `null`; absent optional node impact, summary, and XPath stay absent, while explicit null/empty evidence is preserved. Targets retain frame/shadow-DOM array structure. Finding tags are deduplicated in first-seen order without checking the current engine catalogue.

For each affected node, related elements are flattened from `any`, `all`, then `none` checks. The first occurrence of each exact markup/target/optional-XPath tuple is kept. Different targets, different XPath arrays, and absent versus empty XPath remain distinct. Only selected fields are read/copied; live DOM elements, arbitrary check data, ancestry, and full check records are excluded. Returned arrays, nested targets, and objects do not share mutable references with input or sibling mapped outputs.

`affectedNodeCount` equals that finding's mapped node-array length. Main affected nodes and repeated findings are not merged: repeated markup may still identify distinct observations. The later per-case accumulator must group by URL/description and deduplicate problematic markup across scans, updating counts there. This helper has no persistent state.

Incomplete/error observations, passes, and inapplicable results are not converted into findings and remain untouched on the raw input. Callers must retain raw observations for later incomplete/error handling. No `failOnViolation`, case/run status, or continuation policy is applied.

Runner-core now declares its workspace dependency on result-model for shared public output types and contract-validation tests. Type-only imports are erased from mapper runtime code. Its build compiles result-model first, following the existing workspace build pattern. No third-party versions or licence notices changed.

The build and all 109 runner-core tests passed locally on Windows, including 10 new pure mapping tests. Every successful mapping scenario is embedded in a synthetic document and checked through result-model's public validator. A separate TypeScript public-import check confirmed the shared return type and scan-outcome narrowing. These are synthetic/unit checks, not real-browser assessment or dev-container/CI evidence.
