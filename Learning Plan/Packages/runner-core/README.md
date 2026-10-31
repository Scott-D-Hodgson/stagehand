# `@stagehand/runner-core` learning guide

This guide covers runner-core's current browser lifecycle, direct case-session navigation, locator resolver, click operation, ordered wait-list runner, and the initial step dispatcher. It starts Chromium, manages isolated case sessions, and exposes navigation, locator resolution, direct clicks on unique matches, bounded waits, and sequential dispatch for validated `navigate` and `click` steps. Other actions, assertions, plan loading, and result aggregation remain future work.

## Self-assessment

- [ ] I can explain why one browser process is shared by a run while each case receives its own context.
- [ ] I can explain why headless mode applies to a whole run.
- [ ] I can describe how run defaults and case overrides become Playwright context options.
- [ ] I can explain how `navigate` applies URL validation, timeout, and `waitUntil` settings.
- [ ] I can explain how the session resolves each locator form, exact names, retries, timeout budgets, and ambiguous matches.
- [ ] I can explain how click applies the shared timeout budget and the per-action scroll setting.
- [ ] I can explain how the session runs wait-list items in order and bounds each wait.
- [ ] I can trace cleanup when page setup, case cleanup, or run cleanup fails.
- [ ] I can explain why shutdown waits for in-flight setup and how `try/finally` preserves cleanup order.
- [ ] I can run the package tests through its public entry point.

## Package boundary

`startBrowserRun` launches Playwright-managed Chromium. It accepts effective run settings for the plan locale and browser defaults. If omitted, the package uses locale `en-CA`, headless mode, a 1280 by 720 CSS-pixel viewport, and time zone `UTC`. Headless mode is run-wide because Playwright selects it when launching Chromium.

Each call to `createCaseSession` creates a fresh browser context and page. The case inherits the run viewport and time zone unless it supplies an override; locale remains run-wide. The returned session exposes its context and page, `navigate`, `resolveLocator`, `click`, `runWaitList`, `executeSteps`, and `close` methods. `navigate` accepts only an absolute HTTP or HTTPS URL with a host; it uses `domcontentloaded` and a 30-second timeout unless the caller supplies supported overrides. It returns the Playwright response, or `null` when Playwright provides no response. The resolver accepts one role, label, CSS, or XPath strategy. Role and label names match exactly. It waits for a unique match; multiple matches fail immediately. Missing matches get up to three attempts, with one-second gaps. The default timeout is 30 seconds; the total timeout is divided across the locator waits after reserving the gaps. `click` shares that timeout budget with Playwright actionability checks and defaults scrolling on; setting `scrollIntoView` to `false` makes an off-screen click fail. `runWaitList` processes wait items one by one. Locator waits check once per second until exactly one element matches or the item's timeout expires; multiple matches fail immediately. Page-state waits use Playwright's `domcontentloaded` or `networkidle` state. Fixed delays accept values from 1 to 30,000 milliseconds, and a shorter timeout bounds a delay and reports a timeout error. Each item's timeout defaults to 30 seconds. `executeSteps` runs validated `navigate` and `click` steps in order; click steps run their optional `before` and `after` wait lists. The first failure stops execution and throws `StepExecutionError`, which retains the case ID, zero-based step index, action, and original cause. The method does not build result records or assign case/run outcomes. Close each session after its case, and call the run's `close` method in a `finally` block. Run shutdown first waits for any case-session setup already in progress. Setup that finishes after shutdown begins is rejected and its context is closed. Shutdown then closes active case sessions and Chromium; concurrent `close` calls wait for the same cleanup to finish.

Use `async`/`await` to make the order of browser setup and cleanup clear. A `finally` block still runs if case work or setup fails, so it is the right place to close a case session and the run. Shutdown also has to wait for setup that started before it, otherwise Chromium could close while a context or page is still being created.

This package does not load plan files, validate plans, execute the full schema-defined action set, collect results, or apply M6 error/status policy. Its initial dispatcher handles only `navigate` and `click` steps supplied by the caller. The caller owns using `loadPlanFile` before browser launch and closing each case session when its case completes.

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
    await caseSession.executeSteps("sign-in", [
      { action: "navigate", url: "https://example.test/sign-in" },
      { action: "click", locator: { role: "button", name: "Continue" } },
    ]);
  } finally {
    await caseSession.close();
  }
} finally {
  await run.close();
}
```

## Source map

| File | What to learn from it |
| --- | --- |
| [`src/index.ts`](../../../packages/runner-core/src/index.ts) | Public `startBrowserRun` and case-session APIs, locator resolution, click execution, ordered wait lists, defaults, context creation, and cleanup. |
| [`test/browser-run.test.js`](../../../packages/runner-core/test/browser-run.test.js) | Public-package tests for launch options, effective context settings, and cleanup paths. |
| [`test/navigate.test.js`](../../../packages/runner-core/test/navigate.test.js) | Public-package tests for navigation defaults, supported overrides, URL validation, and error handling. |
| [`test/click.test.js`](../../../packages/runner-core/test/click.test.js) | Public-package tests for unique clicks, timeout sharing, scrolling options, retry behaviour, and error handling. |
| [`test/step-execution.test.js`](../../../packages/runner-core/test/step-execution.test.js) | Public-package tests for ordered step dispatch, click wait lists, and failure context. |
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

Then trace the test double through launch, context creation, and cleanup. Change a case viewport override and identify which Playwright option changes. Explain why a case cannot choose a different headless setting while the run shares one browser process. Trace the navigation tests to see how URL validation, defaults, overrides, and Playwright errors are handled. Trace the click tests to see how target retries, timeout sharing, scrolling, and click errors work. Trace the locator tests to see how exact role/label options are passed to Playwright and how timeouts, retries, and multiple matches are handled. Follow the wait-list tests to check ordering and how locator, page-state, and fixed-delay waits are bounded. Trace the dispatcher tests to see how navigation and clicks are ordered, when click wait lists run, and how the first step failure is reported. Finally, trace the in-flight setup test: identify what shutdown waits for, why a late session is rejected, and when Chromium is closed.

## You are ready when

- You can explain how locale, viewport, and time zone map to Playwright settings.
- You know that headless mode belongs to browser launch and is shared by the run.
- You can identify who must close a case session and what run cleanup does if a case is still open.
- You can describe the current locator resolution and click policies and explain the initial `navigate`/`click` step dispatcher.
- You can explain how direct `navigate` and `click` methods differ from their use through `executeSteps`.
- You can explain how the wait-list API is used by click steps and that other action handlers and integration with plan loading remain future work.
- You know the dispatcher handles `navigate` and `click` only; other action handlers, plan loading, and result aggregation are not implemented here.
