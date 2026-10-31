# `@stagehand/runner-core` learning guide

This guide covers runner-core's current browser lifecycle, case-session locator resolver, and ordered wait-list runner. It starts Chromium, manages isolated case sessions, resolves locators, and runs waits; plan loading and whole-step execution remain separate or future work.

## Self-assessment

- [ ] I can explain why one browser process is shared by a run while each case receives its own context.
- [ ] I can explain why headless mode applies to a whole run.
- [ ] I can describe how run defaults and case overrides become Playwright context options.
- [ ] I can explain how the session resolves each locator form, exact names, retries, timeout budgets, and ambiguous matches.
- [ ] I can explain how the session runs wait-list items in order and bounds each wait.
- [ ] I can trace cleanup when page setup, case cleanup, or run cleanup fails.
- [ ] I can explain why shutdown waits for in-flight setup and how `try/finally` preserves cleanup order.
- [ ] I can run the package tests through its public entry point.

## Package boundary

`startBrowserRun` launches Playwright-managed Chromium. It accepts effective run settings for the plan locale and browser defaults. If omitted, the package uses locale `en-CA`, headless mode, a 1280 by 720 CSS-pixel viewport, and time zone `UTC`. Headless mode is run-wide because Playwright selects it when launching Chromium.

Each call to `createCaseSession` creates a fresh browser context and page. The case inherits the run viewport and time zone unless it supplies an override; locale remains run-wide. The returned session exposes its context and page, a `resolveLocator` method, a `runWaitList` method, and a `close` method. `resolveLocator` accepts one role, label, CSS, or XPath strategy. Role and label names match exactly. It waits for a unique match; multiple matches fail immediately. Missing matches get up to three attempts, with one-second gaps. The default timeout is 30 seconds; the total timeout is divided across the locator waits after reserving the gaps. `runWaitList` processes wait items one by one. Locator waits check once per second until exactly one element matches or the item's timeout expires; multiple matches fail immediately. Page-state waits use Playwright's `domcontentloaded` or `networkidle` state. Fixed delays accept values from 1 to 30,000 milliseconds, and a shorter timeout bounds a delay and reports a timeout error. Each item's timeout defaults to 30 seconds. Close each session after its case, and call the run's `close` method in a `finally` block. Run shutdown first waits for any case-session setup already in progress. Setup that finishes after shutdown begins is rejected and its context is closed. Shutdown then closes active case sessions and Chromium; concurrent `close` calls wait for the same cleanup to finish.

Use `async`/`await` to make the order of browser setup and cleanup clear. A `finally` block still runs if case work or setup fails, so it is the right place to close a case session and the run. Shutdown also has to wait for setup that started before it, otherwise Chromium could close while a context or page is still being created.

This package does not load plan files, validate plans, execute actions, collect results, or apply M6 error/status policy. The caller owns using `loadPlanFile` before browser launch and closing each case session when its case completes.

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
    // The future step executor will use caseSession.page here.
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
| [`src/index.ts`](../../../packages/runner-core/src/index.ts) | Public `startBrowserRun` and case-session APIs, locator resolution, ordered wait lists, defaults, context creation, and cleanup. |
| [`test/browser-run.test.js`](../../../packages/runner-core/test/browser-run.test.js) | Public-package tests for launch options, effective context settings, and cleanup paths. |
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

Then trace the test double through launch, context creation, and cleanup. Change a case viewport override and identify which Playwright option changes. Explain why a case cannot choose a different headless setting while the run shares one browser process. Trace the locator tests to see how exact role/label options are passed to Playwright and how timeouts, retries, and multiple matches are handled. Follow the wait-list tests to check ordering and how locator, page-state, and fixed-delay waits are bounded. Finally, trace the in-flight setup test: identify what shutdown waits for, why a late session is rejected, and when Chromium is closed.

## You are ready when

- You can explain how locale, viewport, and time zone map to Playwright settings.
- You know that headless mode belongs to browser launch and is shared by the run.
- You can identify who must close a case session and what run cleanup does if a case is still open.
- You can describe the current locator resolution policy while recognizing that the runner still does not execute whole plan steps.
- You can explain the wait-list API while recognizing that step actions and integration with plan execution remain future work.
- You know the lifecycle exists but action execution and result aggregation are not implemented here.
