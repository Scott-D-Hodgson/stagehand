# 4. Browser configuration, action vocabulary, and assertion semantics

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, use the exercise to test how well you can specify behaviour precisely.

- [ ] I can distinguish a browser action from an assertion.
- [ ] I can explain how locale, timezone, viewport, and headed/headless mode affect a run.
- [ ] I understand the difference between hard and soft assertion failures.
- [ ] I can name the details a plan contract should define for an action or assertion.
- [ ] I can distinguish Stagehand's editor browser support from its Playwright runner browser support and explain the agreed failure behaviour.
- [ ] I can explain when axe scans run and whether a finding fails the case by default.

## What you will learn

- Which browser settings affect reproducibility and what must be validated.
- How a small, explicit action vocabulary makes plans predictable.
- The difference between an action and an assertion.
- How hard and soft assertions affect execution and results.

## Core ideas

Browser **configuration** establishes the conditions under which a plan runs: for example, browser choice, headed/headless mode, timezone, locale, and viewport. A good contract defines allowed values, units, defaults (if any), and the error for invalid values. Keep the editor and runner support matrices separate: the editor MVP supports current stable desktop Chrome and Edge on Windows, while the Playwright runner MVP uses managed Chromium on Windows; Linux runner and Edge support follow after the MVP. During development, prefer designs that work on both Windows and Linux when practical. The browser locale is set as a plan-run default and inherited by cases unless a case overrides it. See [Playwright's browser documentation](https://playwright.dev/docs/browsers).

An **action** tells the runner to do something, such as navigate or click. An **assertion** asks whether an expected condition holds. Think of actions as stage directions and assertions as the inspector checking that the scene now matches the required setup.

A **hard assertion** stops the current case when it fails. Inside a loop, that means exiting the loop and stopping the case immediately. A **soft assertion** records a failure and lets the case continue; the case still ends as failed if a required soft assertion failed. Independent cases can continue after a recoverable case failure.

## Concepts to understand

- **Deterministic inputs:** settings such as locale and timezone that can change page behaviour and therefore test outcomes.
- **Action vocabulary:** the finite set of supported operations and their required arguments; explicit vocabularies are easier to validate and secure than arbitrary code.
- **Assertion semantics:** the condition being checked, timeout behaviour, failure detail, and effect on control flow.
- **Hard/soft failure:** whether an assertion halts the current test or accumulates findings.
- **Environment vs. plan configuration:** user/CI overrides may coexist with values in a plan; precedence rules must be documented.
- **Accessibility scan behaviour:** M4 defines the plan/case setting, scan cadence, and deduplicated finding collection. Findings do not fail the case by default, though plan/case configuration can make them fail. M6 defines how configured findings and axe execution errors affect case/run status and continuation.
- **Interaction details:** typing characters and setting a field value directly are different operations. Optional waits, delays, and scrolling need clear per-action rules and bounded timeouts so plans remain understandable and don't hang needlessly.
- **Text vs. HTML assertions:** inner text checks visible text content; inner HTML checks markup content. Input values are checked separately, and a label check is a soft assertion only when configured.

## Apply this to Stagehand

[ATR-003](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-003.md) specifies the MVP Windows/Playwright-managed Chromium runner baseline, headed/headless mode, IANA timezone, locale, and viewport dimensions in CSS pixels, with actionable rejection of invalid settings. Linux runner and Edge support follow after the MVP; cross-platform Windows/Linux designs are preferred during development when practical. Separately, the editor supports current stable desktop Chrome and Edge on Windows and handles files through upload/import and download/export.

The MVP action/assertion set is recorded in [ATR-008](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-008.md): URL navigation; role/label locators by preference, with CSS and XPath escape hatches; click, character typing, direct value setting, and dropdown selection; optional bounded waits/delays and scroll-into-viewport behaviour; text/HTML and input-value comparisons; and an optional soft associated-label check. M4 still needs to define action-specific option combinations, their ordering, timeout diagnostics, and label lookup behaviour when no label exists. M6 owns the status and continuation effects of assertion and accessibility outcomes. Reload/back/forward, standalone URL waits, click variants, and additional assertion types are deferred to [ATR-042](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-042.md). Keep browser locale separate from the language used for localized plan descriptions; [ATR-005](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-005.md) explicitly distinguishes these.

## Exercise

Write a plan fragment for a browser configuration and a short sequence of action/assertion steps. For each field, identify a valid example, invalid example, units or format, and expected diagnostic. Trace one hard assertion failure and one soft assertion failure through the remaining steps and final test result. Mark every behaviour that needs a decision rather than assuming it.

## You are ready when

- You can distinguish plan language from Playwright implementation details.
- Configuration errors can be detected before execution where possible and explained to the plan author.
- A reader can predict exactly what a hard or soft assertion failure does to the current test and overall run.

## Read next

- [ATR-003 — Configure browser and viewport](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-003.md)
- [ATR-005 — Localized plan content](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-005.md)
- [ATR-004 — Reports and accessibility](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-004.md)
- [Playwright browser documentation](https://playwright.dev/docs/browsers)

## Reinforcement quiz

Answer from memory first, then check the answer key.

1. Is “click the sign-in button” an action or an assertion? What about “the dashboard heading is visible”?
2. Why should a plan specify allowed browser settings and reject invalid values clearly?
3. What is the usual distinction between a hard and a soft assertion failure?
4. Name four details that should be defined for a supported action or assertion.
5. What locator types are preferred in Stagehand, and which escape hatches are available?
6. How do accessibility findings affect the case by default, and when can that behaviour change?

<details>
<summary>Answer key</summary>

1. Clicking is an action; checking that the heading is visible is an assertion.
2. Settings affect reproducibility and user expectations; clear validation catches mistakes before they lead to confusing execution behaviour.
3. A hard assertion failure stops the current case (and exits any active loop); a soft assertion records the failure and allows eligible later steps to continue. A required soft failure still makes the case fail.
4. Examples: action name and arguments, assertion condition, units/formats, defaults, timeout, diagnostic shape, and control-flow effect.
5. Prefer user-facing role and label locators; use CSS selectors or XPath when needed.
6. Findings are non-failing by default, but plan/case configuration may make them fail the case.

</details>
