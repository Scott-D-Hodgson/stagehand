# `@stagehand/runner-core`

This package starts one Playwright-managed Chromium process for a run and creates an isolated browser context and page for each case. Run-wide locale and headless settings use Stagehand defaults when omitted. Each case inherits the run's viewport and time zone, and may override either setting. Headless mode is run-wide because it is selected at browser launch.

The public entry point exports `startBrowserRun`. It returns a run with `createCaseSession` and `close` methods. Each case session exposes `resolveLocator`, which accepts one schema locator (`role`, `label`, `css`, or `xpath`) and returns its unique Playwright locator. Role and label names are matched exactly. A missing match is retried up to three times, with one-second gaps, within the supplied timeout; the default is 30 seconds. The timeout is divided across the locator waits after reserving retry gaps. Multiple matches fail immediately. Close each case session when its case finishes, and call the run's `close` method in a `finally` block. Closing the run waits for in-flight case setup, rejects sessions that have not finished setup when shutdown starts, closes any active case sessions, and then closes Chromium. Concurrent run `close` calls await the same cleanup. This package does not yet execute plan steps, load plans from disk, or build result records.

Build and test from the repository root:

```sh
npm test --workspace @stagehand/runner-core
```

The tests import the public package name and replace the Playwright launch method with small test doubles, so they do not require a downloaded browser.

Playwright and its `playwright-core` dependency use Apache-2.0, not MIT. Their licence text and notices are recorded in the repository's [third-party notices](../../THIRD-PARTY-NOTICES.md), where this non-MIT dependency remains flagged for maintainer review.
