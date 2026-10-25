# M6 — Error model and execution policies

**Estimate:** 2–4 person-days  
**Depends on:** M3–M5  
**Roadmap item:** Error model and execution policies

## Tasks

- [ ] Review [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) and related plan/execution stories.
- [ ] Define error categories that distinguish plan loading/validation, test assertion, browser/action, runner/infrastructure, cleanup, and report-output failures as needed.
- [ ] For each category, decide whether execution continues and at what scope: step, test, remaining tests, or whole run.
- [ ] Define how hard failures, soft failures, accessibility findings, and runner failures map to test/run statuses.
- [ ] Define run-status aggregation from case outcomes, including runs with no cases started, partial cancellation, and mixed passed/failed/error/cancelled cases. Keep the result field shape in M3 and the underlying action/assertion configuration in M4/M5.
- [ ] Specify diagnostic fields, stable IDs, safe context, and rules that prevent secrets from appearing.
- [ ] Define CLI/result signaling principles, including the difference between an unsuccessful test run and a runner unable to execute the plan.
- [ ] Define default 10-minute active-case timeout behaviour and plan/case overrides, operator cancellation and cleanup semantics, case-level parallelism (isolated Playwright context per case, sharing a browser instance; five concurrent contexts by default, configurable at plan level), configurable run/case duration thresholds, and recorded elapsed durations. Distinguish RFC 3339 UTC wall-clock timestamps from elapsed-time measurement; measure elapsed durations with a monotonic clock. Distinguish whole-run elapsed time from active-case time; exclude queue wait, browser/context startup, and cleanup from active-case timeout accounting. M3 defines timestamp representation and integer millisecond duration units.
- [ ] Define execution-time effects of the accessibility policy established in M4: findings do not fail by default, configured findings can fail a case, and axe execution errors follow runner error policy.
- [ ] Define the general non-blocking CLI execution warning for authorization, side effects, egress/downloads, limits, and costs; record that production-target identification and production-specific acknowledgement are deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).
- [ ] Add a decision table, examples, and fixtures covering each error category, continuation policy, status mapping, and aggregation, including cancellation before any case starts, partial cancellation, case timeout, a runner failure before cases start, cleanup failure after an earlier failure, configured accessibility findings, axe execution failure, and report-write failure. Specify how the original cause is retained when cleanup or reporting adds a secondary failure.

## Completion evidence

- Every defined failure class has a predictable next action, result status, and diagnostic.
- The decision table demonstrates run aggregation and preserves the primary cause when cleanup or report writing also fails.
- Fixtures cover representative run/case aggregation and secondary-error outcomes.
- A contributor can determine what a run's result means without reading implementation code.

## Learning reference

[Error model and execution policies](../../Learning%20Plan/Phase%201/06-error-model-and-execution-policies.md)
