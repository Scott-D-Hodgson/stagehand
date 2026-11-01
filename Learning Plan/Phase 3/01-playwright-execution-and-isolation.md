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
- How case-session type sends sequential character input and fill sets a field value directly, with both actions sharing their timeout with locator resolution.
- How `selectOption` selects a dropdown option by value or visible label while sharing its timeout with locator resolution.
- How exact text, HTML, and input-value assertions share timeouts and report hard/soft failures.
- How optional associated-label checks remain soft and share the input-value assertion's budget.
- How to translate Stagehand's action vocabulary into browser operations.

## Core ideas

A browser process is the launched browser application. A browser context is an isolated profile inside that process, with its own cookies and storage. A page is a tab in a context. A locator describes how to find an element and can resolve when the action runs. Think of the browser as a hotel, contexts as separate rooms, and pages as the windows in each room.

Stagehand's chosen balance is one Playwright-managed browser process with an isolated context for each parallel case. This avoids sharing cookies between cases without launching a separate browser process for every case. Close each context after its case, even when a step fails.

Headless mode is set when Chromium launches, so it applies to the whole run. Each case can still use its own viewport and time zone through its context. The run locale is also shared across cases. `@stagehand/runner-core` exposes this lifecycle plus `resolveLocator`, `runWaitList`, `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` methods on each case session. `assertText` reads inner text, `assertHtml` reads inner HTML, and `assertValue` reads the control's input value; all three compare exact, case-sensitive strings selected for the run locale. The optional input-value label check uses standard HTML associations and is always soft. Navigation requires an absolute HTTP/HTTPS URL, defaults to `domcontentloaded` with a 30-second timeout, and accepts supported overrides. Click uses the locator retry policy, shares the timeout budget with Playwright actionability checks, and supports turning off automatic scrolling. Type enters characters sequentially; fill sets a field value directly. Both share their timeout between locator resolution and the action, scroll targets into view by default, and require an already visible in-viewport target when scrolling is disabled. `selectOption` chooses exactly one option by value or visible label, shares its timeout between locator resolution and selection, and uses the same scroll behaviour. The locator resolver waits for a unique role, label, CSS, or XPath match using the agreed exact-name and retry rules. The wait-list method processes bounded locator, page-state, and fixed-delay waits in order. The `executeSteps` method dispatches validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps in order, applies interaction waits and scrolling options, and wraps hard failures with the case ID and zero-based step index. Soft text, HTML, and input-value mismatches are returned to the caller while later steps continue. The build and all 81 mocked-browser tests passed locally on Windows; dev-container, real-browser, and current CI verification of the input-value slice remain outstanding. Accessibility scans remain future runner work: findings will be kept per case, deduplicated by URL and violation description, and recorded with effective scan settings. Case sessions now provide explicit `scanAccessibility()` calls returning disabled/completed outcomes or cause-preserving execution errors; the expanded local Windows suite has 99 passing tests using browser/adapter doubles. Enabled step dispatch now performs automatic after-step scans and collection. Runner-core now exports the pure `resolveAccessibilitySettings` helper and exposes per-case `session.accessibility` snapshots; defaults are disabled/non-failing/unrestricted tags, and case fields override independently. Run defaults are captured before launch and case settings before asynchronous setup. The helper copies tag lists and expects validated inputs. The accepted companion run-level tag list will scope the assessment when non-empty; omitted/empty tags preserve axe defaults. Keep that input scope distinct from rule tags in findings; see the [scan-scope decision under TE-010](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-scan-scope-option). Result aggregation remains future work.

Prefer user-facing locators such as roles and labels, which tend to survive layout changes better than brittle structure-based selectors. CSS selectors and XPath remain escape hatches when user-facing information is insufficient. Do not hide arbitrary code inside a plan; the supported action vocabulary is intentionally bounded.

## Apply this to Stagehand

The planned Phase 3 action layer covers URL navigation, clicks, typing characters, direct value setting, dropdown selection, bounded waits/delays, optional scrolling into view, text/HTML assertions, input value checks, and optional soft associated-label checks. Navigation plans currently require absolute HTTP/HTTPS URLs; relative URLs await future `baseURL` design. Treat each action as a small operation with explicit inputs, timeout behaviour, and diagnostics. Keep `plan-engine` independent from Playwright; browser operations belong in `runner-core`. The current runner can navigate a case session, resolve locators, run a wait list, perform direct clicks, sequential typing, field filling, option selection, and exact locale-aware text, HTML, and input-value assertions, and dispatch validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps. The build and all 81 mocked-browser tests passed locally on Windows; dev-container, real-browser, and current CI verification of the input-value slice remain outstanding. Runner-core also provides explicit scans and a separate pure violation mapper; the expanded 109-test suite passes locally on Windows. Automatic after-step scans and session collection are implemented; result production remains future work.

For a selector-based action, report the case, step, locator strategy, action, and useful failure reason without dumping secret values. A navigation timeout should say which target and wait condition timed out. A failed assertion is a test outcome; a browser process crash is an execution error. They should not be flattened into the same vague message.

The direct `assertValue` method throws on a value failure and returns optional label failure details. Through `executeSteps`, a soft value failure and a label failure can both be returned for the same step; label failures carry `check: "associatedLabel"`. A hard value failure stops before the label check, and an unsafe browser error remains hard. These returned details do not yet produce serialized results or case/run outcomes. See the [runner-core guide](../Packages/runner-core/README.md) for a worked example.

## Exercise

Map a short login journey to Stagehand operations. For each step, specify the locator strategy, whether it uses character typing or direct fill, what it waits for, and what diagnostic should appear if the target is absent. Identify which resources are created and closed around the case. Separately resolve a plan with scans enabled and two tags against a case that disables scanning and clears tags; show which fields remain inherited and why resolution alone does not run axe. Add an `assertValue` step with a locale override and an associated-label check. Trace a passing value with a missing label, a soft value mismatch with a label mismatch, and a hard value mismatch. State which steps continue and which failure details are returned.

## You are ready when

- You can explain the intended path from browser launch through context creation, the dispatcher for all eight initial actions/assertions and cleanup, and distinguish these from future plan orchestration and result capture.
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
5. A value assertion is hard and passes, but its optional label is missing. Does the dispatcher stop? What changes if the value comparison fails?

<details>
<summary>Answer key</summary>

1. A browser process is shared; each case gets an isolated browser context (and its own page).
2. They describe user-facing meaning and are often less tied to page layout than CSS/XPath selectors.
3. Typing simulates key input; direct value setting fills the field value without simulating each character.
4. Context cleanup releases resources and prevents state leaking into a later case.
5. A missing label returns a soft label failure and later steps continue. A hard value mismatch throws and stops before the label check.

</details>

Caller-owned per-case collection is implemented in runner-core; automatic session integration is now implemented. The local Windows suite passes all 117 tests, including eight collection tests using synthetic observations/documents.
