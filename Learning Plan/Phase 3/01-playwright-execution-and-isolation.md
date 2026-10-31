# 1. Playwright lifecycle, contexts, and action execution

## Self-assessment: do I need this lesson?

- [ ] I can distinguish a browser process, browser context, page, and locator.
- [ ] I understand why a new isolated context is created for each case.
- [ ] I can explain why role and label locators are usually more resilient than CSS selectors.
- [ ] I can distinguish typing characters from setting a field value directly.
- [ ] I can describe how a browser action should report a useful failure.

## What you will learn

- The Playwright objects used to execute a case.
- How contexts isolate cookies and other browser state while reusing a browser process.
- How locators and auto-waiting support predictable interactions.
- How the initial runner-core case session resolves a unique locator with bounded retries.
- How runner-core processes locator, page-state, and fixed-delay waits in order.
- How direct case-session navigation applies URL validation, timeout, and page-state settings.
- How case-session click shares its timeout budget with locator resolution and uses the scroll option.
- How to translate Stagehand's action vocabulary into browser operations.

## Core ideas

A browser process is the launched browser application. A browser context is an isolated profile inside that process, with its own cookies and storage. A page is a tab in a context. A locator describes how to find an element and can resolve when the action runs. Think of the browser as a hotel, contexts as separate rooms, and pages as the windows in each room.

Stagehand's chosen balance is one Playwright-managed browser process with an isolated context for each parallel case. This avoids sharing cookies between cases without launching a separate browser process for every case. Close each context after its case, even when a step fails.

Headless mode is set when Chromium launches, so it applies to the whole run. Each case can still use its own viewport and time zone through its context. The run locale is also shared across cases. `@stagehand/runner-core` exposes this lifecycle plus `resolveLocator`, `runWaitList`, `navigate`, and `click` methods on each case session. Navigation requires an absolute HTTP/HTTPS URL, defaults to `domcontentloaded` with a 30-second timeout, and accepts supported overrides. Click uses the locator retry policy, shares the timeout budget with Playwright actionability checks, and supports turning off automatic scrolling. The locator resolver waits for a unique role, label, CSS, or XPath match using the agreed exact-name and retry rules. The wait-list method processes bounded locator, page-state, and fixed-delay waits in order. Whole-step action execution remains future work.

Prefer user-facing locators such as roles and labels, which tend to survive layout changes better than brittle structure-based selectors. CSS selectors and XPath remain escape hatches when user-facing information is insufficient. Do not hide arbitrary code inside a plan; the supported action vocabulary is intentionally bounded.

## Apply this to Stagehand

The planned Phase 3 action layer covers URL navigation, clicks, typing characters, direct value setting, dropdown selection, bounded waits/delays, optional scrolling into view, text/HTML assertions, input value checks, and optional soft associated-label checks. Navigation plans currently require absolute HTTP/HTTPS URLs; relative URLs await future `baseURL` design. Treat each action as a small operation with explicit inputs, timeout behaviour, and diagnostics. Keep `plan-engine` independent from Playwright; browser operations belong in `runner-core`. The current runner can navigate a case session, resolve locators, run a wait list, and perform a direct click, but it does not yet execute complete plan steps.

For a selector-based action, report the case, step, locator strategy, action, and useful failure reason without dumping secret values. A navigation timeout should say which target and wait condition timed out. A failed assertion is a test outcome; a browser process crash is an execution error. They should not be flattened into the same vague message.

## Exercise

Map a short login journey to Stagehand operations. For each step, specify the locator strategy, whether it uses character typing or direct fill, what it waits for, and what diagnostic should appear if the target is absent. Identify which resources are created and closed around the case.

## You are ready when

- You can explain the intended path from browser launch through context creation, steps, result capture, and cleanup, and distinguish the implemented lifecycle from future step execution and result capture.
- Two cases cannot see each other's cookies or local storage.
- Each action has bounded waits and identifies the failed case and step.

## Read next

- [Playwright browser contexts](https://playwright.dev/docs/browser-contexts)
- [Playwright locators](https://playwright.dev/docs/locators)
- [Playwright input](https://playwright.dev/docs/input)
- [Phase 3 roadmap](../../Planning/Roadmap/Phase-3-execution-engine-and-cli/README.md)
- [Execution engine epic E02](../../Planning/Backlog/epics/E02-execution-engine/README.md)

## Reinforcement quiz

1. Which object is shared by parallel cases, and which is isolated per case in Stagehand?
2. Why are role and label locators the preferred starting point?
3. How does typing differ from direct value setting?
4. Why should cleanup happen after a failed assertion?

<details>
<summary>Answer key</summary>

1. A browser process is shared; each case gets an isolated browser context (and its own page).
2. They describe user-facing meaning and are often less tied to page layout than CSS/XPath selectors.
3. Typing simulates key input; direct value setting fills the field value without simulating each character.
4. Context cleanup releases resources and prevents state leaking into a later case.

</details>
