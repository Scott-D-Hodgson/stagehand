# 6. Error model and execution policies

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, use the exercise to see whether you can make failure handling consistent end to end.

- [ ] I can distinguish a plan-validation error, a test assertion failure, and a runner/infrastructure failure.
- [ ] I can explain what an execution policy decides after a failure.
- [ ] I understand how diagnostic context helps a user decide what to fix.
- [ ] I can explain how a CLI exit code helps automation interpret a run.
- [ ] I know why continuing after a failure must not hide that failure.

## What you will learn

- How to classify failures by where they occur and what they mean.
- How error categories affect user messages, reports, and exit codes.
- How execution policies define what the runner does after a failure.
- How to make failure handling consistent and testable.

## Core ideas

An **error model** is the set of error categories, details, and reporting rules used by a system. An **execution policy** says what the runner does when an event occurs: stop the current step, stop the current test, continue to later tests, or abort the run.

Think of a theatre performance with a checklist. A missing prop discovered before the show is a setup issue; an actor missing a cue during one scene is a scene issue; a broken lighting system that prevents the performance is an equipment issue. Calling all three “the show failed” makes it hard to know who should act next.

For Stagehand, useful distinctions include invalid plan/schema errors before browser launch, case assertion failures, browser/action errors, cancellation, accessibility findings, and runner/infrastructure failures. A `failed` case means one or more configured success conditions were not met; diagnostics retain the source, such as a functional assertion or an accessibility finding configured to fail. Result timestamps use RFC 3339 UTC strings and elapsed durations use integer milliseconds, but elapsed time should be measured with a monotonic clock so system clock adjustments do not skew it. M6 must distinguish whole-run elapsed time from active-case time. The active-case execution timeout defaults to 10 minutes and can be overridden by plan/case settings; active-case timing excludes queue wait, browser/context startup, and cleanup, while browser startup has a separate bound. The runner records elapsed run/case time and supports duration thresholds. How a plan-wide active timeout behaves with parallel cases still needs definition.

## Concepts to understand

- **Failure source:** validation, test expectation, browser interaction, report writing, or runtime/infrastructure.
- **Recoverability:** whether the runner can safely continue after the failure.
- **Scope of stopping:** current action, current test, remaining tests, or whole run.
- **Diagnostic context:** stable case ID, zero-based step index, failure category, useful message, and safe supporting details.
- **Exit code:** a compact signal for shells and CI; it should consistently reflect documented outcomes.
- **Failure vs. finding:** an accessibility finding or soft assertion may be recorded separately from a runner failure; status mapping needs to be deliberate.
- **Error masking:** a later failure should not overwrite the original cause, though cleanup errors may need to be attached as secondary information.

## Apply this to Stagehand

The Phase 1 roadmap calls for an error model and execution policies; later backlog items include execution context and failure policy ([TE-004](../../Planning/Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md)). Plan validation is required before browser execution by [ATR-002](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md). This gives a useful design boundary: if the plan cannot be understood, no browser should be launched and the outcome should not masquerade as a test failure.

Write a decision table before writing catch/continue logic. For each failure class, state whether execution continues, what status is reported, what diagnostics are retained, and what the CLI ultimately signals. Stagehand's MVP result is JSON only, with `passed`, `failed`, `cancelled`, and `error` outcomes; it has no `skipped` outcome unless a later feature deliberately omits cases. M4 defines accessibility scan configuration and finding collection; M6 defines how findings configured to fail affect status and continuation, and how axe execution errors are handled. A hard assertion stops the case immediately; loops are deferred beyond MVP. Soft assertions record failure and allow eligible later steps to run. Screenshots are not MVP and are a later opt-in plan/CLI capability. Include how cancellation, browser closure, and JSON report-write errors interact, and mark unsettled policy choices for review.

## Exercise

Create a table with at least these scenarios: malformed JSON, unsupported plan version, failed hard assertion, failed soft assertion, browser launch failure before any cases start, partial operator cancellation, case timeout, cleanup failure after another failure, configured accessibility findings, an axe scan error, a recoverable case error, and JSON report-write failure. For each, specify the runner's next action, case/run status, diagnostic information, and expected command-line outcome. Check for contradictions between rows and ensure secondary failures do not erase the primary cause. Measure elapsed durations with a monotonic clock while recording wall-clock timestamps separately.

## You are ready when

- Users can tell whether they need to fix the plan, the application under test, the environment, or Stagehand itself.
- Continuing after a failure is intentional and does not hide failed tests.
- The same event leads to consistent diagnostics and exit behaviour across CLI and other entry points.

## Read next

- [TE-004 — Execution context and failure policy](../../Planning/Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md)
- [ATR-002 — Load and validate a test plan](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md)
- [ATR-004 — Reports and accessibility](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-004.md)

## Reinforcement quiz

Answer these from memory, then check the key.

1. A plan has invalid JSON and no browser is launched. Is this a test assertion failure? What category is more appropriate?
2. What choices does an execution policy make after an error?
3. Why should the runner distinguish a failed expectation from a browser-launch failure?
4. What does a CLI exit code provide to a CI pipeline?
5. If the runner continues after a soft assertion, what must still happen to the failure?
6. Why should a later cleanup error not erase the original failure?

<details>
<summary>Answer key</summary>

1. No. It is a plan parsing/validation error because the input could not be accepted before execution.
2. It decides the scope of stopping or continuing: current action, test, later tests, or the full run, along with status and diagnostics.
3. They have different causes and owners: a test expectation points to behaviour under test, while a launch failure points to the environment or runner. Reporting them distinctly helps identify the next action.
4. It gives automation a compact, documented signal for success or failure without parsing all human-readable output.
5. It must remain recorded in the result and affect the documented test/run status; continuing must not make the failed check disappear.
6. Preserving the original cause keeps the diagnostic truthful; cleanup problems can be attached as secondary information.

</details>
