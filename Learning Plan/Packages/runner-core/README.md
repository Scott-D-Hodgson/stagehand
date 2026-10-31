# `@stagehand/runner-core` learning guide

This guide covers runner-core's current browser lifecycle, direct case-session navigation, locator resolver, click, type, fill, selectOption, assertText, assertHtml, and assertValue operations, ordered wait-list runner, and initial step dispatcher. It starts Chromium, manages isolated case sessions, and exposes navigation, locator resolution, direct clicks, character typing, direct field filling, option selection by value or visible label, exact locale-aware text, HTML, and input-value assertions, bounded waits, and sequential dispatch for validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps. Axe scanning remains M4 implementation work; integration with plan loading and result aggregation remain future work.

The runner-core build and all 81 mocked-browser tests passed locally on Windows. Dev-container, real-browser, and current CI verification of the input-value slice remain outstanding. It reads the input value exactly and can check the associated label using standard HTML associations. Label failures are always soft, and the check shares the assertion timeout. The direct API returns label failure details; the dispatcher returns them with `check: "associatedLabel"`. Hard value failures stop before the label check; soft value failures allow it to run. See the [package README](../../../packages/runner-core/README.md) for the API options.

## Self-assessment

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

Each call to `createCaseSession` creates a fresh browser context and page. The case inherits the run viewport and time zone unless it supplies an override; locale remains run-wide. The returned session exposes its context and page, `navigate`, `resolveLocator`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, `assertValue`, `runWaitList`, `executeSteps`, and `close` methods. `navigate` accepts only an absolute HTTP or HTTPS URL with a host; it uses `domcontentloaded` and a 30-second timeout unless the caller supplies supported overrides. It returns the Playwright response, or `null` when Playwright provides no response. The resolver accepts one role, label, CSS, or XPath strategy. Role and label names match exactly. It waits for a unique match; multiple matches fail immediately. Missing matches get up to three attempts, with one-second gaps. The default timeout is 30 seconds; the total timeout is divided across the locator waits after reserving the gaps. `click` shares that timeout budget with Playwright actionability checks and defaults scrolling on; setting `scrollIntoView` to `false` makes an off-screen click fail. `type` enters characters with Playwright `pressSequentially` using the default zero delay between characters, and shares the timeout between locator lookup and typing; with scrolling disabled, the target must fit in the viewport. `fill` sets the field value directly, shares its timeout between locator resolution and filling, and applies the same scroll behaviour as `type`. `selectOption` chooses by option value or visible label, shares its timeout between locator resolution and selection, and applies the same scroll behaviour. `assertText` reads inner text, `assertHtml` reads inner HTML, and `assertValue` reads the control's input value. All three compare exact, case-sensitive strings selected from the run-locale override or the expected default, and their timeout covers locator resolution and reading the content. `runWaitList` processes wait items one by one. Locator waits check once per second until exactly one element matches or the item's timeout expires; multiple matches fail immediately. Page-state waits use Playwright's `domcontentloaded` or `networkidle` state. Fixed delays accept values from 1 to 30,000 milliseconds, and a shorter timeout bounds a delay and reports a timeout error. Each item's timeout defaults to 30 seconds. `executeSteps` runs validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps in order; interaction steps run their optional `before` and `after` wait lists and pass the step's optional `scrollIntoView` setting to the interaction. Hard assertion mismatches throw `StepExecutionError`, which retains the case ID, zero-based step index, action, and original cause. Soft text, HTML, and input-value mismatches are returned with expected and actual content when available while later steps continue. Result aggregation and case/run outcomes remain future work. Close each session after its case, and call the run's `close` method in a `finally` block. Run shutdown first waits for any case-session setup already in progress. Setup that finishes after shutdown begins is rejected and its context is closed. Shutdown then closes active case sessions and Chromium; concurrent `close` calls wait for the same cleanup to finish.

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
| [`src/index.ts`](../../../packages/runner-core/src/index.ts) | Public `startBrowserRun` and case-session APIs, locator resolution, click/type/fill/selectOption/assertText/assertHtml/assertValue execution and associated-label checks, step dispatch, ordered waits, defaults, context creation, and cleanup. |
| [`test/browser-run.test.js`](../../../packages/runner-core/test/browser-run.test.js) | Public-package tests for launch options, effective context settings, and cleanup paths. |
| [`test/navigate.test.js`](../../../packages/runner-core/test/navigate.test.js) | Public-package tests for navigation defaults, supported overrides, URL validation, and error handling. |
| [`test/click.test.js`](../../../packages/runner-core/test/click.test.js) | Public-package tests for unique clicks, timeout sharing, scrolling options, retry behaviour, and error handling. |
| [`test/step-execution.test.js`](../../../packages/runner-core/test/step-execution.test.js) | Public-package tests for ordered step dispatch, interaction wait lists, scrolling, typing, filling, option selection, timeout handling, viewport handling, and failure context. Tests cover all three assertions, locale selection, hard/soft continuation, shared timeout budgets, and associated-label success, mismatch, missing/ambiguous associations, timeouts, and unsafe errors. The current suite has 81 tests, including 19 added for the input-value slice. |
| [`test/locator-resolution.test.js`](../../../packages/runner-core/test/locator-resolution.test.js) | Public-package tests for supported locator forms, exact matching, retries, timeout limits, and ambiguous matches. |
| [`test/wait-list.test.js`](../../../packages/runner-core/test/wait-list.test.js) | Public-package tests for wait ordering, locator polling, page-state timeouts, and bounded delays. |
| [`package.json`](../../../packages/runner-core/package.json) | Public package entry point, scripts, and pinned Playwright dependency. |
| [`README.md`](../../../packages/runner-core/README.md) | Package usage and current implementation boundary. |
| [M4 work plan](../../../Planning/Work%20Plan/M4-browser-actions-and-assertions.md) | Browser settings and execution semantics. |

## Exercise

From the repository root, run:

```sh
npm test --workspace @stagehand/runner-core
```

The build and all 81 mocked-browser tests passed locally on Windows. Trace all three assertion groups to see how locale selection, exact comparison, hard failures, soft failures, and continuation work. In the label tests, follow the callback that reads standard HTML `labels` associations. Explain why these test doubles verify the runner's logic without proving real-browser label behaviour.

Extend the example on paper with a soft value mismatch and a missing label. Predict two returned failures at the same step index, with `check: "associatedLabel"` only on the label failure. Repeat with a hard value mismatch and explain why the label check and later steps do not run. Finally, subtract locator/read time from a 1,000-millisecond budget and identify the time available for the label read.

Then trace the test double through launch, context creation, and cleanup. Change a case viewport override and identify which Playwright option changes. Explain why a case cannot choose a different headless setting while the run shares one browser process. Trace the navigation tests to see how URL validation, defaults, overrides, and Playwright errors are handled. Trace the click tests to see how target retries, timeout sharing, scrolling, and click errors work. Trace the locator tests to see how exact role/label options are passed to Playwright and how timeouts, retries, and multiple matches are handled. Follow the wait-list tests to check ordering and how locator, page-state, and fixed-delay waits are bounded. Trace the dispatcher tests to see how navigation, clicks, typing, filling, and option selection are ordered, when interaction wait lists run, how type/fill/selectOption timeouts are shared, how the no-scroll viewport checks work for text entry, whether `scrollIntoView: false` reaches the click operation, and how the first step failure is reported. Finally, trace the in-flight setup test: identify what shutdown waits for, why a late session is rejected, and when Chromium is closed.

## You are ready when

- You can explain how locale, viewport, and time zone map to Playwright settings.
- You know that headless mode belongs to browser launch and is shared by the run.
- You can distinguish a direct value failure (which throws) from a returned soft label failure, and explain the dispatcher's `check: "associatedLabel"` field.
- You can identify who must close a case session and what run cleanup does if a case is still open.
- You can describe the current locator resolution, click, type, fill, selectOption, assertText, assertHtml, and assertValue policies and explain the `navigate`/`click`/`type`/`fill`/`selectOption`/`assertText`/`assertHtml`/`assertValue` step dispatcher.
- You can explain how direct `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` methods differ from their use through `executeSteps`.
- You can explain how the wait-list API is used by click, type, fill, and selectOption steps and that axe scanning and integration with plan loading remain future work.
- You know the dispatcher currently handles `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue`; axe scanning, integration with plan loading, and result aggregation are not implemented here.

## Reinforcement quiz

1. Which Playwright read distinguishes `assertValue` from text and HTML assertions?
2. What does the direct API return when the value passes but the label is missing?
3. Can one dispatched step return two soft failures?
4. Do the 81 passing mocked-browser tests verify standard label associations in Chromium?

<details>
<summary>Answer key</summary>

1. `inputValue`, rather than `innerText` or `innerHTML`.
2. An `AssociatedLabelFailure` with the expected label and a diagnostic; it does not throw for the missing label.
3. Yes. A soft value mismatch and a label failure can share a step index; the label failure includes `check: "associatedLabel"`.
4. No. They verify the runner logic using test doubles; real-browser coverage remains outstanding.

</details>
