# M4 — Browser configuration, actions, and assertions

**Estimate:** 3–5 person-days  
**Depends on:** M2, M3  
**Roadmap item:** Browser configuration, action vocabulary, assertion semantics

## Tasks

- [x] Review [ATR-003](../Backlog/epics/E01-plan-definition/stories/ATR-003.md) and the execution-related stories before fixing the contract.
- [x] Define the MVP support matrix: Windows with Playwright-managed Chromium, using the Node.js version selected in M2; schedule Linux runner and Edge support after the MVP. During development, prefer designs that work on both Windows and Linux when practical.
- [x] Record the initial runner target as Windows with Playwright-managed Chromium; branded Google Chrome is not a separate initial support target.
- [x] Select `chromium` as the initial browser type identifier; plan and case schemas reject other browser types.
- [x] Specify default headless mode `true` as run-wide because it is selected at Chromium launch; cases cannot override it. Set the default viewport to 1280 by 720 CSS pixels with positive integer dimensions and no Stagehand-specific maximum, default IANA time zone to `UTC`, and default run-wide BCP 47 locale to `en-CA`; cases cannot override locale.
- [x] Set the default navigation wait to `domcontentloaded`, the default action/navigation timeout to 30 seconds, and the maximum explicit fixed delay to 30 seconds; allow explicit bounded `networkidle` waits.
- [x] Require `navigate.url` to be an absolute HTTP or HTTPS URL with a host; defer relative URLs and any `baseURL` setting for future consideration under [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md).
- [x] Agree that locators use one strategy per object: role (optionally with accessible name), label, CSS, or XPath.
- [x] Require exact role/label names; fail immediately on multiple matches and retry zero matches up to three total attempts by default. Reserve one-second gaps between attempts, then divide the remaining action timeout as evenly as possible among the locator waits; a 30-second timeout gives about 9.3 seconds per wait.
- [x] Choose action names `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue`; distinguish character typing from direct field setting and allow dropdown selection by value or visible label.
- [x] Use ordered `before` and `after` lists; default `scrollIntoView` to true for interactions, with a per-step option to turn it off.
- [x] Use exact, case-sensitive assertion comparisons and make assertions hard by default; soft assertions use `soft: true`. Defer contains comparisons beyond MVP.
- [x] Identify steps by case ID and sequence position; represent the result position as a zero-based index and do not require author-assigned step IDs.
- [x] Keep action inputs literal for M4; define variable references in M5. Preserve CLI-over-plan precedence while deferring exact CLI flags to CLI implementation.
- [x] Use standard HTML label associations for optional soft label checks; fail softly when none is associated or multiple labels make the match ambiguous. Accessibility scans run after completed steps, including failed assertions when the browser remains usable.
- [x] Default axe scanning to disabled and `failOnViolation` to false; plan settings can be overridden by case settings. M6 defines outcome and continuation policy.
- [x] Add browser-default annotations, locale and time-zone checks, and locator-shape validation to `@stagehand/plan-schema`; public-entry tests cover these rules.
- [x] Set the delay between locator retries to one second, with up to three total attempts by default. The action timeout includes those gaps and is divided across the waits; an expired budget prevents another attempt.
- [x] Give each assertion an `expected` object with a required `default` and optional BCP 47 keyed `locales` overrides; use the default when no override exists for the run locale.
- [x] Make an optional associated-label check fail softly when multiple labels make the association ambiguous.
- [x] Use `timeout` for per-action and per-wait timeout overrides, measured in milliseconds.
- [x] Define before/after wait-list items as a `waitFor` locator, `waitForState` of `domcontentloaded` or `networkidle`, or a `delay` in milliseconds, with optional `timeout` in milliseconds for waits.
- [x] Keep reload/back/forward, standalone URL waits, distinct click variants, and additional assertion types (visibility, enabled/disabled, checked state, attributes, URL, and page title) out of MVP; track them in [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md).
- [x] Define timeout and assertion diagnostic details: case ID, step position, action, relevant locator, timeout value, and expected/actual values where available. M5 defines redaction if expected values later support secrets; [ATR-010](../Backlog/epics/E02-execution-engine/stories/ATR-010.md) and M6 own hard/soft continuation and status policy.
- [x] Require positive integer timeout values in milliseconds and integer delays from 1 to 30,000 milliseconds. Canonicalize BCP 47 locale-override keys for matching and reject keys that canonicalize to duplicates.
- [x] Use one timeout budget for each `waitFor` locator; check once per second until exactly one match appears or the timeout expires. Fail immediately on multiple matches. The three-attempt rule applies to action locator lookups, not `waitFor` items.
- [x] Encode the agreed precedence baseline: plan JSON supplies plan defaults, cases inherit plan values, explicit case values override inherited values, and CLI configuration overrides JSON at the targeted scope. Defer CLI flag names to CLI implementation and variable references to M5.
- [x] Define accessibility settings and scan behaviour: scans are disabled by default, findings are non-failing by default, plan settings can be overridden by cases, and enabled scans run after completed steps with deduplicated findings. M6 defines how configured failure policies affect case/run outcomes and continuation.
- [x] Represent the agreed action, assertion, browser-setting, accessibility, and navigation-URL contracts in the schemas, examples, and tests. `plan-schema` validates step shapes, absolute HTTP/HTTPS navigation URLs, and locale-key semantics; it does not execute actions or apply retry policy.
- [x] Add public-entry tests for the supported actions, assertions, waits, locale overrides, timeout/delay constraints, and accessibility settings.
- [x] Run `npm test --workspace @stagehand/plan-schema`; the build succeeded and all 32 tests passed in the dev container after absolute HTTP/HTTPS URL validation was added.
- [x] Update the Phase 1 and package learning guides to reflect the implemented schema boundary.
- [x] Implement the initial browser lifecycle in [`@stagehand/runner-core` under TE-003](../Backlog/technical-enablers/te-003-playwright-browser-lifecycle-and-factory.md): one Playwright-managed Chromium process per run and one isolated browser context/page per case. Apply run-wide locale/headless defaults and case-overridable viewport/time-zone settings; wait for in-flight case setup before browser shutdown, reject sessions whose setup finishes after shutdown starts, and make concurrent run cleanup calls await the same promise.
- [x] Add case-session locator resolution to runner-core for role, label, CSS, and XPath strategies, enforcing exact role/label names, unique matches, and the agreed bounded retry policy.
- [x] Add ordered case-session wait-list execution for locator waits, page-state waits, and bounded fixed delays.
- [x] Add case-session navigation for absolute HTTP/HTTPS URLs, with `domcontentloaded` and a 30-second timeout by default plus supported overrides.
- [x] Add a direct case-session click method using the agreed locator retry policy, shared timeout budget, and default scroll behaviour.
- [x] Add an initial case-step dispatcher that runs validated `navigate` and `click` steps in order, including click `before`/`after` waits, and wraps failures with case ID and zero-based step index. Result records and outcome aggregation remain out of scope for this slice.
- [x] Add public-entry tests for ordered step dispatch, click wait lists, and failure context.
- [x] Build and run the runner-core suite with the new dispatcher tests in the dev container; all 32 tests passed.
- [x] Add a public-entry test confirming `scrollIntoView: false` is passed through to the click operation.
- [x] Rerun the runner-core suite with the step-level scrolling test; all 33 tests passed in the dev container.
- [x] Add the initial `type` step handler using Playwright's sequential character input, shared locator/action timeout, ordered waits, and scroll option.
- [x] Add public-entry tests for typing, timeout handling, and the no-scroll viewport check.
- [x] Build and run the expanded runner-core suite in the dev container; all 37 tests passed.
- [x] Implement the `fill` step handler and direct case-session method with ordered waits, shared timeout, and the no-scroll viewport check.
- [x] Add public-entry tests for fill dispatch, timeout sharing, viewport handling, and error context.
- [ ] Build and run the expanded runner-core suite with fill tests in the dev container.
- [x] Pin Playwright 1.64.1 and include its Apache-2.0 licence and attribution notice in `THIRD-PARTY-NOTICES.md`; its non-MIT licence remains flagged for maintainer review.
- [x] Build and run the runner-core public-entry tests in the dev container; all 25 tests passed before the initial step dispatcher was added.
- [x] Add runner-core tests to the GitHub Actions Linux and Windows jobs.
- [ ] Confirm the GitHub Actions Linux and Windows jobs pass.

## Completion evidence

- A plan author can determine valid settings and actions from the contract alone.
- The initial action set covers URL navigation, the requested selector-based interactions, bounded optional waits/delays, and viewport handling; each option's applicability and ordering are explicit.
- The initial assertions cover inner text/HTML and input value comparisons, with associated-label soft checks specified or explicitly deferred.
- Invalid settings and unknown actions fail clearly before execution where possible.
- The action schema represents hard/soft assertion mode; [ATR-010](../Backlog/epics/E02-execution-engine/stories/ATR-010.md) and M6 define continuation and result-status effects.
- Examples and invalid fixtures reflect the documented rules; public-entry tests cover the supported action and assertion forms.
- `@stagehand/runner-core` starts one Chromium process per run, creates isolated case contexts/pages with effective browser settings, coordinates in-flight setup with idempotent run cleanup, resolves unique locators, runs ordered wait lists, exposes case-session navigation, clicks, sequential typing, and direct field filling, and initially dispatches validated `navigate`, `click`, `type`, and `fill` steps. The 37-test suite passed before fill was added; four fill tests are authored and the expanded suite run is pending.
- The plan-schema suite passes all 32 tests in the dev container, including absolute HTTP/HTTPS navigation URL checks. GitHub Actions checks are configured; their result for the current PR is not yet recorded here.

## Learning reference

[Browser configuration, action vocabulary, and assertion semantics](../../Learning%20Plan/Phase%201/04-browser-actions-and-assertions.md)
