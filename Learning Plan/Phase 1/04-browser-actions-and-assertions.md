# 4. Browser configuration, action vocabulary, and assertion semantics

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, use the exercise to test how well you can specify behaviour precisely.

- [ ] I can distinguish a browser action from an assertion.
- [ ] I can explain how locale, time zone, viewport, and headed/headless mode affect a run.
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

Browser **configuration** establishes the conditions under which a plan runs: for example, browser choice, headed/headless mode, time zone, locale, and viewport. A good contract defines allowed values, units, defaults, and errors for invalid values. The initial runner browser type identifier is `chromium`, representing Playwright-managed Chromium. The agreed defaults are headless mode, a 1280 by 720 CSS-pixel viewport, the `UTC` time zone, and the run-wide BCP 47 locale `en-CA`. Headless mode is run-wide because it is selected when Chromium launches; cases may override viewport and time zone within their isolated contexts, but not headless mode or locale. Keep the editor and runner support matrices separate: the planned editor MVP targets current stable desktop Chrome and Edge on Windows, while the planned Playwright runner MVP uses managed Chromium on Windows; Linux runner and Edge support follow after the MVP. During development, prefer designs that work on both Windows and Linux when practical. See [Playwright's browser documentation](https://playwright.dev/docs/browsers).

An **action** tells the runner to do something, such as navigate or click. An **assertion** asks whether an expected condition holds. Think of actions as stage directions and assertions as the inspector checking that the scene now matches the required setup.

A **hard assertion** stops the current case when it fails. Inside a loop, that means exiting the loop and stopping the case immediately. A **soft assertion** records a failure and lets the case continue; the case still ends as failed if a required soft assertion failed. Independent cases can continue after a recoverable case failure. These rules are specified in [ATR-010](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-010.md); M4 records the hard/soft setting, while M6 owns broader outcome and continuation policy.

## Concepts to understand

- **Deterministic inputs:** settings such as locale and time zone that can change page behaviour and therefore test outcomes.
- **Action vocabulary:** the finite set of supported operations and their required arguments; explicit vocabularies are easier to validate and secure than arbitrary code.
- **Assertion semantics:** the condition being checked, timeout behaviour, failure detail, and effect on control flow.
- **Hard/soft failure:** whether an assertion halts the current test or accumulates findings.
- **Environment vs. plan configuration:** user/CI overrides may coexist with values in a plan; precedence rules must be documented.
- **Accessibility scan behaviour:** scanning is disabled by default, and `failOnViolation` defaults to false. Plan settings can be overridden by cases. Enabled scans run after completed steps, including failed assertions if the browser remains usable; M6 defines how findings and axe execution errors affect case/run status and continuation.
- **Interaction details:** typing characters and setting a field value directly are different operations. Action locators match exact role/label names, wait for zero-match locators on each of up to three attempts with one-second gaps, and fail immediately on multiple matches. Their single timeout includes the gaps; after reserving those gaps, divide the remaining time as evenly as possible across locator waits. A 30-second timeout gives about 9.3 seconds per wait. A `waitFor` locator is checked once per second until it matches exactly one element or its single timeout budget expires; multiple matches fail immediately. Ordered `before` and `after` lists hold optional waits and delays. Interactions scroll targets into view by default, with a per-step option to turn scrolling off.
- **Text vs. HTML assertions:** inner text checks visible text content; inner HTML checks markup content. Input values are checked separately. Assertions compare exact, case-sensitive values by default and are hard unless marked soft. Expected values have a required string `default` and may include string BCP 47 locale overrides; locale tags are canonicalized before matching, duplicate-equivalent keys are invalid, and the default is used when the run locale has no override. An optional `associatedLabel` check compares the associated label's visible text using the same expected-value shape; it is always soft and fails softly if no label is found or multiple labels make the match ambiguous.

## Apply this to Stagehand

[ATR-003](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-003.md) specifies the MVP Windows/Playwright-managed Chromium runner baseline, headed/headless mode, IANA time zone, locale, and viewport dimensions in CSS pixels, with actionable rejection of invalid settings. Linux runner and Edge support follow after the MVP; cross-platform Windows/Linux designs are preferred during development when practical. Separately, the planned editor MVP targets current stable desktop Chrome and Edge on Windows and handles files through upload/import and download/export.

The agreed initial action/assertion set is recorded in [ATR-008](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-008.md): `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue`. A `navigate` step must use an absolute HTTP or HTTPS URL with a host; relative URLs and a `baseURL` setting are deferred. Locators use one strategy per object: role (optionally with accessible name), label, CSS, or XPath. Role and label names match exactly. Action locator lookups wait for zero matches on each of up to three attempts. Their single timeout includes the one-second gaps; after reserving those gaps, divide the remaining time as evenly as possible across the locator waits. A 30-second timeout gives about 9.3 seconds per wait. Multiple matches fail immediately. A `waitFor` locator is different: it is checked once per second until exactly one match appears or the single timeout budget expires, and multiple matches fail immediately. Interactions scroll targets into view by default, and a step may turn that off. Before/after lists run in order and use a locator wait, a `domcontentloaded` or `networkidle` page-state wait, or a delay in milliseconds; timeout overrides use positive integer `timeout` values in milliseconds, and delays are integers from 1 to 30,000 milliseconds. Navigation waits for `domcontentloaded` by default; the default timeout is 30 seconds. Dropdowns may select by option value or visible label. Assertions compare exact, case-sensitive strings; a future `contains` comparison is deferred to [ATR-042](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-042.md). Expected values use an object with a required string `default` and optional string `locales` overrides keyed by BCP 47 locale; keys are canonicalized before matching, duplicate-equivalent keys are invalid, and the default applies when no override matches the run locale. Steps are identified by case ID and sequence position; result documents represent that position with a zero-based index, and authors do not assign step IDs. The current `plan-schema` validates all listed action/assertion shapes, their required fields, absolute HTTP/HTTPS navigation URLs, locator shape, wait-list structures, timeout/delay bounds, and expected-value locale keys. It does not execute actions, waits, or retry behaviour. Runner-core now resolves case locators, runs wait-list items, and provides direct case-session navigation to absolute HTTP/HTTPS URLs. Whole-plan step orchestration remains future work. Variable references are deferred to M5; CLI flag names belong to CLI implementation, while the agreed override precedence remains plan, case, then CLI. `assertValue` may check an associated label's visible text with an `associatedLabel` expected-value object; it is always soft and fails softly when the label is missing or ambiguous. Timeout and assertion diagnostics include case ID, step position, action, locator, and timeout; assertion failures include expected and actual values where available. The execution effects of hard and soft assertions are specified in [ATR-010](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-010.md); M6 owns broader status mapping and execution policy. Reload/back/forward, standalone URL waits, click variants, and additional assertion types are deferred to [ATR-042](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-042.md). Keep browser locale separate from the language used for localized plan descriptions; [ATR-005](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-005.md) explicitly distinguishes these.

## Exercise

Write a plan fragment for a browser configuration and a short sequence of action/assertion steps. For each field, identify a valid example, invalid example, units or format, and expected diagnostic. Trace one hard assertion failure and one soft assertion failure through the remaining steps and final test result. Mark any unresolved behaviour as open instead of assuming it.

## You are ready when

- You can distinguish plan language from Playwright implementation details.
- Configuration errors can be detected before execution where possible and explained to the plan author.
- A reader can explain the hard/soft assertion behaviour in [ATR-010](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-010.md) and identify broader run-policy questions owned by M6.

## Read next

- [ATR-003 — Configure browser and viewport](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-003.md)
- [ATR-005 — Localized plan content](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-005.md)
- [ATR-004 — Reports and accessibility](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-004.md)
- [ATR-008 — Execute supported Playwright browser actions](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-008.md)
- [ATR-009 — Execute steps in order within each test](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-009.md)
- [ATR-010 — Handle hard and soft assertion failures](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-010.md)
- [ATR-012 — Capture step-level diagnostics](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-012.md)
- [Playwright browser documentation](https://playwright.dev/docs/browsers)
- [BCP 47 language-tag specifications](https://www.rfc-editor.org/info/bcp47/)

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
