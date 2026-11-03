# M6 — Error model and execution policies

**Estimate:** 2–4 person-days  
**Depends on:** M3–M5  
**Roadmap item:** Error model and execution policies

## Accepted initial policy decisions

- A hard assertion stops its current case, but independent remaining cases continue unless a runner-wide failure makes continuation unsafe.
- When `failOnViolation` is enabled, accessibility findings fail the case but do not stop that case's remaining eligible steps.
- Run-outcome precedence is `error`, then `cancelled`, then `failed`, then `passed`.
- The first implementation runs cases sequentially. Case concurrency is deferred until timeout and cancellation behaviour is established.
- Initial cancellation is requested through a standard JavaScript `AbortSignal` supplied to a future run coordinator. CLI interrupt handling is later work.

## Tasks

- [ ] Review [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) and related plan/execution stories.
- [ ] Define error categories that distinguish plan loading/validation, test assertion, browser/action, runner/infrastructure, cleanup, and report-output failures as needed.
- [ ] Record the detailed decision table for each category and continuation scope, using the accepted initial policy as its baseline.
- [ ] Define precise case-status mappings for hard failures, soft failures, accessibility findings, and runner failures.
- [ ] Define run-status aggregation details from case outcomes, including runs with no cases started and partial cancellation. Use the accepted precedence of `error`, then `cancelled`, then `failed`, then `passed`. Keep the result field shape in M3 and the underlying action/assertion configuration in M4/M5.
- [ ] Specify diagnostic fields, stable IDs, safe context, and rules that prevent secrets from appearing.
- [ ] Define CLI/result signaling principles, including the difference between an unsuccessful test run and a runner unable to execute the plan.
- [ ] Define default 10-minute active-case timeout behaviour and plan/case overrides, cancellation and cleanup semantics, and configurable run/case duration thresholds. Initial execution is sequential; define later case-level concurrency separately. A future run coordinator accepts an `AbortSignal`; CLI interrupt handling is later work. Distinguish RFC 3339 UTC wall-clock timestamps from elapsed-time measurement; measure elapsed durations with a monotonic clock. Distinguish whole-run elapsed time from active-case time; exclude queue wait, browser/context startup, and cleanup from active-case timeout accounting. M3 defines timestamp representation and integer millisecond duration units.
- [ ] Define execution-time effects of the accessibility policy established in M4: findings do not fail by default, configured findings can fail a case, and axe execution errors follow runner error policy.
- [ ] Define the general non-blocking CLI execution warning for authorization, side effects, egress/downloads, limits, and costs; record that production-target identification and production-specific acknowledgement are deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).
- [ ] Add a decision table, examples, and fixtures covering each error category, continuation policy, status mapping, and aggregation, including cancellation before any case starts, partial cancellation, case timeout, a runner failure before cases start, cleanup failure after an earlier failure, configured accessibility findings, axe execution failure, and report-write failure. Specify how the original cause is retained when cleanup or reporting adds a secondary failure.

## Completion evidence

- Every defined failure class has a predictable next action, result status, and diagnostic.
- The decision table demonstrates run aggregation and preserves the primary cause when cleanup or report writing also fails.
- Fixtures cover representative run/case aggregation and secondary-error outcomes.
- A contributor can determine what a run's result means without reading implementation code.

## Learning reference

[Errors and execution policy](../../Learning%20Plan/Phase%201/Lessons/12-errors-policy.md)
