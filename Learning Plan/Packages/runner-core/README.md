# `@stagehand/runner-core` learning guide

This guide covers the first browser lifecycle implementation. It starts Chromium and manages isolated case sessions; plan loading and step execution remain separate or future work.

## Self-assessment

- [ ] I can explain why one browser process is shared by a run while each case receives its own context.
- [ ] I can explain why headless mode applies to a whole run.
- [ ] I can describe how run defaults and case overrides become Playwright context options.
- [ ] I can trace cleanup when page setup, case cleanup, or run cleanup fails.
- [ ] I can explain why shutdown waits for in-flight setup and how `try/finally` preserves cleanup order.
- [ ] I can run the package tests through its public entry point.

## Package boundary

`startBrowserRun` launches Playwright-managed Chromium. It accepts effective run settings for the plan locale and browser defaults. If omitted, the package uses locale `en-CA`, headless mode, a 1280 by 720 CSS-pixel viewport, and time zone `UTC`. Headless mode is run-wide because Playwright selects it when launching Chromium.

Each call to `createCaseSession` creates a fresh browser context and page. The case inherits the run viewport and time zone unless it supplies an override; locale remains run-wide. The returned session exposes its context and page and has a `close` method. Close each session after its case, and call the run's `close` method in a `finally` block. Run shutdown first waits for any case-session setup already in progress. Setup that finishes after shutdown begins is rejected and its context is closed. Shutdown then closes active case sessions and Chromium; concurrent `close` calls wait for the same cleanup to finish.

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
| [`src/index.ts`](../../../packages/runner-core/src/index.ts) | Public `startBrowserRun` API, defaults, case context creation, and cleanup. |
| [`test/browser-run.test.js`](../../../packages/runner-core/test/browser-run.test.js) | Public-package tests for launch options, effective context settings, and cleanup paths. |
| [`package.json`](../../../packages/runner-core/package.json) | Public package entry point, scripts, and pinned Playwright dependency. |
| [`README.md`](../../../packages/runner-core/README.md) | Package usage and current implementation boundary. |
| [M4 work plan](../../../Planning/Work%20Plan/M4-browser-actions-and-assertions.md) | Browser settings and execution semantics. |

## Exercise

From the repository root, run:

```sh
npm test --workspace @stagehand/runner-core
```

Then trace the test double through launch, context creation, and cleanup. Change a case viewport override and identify which Playwright option changes. Explain why a case cannot choose a different headless setting while the run shares one browser process. Finally, trace the in-flight setup test: identify what shutdown waits for, why a late session is rejected, and when Chromium is closed.

## You are ready when

- You can explain how locale, viewport, and time zone map to Playwright settings.
- You know that headless mode belongs to browser launch and is shared by the run.
- You can identify who must close a case session and what run cleanup does if a case is still open.
- You know the lifecycle exists but action execution and result aggregation are not implemented here.
