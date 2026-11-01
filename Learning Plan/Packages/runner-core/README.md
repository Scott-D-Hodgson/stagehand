# `@stagehand/runner-core` learning guide

This guide covers runner-core's current browser lifecycle, direct case-session navigation, locator resolver, click, type, fill, selectOption, assertText, assertHtml, and assertValue operations, ordered wait-list runner, initial step dispatcher, explicit accessibility scans, and pure violation-to-finding mapping. It starts Chromium, manages isolated case sessions, and exposes navigation, locator resolution, direct clicks, character typing, direct field filling, option selection by value or visible label, exact locale-aware text, HTML, and input-value assertions, bounded waits, and sequential dispatch for validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps. Caller-owned collection is now available; automatic after-step scans and session/collector integration are now implemented; integration with plan loading and result aggregation remain future work.

The runner-core build and all 81 mocked-browser tests passed locally on Windows. At the input-value slice, dev-container, real-browser, and current CI verification had not yet been recorded. The current verification sections below now cover the existing suites and owner-confirmed PR CI; actual Chromium/axe assessment tests remain deferred. It reads the input value exactly and can check the associated label using standard HTML associations. Label failures are always soft, and the check shares the assertion timeout. The direct API returns label failure details; the dispatcher returns them with `check: "associatedLabel"`. Hard value failures stop before the label check; soft value failures allow it to run. See the [package README](../../../packages/runner-core/README.md) for the API options.

## Accessibility dependency boundary

Runner-core now depends on `@axe-core/playwright@4.14.0`; the lockfile resolves its `axe-core` engine to 4.14.0 and reuses Playwright's existing peer dependency. The adapter's module import and TypeScript use with a Playwright page compile locally; explicit scans and automatic step-dispatch scans are now available. All 81 existing runner-core tests passed after installation, but they use browser doubles.

Both axe packages use the Mozilla Public License 2.0 (MPL-2.0). Stagehand will use their files unchanged. When redistributing them, retain notices and provide access to the covered source. The engine also bundles MIT/ISC components whose attributions live inside its package, so a list of npm dependencies alone does not describe every notice obligation. See [Stagehand's third-party notices](../../../THIRD-PARTY-NOTICES.md#axe-accessibility-dependencies) and the [accepted dependency review under TE-010](../../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#dependency-review). Release packaging still needs to verify those materials in the shipped artifact.

The accepted scan design includes a companion optional run-level tag filter and selected finding/node evidence. Direct scans implement tag filtering, and the pure mapper retains that evidence. A non-empty list scopes the scan itself; at plan scope, an omitted or empty list preserves axe's default rule selection. Plan/case schemas now validate `accessibility.tags`; cases inherit omission, replace the plan list with an explicit list, or clear the filter with `[]`. Finding `tags` describe the rule and are not the input filter. The session API now accepts and resolves these settings and exposes `session.accessibility`, and supports explicit `scanAccessibility()` calls; step dispatch now scans after eligible steps when enabled. Review the [scan-scope decision under TE-010](../../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-scan-scope-option) before wiring scans into step execution.

As a review exercise, locate both axe packages in the lockfile, compare their `LICENSE` files with the reproduced MPL text, and find the engine's `LICENSE-3RD-PARTY.txt`. Explain why installation and a successful import do not prove that scans run after steps.

## Resolving accessibility settings

The pure public `resolveAccessibilitySettings(planSettings?, caseSettings?)` helper returns `enabled`, `failOnViolation`, and `tags`. It starts with disabled, non-failing, unrestricted defaults, and applies each case field independently over the plan value. Explicit `false` must survive: using boolean `||` for this merge would incorrectly discard it. Omitted tag lists inherit, explicit lists replace rather than concatenate, and `[]` clears the filter. A tag list or failure policy does not imply scanning is enabled.

Browser runs capture accessibility defaults before launch; sessions resolve their overrides before asynchronous context/page setup and expose `session.accessibility`. Inputs and output arrays are copied, so changing caller tags or one session's tags does not change another case. The objects are mutable snapshots, not frozen objects. The helper expects validated settings; it does not replace plan-schema's unknown-tag/type checks.

The runner-core build and all 88 tests passed locally on Windows, including seven new tests in [accessibility-settings.test.js](../../../packages/runner-core/test/accessibility-settings.test.js). A separate public TypeScript check confirmed compatibility with result-model's settings type. These checks do not establish dev-container/CI or actual scan execution.

As an exercise, use the [package example](../../../packages/runner-core/README.md#effective-accessibility-settings) to resolve a plan with both booleans true and two tags against a case with enabled false and empty tags. Explain why failOnViolation stays true while scanning stays disabled. Then try an omitted case list and a replacement list. Trace the asynchronous snapshot test and explain what would break if the helper returned a caller's array directly.

## Explicit scan operation

`session.scanAccessibility()` reads its effective accessibility settings. Disabled calls return `{ status: "disabled" }` without analysis. Enabled calls create a fresh adapter, apply a copied non-empty tag list before scanning, and return `{ status: "completed", results }` with raw axe observations. With empty tags, the adapter receives no tag filter.

`completed` means the analysis resolved, not that there are no violations. `failOnViolation` does not change this direct operation; incomplete observations and other result groups are preserved. Rejected configuration or analysis throws `AccessibilityScanError`, retaining the original cause. A separate pure helper now maps violations to Stagehand findings; caller-owned accumulation is now available; after-step cadence/session integration are implemented; M6 outcomes remain future work.

At the explicit-scan slice, the local Windows build and all 99 tests passed, including 11 new scan tests. The [scan tests](../../../packages/runner-core/test/accessibility-scan.test.js) use doubles for successful analysis and failures, plus an actual-adapter/page-double failure check. They do not prove a successful real-browser assessment. A TypeScript public-import check verified discrimination between disabled and completed outcomes.

As an exercise, compare a disabled call, a completed call with a violation, a completed call with incomplete observations, and a rejected scan. Identify which ones return observations and which one throws. Then trace the tag-configuration test to verify that filtering is applied before analysis, and the dispatcher tests to verify enabled scans run after eligible steps.

## Mapping observations to findings

`mapAccessibilityFindings(scan.results)` is a pure projection of raw axe violations into result-model's shared finding types. First check that the scan outcome is completed; a disabled outcome is not an observation object. The mapper copies URL/rule metadata and selected node evidence, preserves optional/null/empty evidence, flattens related elements from `any`/`all`/`none`, removes exact related tuples in first-seen order, and sets the affected-node count to the mapped array length.

This is not case-level accumulation. It preserves repeated affected markup and repeated violations, and has no state between calls. It ignores non-violation groups without mutating them, so callers still need raw incomplete/error observations. Targets and all output arrays are copied; arbitrary check data and live DOM references are not traversed. Read the [mapping contract](../../../packages/runner-core/README.md#mapping-axe-observations) for details.

Runner-core declares a dependency on result-model and builds it first. Its source imports shared output types with `import type`, while tests import the public validator to check mapped findings inside complete synthetic result documents. At the mapping slice, the local Windows build and all 109 tests passed, including 10 new [mapping tests](../../../packages/runner-core/test/accessibility-mapping.test.js); a separate TypeScript import check passed. At the mapping slice, real-browser and dev-container/CI evidence was not yet recorded; see the current verification sections below.

As an exercise, trace related-node evidence repeated across three check groups, then change only one target or XPath. Predict which related entries survive. Next supply two affected nodes with the same markup and explain why both remain before collection deduplicates them. Finally, inspect the shared-validator test helper and distinguish a valid finding/document shape from an executed result pipeline.

## Collecting across scans

The caller-owned `createAccessibilityFindingCollector()` now reuses the mapper through `add(rawResults)`. Create one collector per case. It groups by exact URL and description, retains one node per exact `html` string, and recalculates counts. First-observed finding metadata and node evidence are retained, even when later rule IDs, tags, severity, selectors, or related evidence differ. `getFindings()` returns a deep copied snapshot. Different URLs/descriptions and separate collectors remain isolated. Empty/non-violation scans add nothing; zero-node violations remain with count zero. Raw incomplete/error groups remain available on input for later interpretation. Sessions now use an internal collector for automatic step assessments.

Trace the [collection tests](../../../packages/runner-core/test/accessibility-collection.test.js). Predict the counts after adding one scan twice, new markup at the same URL, and identical markup at a different URL. Then mutate a snapshot target and explain why later snapshots remain unchanged. You are ready when you can distinguish mapper related-tuple deduplication from collector markup deduplication, explain first-observation retention, and identify who owns case association.

At the collection-only slice, the local Windows build and all 117 runner-core tests passed, including eight new collection tests checked through result-model using synthetic documents. Those were the collection-only results; current dev-container and owner-confirmed PR CI evidence is recorded below. Actual Chromium/axe assessments remain deferred.

## Automatic step assessments

Case-session `executeSteps` now awaits automatic accessibility scans after completed steps when enabled, using the existing scan operation and a collector owned by that session. Interaction after-waits finish before scanning. Successful assertions, soft failures, and recognized hard assertion mismatch/locator/timeout failures are scanned while the page is open. Failed interactions, unknown browser errors, and closed pages do not trigger scans. Hard assertions still stop execution after assessment. A scan rejection stops dispatch with StepExecutionError and AccessibilityScanError causes; simultaneous hard assertion and scan errors are preserved in an AggregateError. No failOnViolation outcome policy is applied.

`getAccessibilityFindings()` returns deep copied accumulated findings. `getAccessibilityScans()` returns a new array of copied caseId/stepIndex records retaining the original raw result references, including incomplete observations; callers must treat those results as read-only. This avoids cloning arbitrary adapter data or live references. Repeated executeSteps calls on one session accumulate history; use one session per case. Direct navigation/assertion/scan methods do not automatically collect or trigger extra scans. Scan history retains raw observations for the session lifetime; no pruning or result serialization is implemented.

Trace the [automatic execution tests](../../../packages/runner-core/test/accessibility-execution.test.js). Predict the event sequence for navigate, scan, click, after-wait, scan. Follow the blocked-analysis test and explain why the second action cannot start early. Contrast a soft mismatch, a recognized hard mismatch, an unsafe browser error, and simultaneous assertion/scan failures. You are ready when you can retrieve findings after a thrown step error without treating observations as case outcomes.

The local Windows build and all 131 runner-core tests pass, including 14 new automatic execution tests. Browser/adapter doubles verify cadence, awaited scans, tags, case isolation, failure paths, and copied findings; they do not establish real-browser/frame coverage, dev-container/CI results, or a full result pipeline.

## Reviewing the module structure

Start at the public export list, then follow a call through browser/case-session.ts into the owning action or assertion module. browser/run.ts retains setup and run shutdown coordination; case-session.ts owns collector/history and direct method wiring. steps/execute.ts orders steps and invokes the existing after-step callback; accessibility/scan.ts performs analysis without deciding its timing. Types are grouped with the feature that owns them; browser/types.ts and steps/types.ts connect those features through type-only imports.

As an exercise, trace one click from the public session method and another through dispatch, including after-waits and assessment. Then trace close during pending context setup. Explain why internal modules import each other directly instead of importing index.ts, and why the assertion mismatch error must be the same class in assertions and dispatch. You are ready when you can identify which file owns a change without searching the former large entry point.

The refactor passed the unchanged 131-test suite in the existing Linux dev container. Compatibility checks compared all 36 public type exports and runtime signatures against the original source and confirmed the same eight runtime export names. This is structural verification; no new CI or Chromium/axe assessment evidence is established.

## Self-assessment

- [ ] I can follow the unchanged public import into the owning feature module without importing internal paths as a consumer.
- [ ] I can distinguish run-owned setup/shutdown from session-owned methods, findings/history, and close state.
- [ ] I can explain why moving an error class requires its thrower and dispatcher to import the same class.

- [ ] I can identify eligible automatic scans, distinguish direct APIs from dispatch, and explain why scan rejection stops dispatch without assigning a case outcome.
- [ ] I can distinguish copied findings from copied scan records whose raw result objects remain shared.

- [ ] I can distinguish pure violation mapping, related-node deduplication, caller-owned accumulation, and future outcome policy.
- [ ] I can explain independent accessibility overrides, explicit false values, list replacement/clearing, and snapshot isolation.
- [ ] I can distinguish disabled/completed scan outcomes, incomplete observations, and a rejected scan, without inferring case status.
- [ ] I can explain why installing the axe adapter does not implement scanning, and distinguish implemented direct tag filtering from retained finding tags and implemented automatic cadence.
- [ ] I can explain why one browser process is shared by a run while each case receives its own context.
- [ ] I can explain why headless mode applies to a whole run.
- [ ] I can describe how run defaults and case overrides become Playwright context options.
- [ ] I can explain how `navigate` applies URL validation, timeout, and `waitUntil` settings.
- [ ] I can explain how the session resolves each locator form, exact names, retries, timeout budgets, and ambiguous matches.
- [ ] I can explain how click applies the shared timeout budget and the per-action scroll setting.
- [ ] I can explain how `type` enters characters, shares its timeout, and behaves when scrolling is disabled.
- [ ] I can explain how `fill` sets a field value directly, shares its timeout, and behaves when scrolling is disabled.
- [ ] I can explain how `selectOption` chooses an option by value or visible label and shares its timeout with locator resolution.
- [ ] I can explain how `assertText` selects the expected text for the run locale, compares exact inner text, and returns soft failures while continuing later steps.
- [ ] I can explain how `assertHtml` selects the expected HTML for the run locale, compares exact inner HTML, and returns soft failures while continuing later steps.
- [ ] I can explain how the session runs wait-list items in order and bounds each wait.
- [ ] I can trace cleanup when page setup, case cleanup, or run cleanup fails.
- [ ] I can explain why shutdown waits for in-flight setup and how `try/finally` preserves cleanup order.
- [ ] I can explain exact input-value comparison and the optional soft associated-label check.
- [ ] I can run the package tests through its public entry point.

## Package boundary

`startBrowserRun` launches Playwright-managed Chromium. It accepts effective run settings for the plan locale and browser defaults. If omitted, the package uses locale `en-CA`, headless mode, a 1280 by 720 CSS-pixel viewport, and time zone `UTC`. Headless mode is run-wide because Playwright selects it when launching Chromium.

Each call to `createCaseSession` creates a fresh browser context and page. The case inherits the run viewport and time zone unless it supplies an override; locale remains run-wide. The returned session exposes its context and page, `navigate`, `resolveLocator`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, `assertValue`, `scanAccessibility`, `runWaitList`, `executeSteps`, and `close` methods. `navigate` accepts only an absolute HTTP or HTTPS URL with a host; it uses `domcontentloaded` and a 30-second timeout unless the caller supplies supported overrides. It returns the Playwright response, or `null` when Playwright provides no response. The resolver accepts one role, label, CSS, or XPath strategy. Role and label names match exactly. It waits for a unique match; multiple matches fail immediately. Missing matches get up to three attempts, with one-second gaps. The default timeout is 30 seconds; the total timeout is divided across the locator waits after reserving the gaps. `click` shares that timeout budget with Playwright actionability checks and defaults scrolling on; setting `scrollIntoView` to `false` makes an off-screen click fail. `type` enters characters with Playwright `pressSequentially` using the default zero delay between characters, and shares the timeout between locator lookup and typing; with scrolling disabled, the target must fit in the viewport. `fill` sets the field value directly, shares its timeout between locator resolution and filling, and applies the same scroll behaviour as `type`. `selectOption` chooses by option value or visible label, shares its timeout between locator resolution and selection, and applies the same scroll behaviour. `assertText` reads inner text, `assertHtml` reads inner HTML, and `assertValue` reads the control's input value. All three compare exact, case-sensitive strings selected from the run-locale override or the expected default, and their timeout covers locator resolution and reading the content. `runWaitList` processes wait items one by one. Locator waits check once per second until exactly one element matches or the item's timeout expires; multiple matches fail immediately. Page-state waits use Playwright's `domcontentloaded` or `networkidle` state. Fixed delays accept values from 1 to 30,000 milliseconds, and a shorter timeout bounds a delay and reports a timeout error. Each item's timeout defaults to 30 seconds. `executeSteps` runs validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps in order; interaction steps run their optional `before` and `after` wait lists and pass the step's optional `scrollIntoView` setting to the interaction. Hard assertion mismatches throw `StepExecutionError`, which retains the case ID, zero-based step index, action, and original cause. Soft text, HTML, and input-value mismatches are returned with expected and actual content when available while later steps continue. Result aggregation and case/run outcomes remain future work. Close each session after its case, and call the run's `close` method in a `finally` block. Run shutdown first waits for any case-session setup already in progress. Setup that finishes after shutdown begins is rejected and its context is closed. Shutdown then closes active case sessions and Chromium; concurrent `close` calls wait for the same cleanup to finish.

Use `async`/`await` to make the order of browser setup and cleanup clear. A `finally` block still runs if case work or setup fails, so it is the right place to close a case session and the run. Shutdown also has to wait for setup that started before it, otherwise Chromium could close while a context or page is still being created.

This package does not load plan files, validate plans, build result documents, or apply M6 run/case status policy. Its dispatcher handles `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps supplied by the caller. Soft text, HTML, and input-value mismatches, missing or ambiguous locators, and content-read timeouts are returned to the caller with expected content and a diagnostic; actual content is included when available. The caller owns using `loadPlanFile` before browser launch and closing each case session when its case completes. The runner-core build and all 81 mocked-browser tests passed locally on Windows; the earlier dev-container run covered the 62 tests that preceded `assertValue`.

## Lifecycle example

```ts
import { startBrowserRun } from "@stagehand/runner-core";

const run = await startBrowserRun({
  locale: "fr-CA",
  browser: { headless: true, timeZone: "America/Toronto" },
});
try {
  const caseSession = await run.createCaseSession({
    browser: { viewport: { width: 1024, height: 768 } },
  });
  try {
    const softFailures = await caseSession.executeSteps("sign-in", [
      { action: "navigate", url: "https://example.test/sign-in" },
      { action: "type", locator: { css: "#email" }, text: "tester@example.invalid" },
      {
        action: "assertValue",
        locator: { css: "#email" },
        expected: { default: "tester@example.invalid" },
        associatedLabel: { default: "Email", locales: { "fr-CA": "Courriel" } },
      },
      { action: "fill", locator: { label: "Password" }, value: "synthetic-password" },
      { action: "selectOption", locator: { label: "Language" }, value: "fr-CA" },
      { action: "click", locator: { role: "button", name: "Continue" } },
    ]);
    console.log(softFailures);
  } finally {
    await caseSession.close();
  }
} finally {
  await run.close();
}
```

In this synthetic example, the page supplies an email control with ID `email` and a standard HTML label. Inspect `softFailures` for optional label failures; `executeSteps` does not build a result document or decide the case outcome. The `associatedLabel` value is the expected-value object itself, with `default` and optional `locales` keys.

## Source map

| File | What to learn from it |
| --- | --- |
| [`src/index.ts`](../../../packages/runner-core/src/index.ts) | Explicit public exports only; callers continue to import from @stagehand/runner-core. |
| [`src/defaults.ts`](../../../packages/runner-core/src/defaults.ts) | Shared existing timeout, retry, and viewport defaults. |
| [`src/browser/types.ts`](../../../packages/runner-core/src/browser/types.ts) | Browser configuration, run/session interfaces, and their type-only dependencies. |
| [`src/browser/run.ts`](../../../packages/runner-core/src/browser/run.ts) | Chromium launch, context/page setup, pending setup, active sessions, and coordinated shutdown. |
| [`src/browser/case-session.ts`](../../../packages/runner-core/src/browser/case-session.ts) | Direct API wiring, per-session collector/history, automatic scan callback, and context close. |
| [`src/locators.ts`](../../../packages/runner-core/src/locators.ts) | Locator construction, exact matching, unique resolution, retry budgets, and locator errors. |
| [`src/waits.ts`](../../../packages/runner-core/src/waits.ts) | Ordered locator/state/delay waits and wait errors. |
| [`src/actions/navigation.ts`](../../../packages/runner-core/src/actions/navigation.ts) | Navigation options, URL checks, and execution. |
| [`src/actions/interactions/click.ts`](../../../packages/runner-core/src/actions/interactions/click.ts) | Click options and execution. |
| [`src/actions/interactions/type.ts`](../../../packages/runner-core/src/actions/interactions/type.ts) | Sequential character typing and its timeout/viewport rules. |
| [`src/actions/interactions/fill.ts`](../../../packages/runner-core/src/actions/interactions/fill.ts) | Direct field filling and its timeout/viewport rules. |
| [`src/actions/interactions/select-option.ts`](../../../packages/runner-core/src/actions/interactions/select-option.ts) | Option selection by value or visible label. |
| [`src/assertions.ts`](../../../packages/runner-core/src/assertions.ts) | Locale-aware expected values, text/HTML/value comparison, associated labels, and internal mismatch errors. |
| [`src/steps/types.ts`](../../../packages/runner-core/src/steps/types.ts) | Step contracts, executable-step union, and soft-failure details. |
| [`src/steps/execute.ts`](../../../packages/runner-core/src/steps/execute.ts) | Dispatch ordering, interaction waits, hard/soft handling, after-step callback, and step errors. |
| [`src/accessibility/types.ts`](../../../packages/runner-core/src/accessibility/types.ts) | Raw scan outcomes, settings, collector interface, and scan-history record types. |
| [`src/accessibility/settings.ts`](../../../packages/runner-core/src/accessibility/settings.ts) | Pure plan/case settings resolution. |
| [`src/accessibility/scan.ts`](../../../packages/runner-core/src/accessibility/scan.ts) | Axe adapter execution and cause-preserving scan errors. |
| [`src/accessibility/mapping.ts`](../../../packages/runner-core/src/accessibility/mapping.ts) | Pure raw violation projection and related-node deduplication. |
| [`src/accessibility/collection.ts`](../../../packages/runner-core/src/accessibility/collection.ts) | Stateful per-case finding accumulation and copied snapshots. |
| [`test/accessibility-settings.test.js`](../../../packages/runner-core/test/accessibility-settings.test.js) | Public-package tests for pure resolution, independent overrides, tag list semantics, non-mutation, and run/session snapshots. |
| [`test/accessibility-execution.test.js`](../../../packages/runner-core/test/accessibility-execution.test.js) | Awaited automatic cadence, after-waits, tags, per-session collection, raw history, and error preservation. |
| [`test/accessibility-collection.test.js`](../../../packages/runner-core/test/accessibility-collection.test.js) | Per-case grouping, exact markup deduplication, first-observation retention, count updates, copied snapshots, and synthetic result validation. |
| [`test/accessibility-mapping.test.js`](../../../packages/runner-core/test/accessibility-mapping.test.js) | Pure violation projection, evidence copying/deduplication, counts, and result-contract validation. |
| [`test/accessibility-scan.test.js`](../../../packages/runner-core/test/accessibility-scan.test.js) | Explicit scans: enable/tag handling, raw observations, case overrides, fresh builders, error causes, and automatic dispatch through the same scan operation. |
| [`test/browser-run.test.js`](../../../packages/runner-core/test/browser-run.test.js) | Public-package tests for launch options, effective context settings, and cleanup paths. |
| [`test/navigate.test.js`](../../../packages/runner-core/test/navigate.test.js) | Public-package tests for navigation defaults, supported overrides, URL validation, and error handling. |
| [`test/click.test.js`](../../../packages/runner-core/test/click.test.js) | Public-package tests for unique clicks, timeout sharing, scrolling options, retry behaviour, and error handling. |
| [`test/step-execution.test.js`](../../../packages/runner-core/test/step-execution.test.js) | Public-package tests for ordered step dispatch, interaction wait lists, scrolling, typing, filling, option selection, timeout handling, viewport handling, and failure context. Tests cover all three assertions, locale selection, hard/soft continuation, shared timeout budgets, and associated-label success, mismatch, missing/ambiguous associations, timeouts, and unsafe errors. The current package suite has 131 tests: the prior 81 tests, seven settings tests, 11 scan tests, 10 mapping tests, eight collection tests, and 14 automatic execution tests. |
| [`test/locator-resolution.test.js`](../../../packages/runner-core/test/locator-resolution.test.js) | Public-package tests for supported locator forms, exact matching, retries, timeout limits, and ambiguous matches. |
| [`test/wait-list.test.js`](../../../packages/runner-core/test/wait-list.test.js) | Public-package tests for wait ordering, locator polling, page-state timeouts, and bounded delays. |
| [`package.json`](../../../packages/runner-core/package.json) | Public package entry point, scripts, pinned browser/axe dependencies, and the result-model dependency built first. |
| [`README.md`](../../../packages/runner-core/README.md) | Package usage and current implementation boundary. |
| [M4 work plan](../../../Planning/Work%20Plan/M4-browser-actions-and-assertions.md) | Browser settings and execution semantics. |

## Exercise

From the repository root, run:

```sh
npm test --workspace @stagehand/runner-core
```

The expanded build and all 131 tests passed locally on Windows. Trace the 14 automatic execution tests, eight collection tests, 10 mapping tests, 11 scan tests, seven settings tests and all three assertion groups to see how locale selection, exact comparison, hard failures, soft failures, and continuation work. In the label tests, follow the callback that reads standard HTML `labels` associations. Explain why these test doubles verify the runner's logic without proving real-browser label behaviour.

Extend the example on paper with a soft value mismatch and a missing label. Predict two returned failures at the same step index, with `check: "associatedLabel"` only on the label failure. Repeat with a hard value mismatch and explain why the label check and later steps do not run. Finally, subtract locator/read time from a 1,000-millisecond budget and identify the time available for the label read.

Then trace the test double through launch, context creation, and cleanup. Change a case viewport override and identify which Playwright option changes. Explain why a case cannot choose a different headless setting while the run shares one browser process. Trace the navigation tests to see how URL validation, defaults, overrides, and Playwright errors are handled. Trace the click tests to see how target retries, timeout sharing, scrolling, and click errors work. Trace the locator tests to see how exact role/label options are passed to Playwright and how timeouts, retries, and multiple matches are handled. Follow the wait-list tests to check ordering and how locator, page-state, and fixed-delay waits are bounded. Trace the dispatcher tests to see how navigation, clicks, typing, filling, and option selection are ordered, when interaction wait lists run, how type/fill/selectOption timeouts are shared, how the no-scroll viewport checks work for text entry, whether `scrollIntoView: false` reaches the click operation, and how the first step failure is reported. Finally, trace the in-flight setup test: identify what shutdown waits for, why a late session is rejected, and when Chromium is closed.

## You are ready when

- You can explain how locale, viewport, and time zone map to Playwright settings.
- You know that headless mode belongs to browser launch and is shared by the run.
- You can distinguish a direct value failure (which throws) from a returned soft label failure, and explain the dispatcher's `check: "associatedLabel"` field.
- You can distinguish schema validation, pure accessibility resolution, browser-session snapshots, explicit scanning, pure finding mapping, caller-owned accumulation, implemented automatic cadence, and result production.
- You can identify who must close a case session and what run cleanup does if a case is still open.
- You can describe the current locator resolution, click, type, fill, selectOption, assertText, assertHtml, and assertValue policies and explain the `navigate`/`click`/`type`/`fill`/`selectOption`/`assertText`/`assertHtml`/`assertValue` step dispatcher.
- You can explain how direct `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` methods differ from their use through `executeSteps`.
- You can explain how the wait-list API is used by click, type, fill, and selectOption steps and that automatic scanning is implemented while integration with plan loading remains future work.
- You know the dispatcher currently handles `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue`; automatic scanning is implemented; integration with plan loading and result aggregation remain pending.

## Reinforcement quiz

1. Which Playwright read distinguishes `assertValue` from text and HTML assertions?
2. What does the direct API return when the value passes but the label is missing?
3. Can one dispatched step return two soft failures?
4. Do the 131 passing runner-core tests verify real-browser label behaviour or successful axe assessments?
5. A plan enables scans and failure-on-violation with two tags; a case sets enabled false and tags []. What is resolved?
6. Can a caller mutate one returned tag list without changing run defaults or another session?
7. Should the resolver receive the full plan document or its inner accessibility settings?
8. Does completed mean the page has no violations, and does failOnViolation true make this direct method throw on a finding?
9. Is a disabled scan equivalent to a completed scan with an empty violations list?
10. How are incomplete observations different from an adapter promise rejection?
11. Two checks report the same related markup/target/XPath, but two main affected nodes also share markup. What does the mapper deduplicate?
12. Does an empty mapped findings array prove that an assessment passed, and does mapping validate arbitrary JSON?
13. Two scans have the same URL/description/markup but different selectors, tags, or severity. What does the collector keep?
14. Does the collector know which case it belongs to, and can you clear it by passing an empty scan?
15. When does a click with after-waits scan, and can the next step begin before analysis resolves?
16. What is retained if a hard assertion and its scan both fail?
17. Does mutating raw results from getAccessibilityScans mutate a deep copied observation?
18. After restructuring, should consumers import executeClick from an internal interaction path?
19. Which modules own pending context setup, accumulated scan history, and the order of after-step assessments?
20. Do passing refactor tests establish new Chromium/axe or CI evidence?

<details>
<summary>Answer key</summary>

1. `inputValue`, rather than `innerText` or `innerHTML`.
2. An `AssociatedLabelFailure` with the expected label and a diagnostic; it does not throw for the missing label.
3. Yes. A soft value mismatch and a label failure can share a step index; the label failure includes `check: "associatedLabel"`.
4. No. Browser-dependent tests use doubles; real-browser label and scan integration remain unverified by this suite.
5. Enabled false, failOnViolation true, and tags []. Each field is independent, and failure policy does not enable scans.
6. Yes. Each result has copied tags; the snapshots are mutable but do not share their arrays.
7. The inner settings, after validation. The helper does not load documents or validate tag membership/types.
8. Neither. Completed means analysis resolved; raw observations are returned without applying case/run outcome policy.
9. No. Disabled means no assessment was requested and there is no results object. An enabled assessment may complete with no violations, potentially still containing incomplete observations.
10. Incomplete observations, including any per-rule error details supplied by axe, remain in raw results. A rejected configuration/analysis promise throws AccessibilityScanError with its cause. Their later classification and policy remain separate work.

11. It keeps the exact related tuple once per affected node, in first-seen any/all/none order. Both main nodes remain in mapper output; the separate collector deduplicates exact markup. Absent and empty XPath lists remain distinct.
12. No to both. Only violations are mapped; raw incomplete/error observations still need interpretation. The helper expects trusted typed axe results and does not run a runtime validator.

13. The first finding metadata and first node evidence. Exact markup defines duplicate nodes within the URL/description group; changed selectors do not append another node.
14. No to both. The caller creates one collector per case; the collector stores no case ID. Empty scans leave existing findings unchanged. Create a new collector for a new case.

15. After the action and its after-waits. The dispatcher awaits assessment before starting the next step. Direct click calls do not trigger automatic scans.
16. A StepExecutionError wraps an AggregateError containing the assertion error first and scan error second. A scan rejection after a successful step is wrapped with step context and its AccessibilityScanError cause. No case/run outcome is calculated.
17. No. The array and record wrappers are copied, but raw result objects retain their original references and must be treated as read-only. Findings are separately deep copied.

18. No. The public package import and exports remain unchanged. Internal helper exports connect implementation modules; they are not new public subpath APIs.
19. browser/run.ts owns pending setup and coordinated run shutdown; browser/case-session.ts owns accumulated scan history and session cleanup; steps/execute.ts determines when to invoke the after-step callback, which the session wires to scanning and collection.
20. No. The unchanged 131-test suite passed in the existing dev container, and API compatibility checks passed. Actual Chromium/axe verification stays deferred, and CI for this refactor must be recorded separately.

</details>

## Deferred real-browser assessment exercise

The owner deferred actual Chromium/axe integration tests until the project contains its own test site. Resume this verification when that site is available; cover successful assessments, tag scope, repeated-scan deduplication, frames, and cleanup against synthetic site content. This is deferred verification, not a passing browser assessment or evidence that M4 is complete. Existing unit tests and dev-container/CI checks that do not require real Chromium/axe assessments can proceed independently. The site location, design, and implementation slice have not been selected. See the [M4 verification decision](../../../Planning/Work%20Plan/M4-browser-actions-and-assertions.md#deferred-chromiumaxe-verification). For now, trace the browser/adapter-double tests and identify what they cannot establish about actual Chromium assessments.

## Current dev-container verification

The agent ran the existing suites in the running Stagehand Linux dev container at checkout `fe539f7`, using the repository Dockerfile environment with Node.js 26.12.1 and npm 11.20.0. `npm ci` succeeded, and `npm ls --workspaces --depth=0` then showed all seven linked workspaces without extraneous dependencies. Each package test command built its package successfully: plan-schema 39/39, plan-engine 17/17, result-model 22/22, and runner-core 131/131. All 209 tests passed with zero failures and zero skips, including the three filesystem-link tests previously skipped on Windows. These were the existing suites with browser/adapter doubles; no actual Chromium/axe assessments were run. This verifies the current checkout in the existing container, not a fresh container image build, GitHub CI run, or production Linux runner support.

As an evidence-reading exercise, explain why this run closes the current dev-container unit-suite gap but does not verify Chromium/axe assessments, GitHub CI, or a clean rebuild of the container image. The earlier Windows and per-slice results remain historical evidence.

## CI evidence update

The owner confirmed that GitHub CI passed on every PR through the merged automatic-assessment PR #50. This is owner-reported remote verification, separate from the agent-run 209-test dev-container verification. The agent did not inspect individual workflow runs or collect run URLs. Actual Chromium/axe assessments remain deferred until a project-owned test site exists; passing CI does not supply that missing browser evidence. Earlier per-slice statements describe the evidence available at those stages; current verification now includes the existing dev-container suite and owner-confirmed PR CI.

## Verification readiness check

M4 implementation tasks are complete. The existing suites pass in the running dev container (209 tests, no failures or skips), and the owner confirmed passing GitHub CI on every PR through PR #50. Actual Chromium/axe assessment verification is explicitly deferred until a project-owned test site exists. This status does not claim complete browser verification or close the deferred tasks; no test-site design or implementation has been agreed.

Explain which evidence supports each claim: 209 passing tests in the existing container, the owner confirmation of PR CI, and the absence of actual Chromium/axe assessments. You are ready when you can explain why passing browser-double tests and CI do not demonstrate frame scanning or real browser cleanup. Identify the project test site as the trigger to resume that verification.
