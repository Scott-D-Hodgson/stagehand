# M6 — Error model and execution policies

**Estimate:** 2–4 person-days  
**Depends on:** M3–M5  
**Roadmap item:** Error model and execution policies

## Tasks

- [ ] Review [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) and related plan/execution stories.
- [ ] Define error categories that distinguish plan loading/validation, test assertion, browser/action, runner/infrastructure, cleanup, and report-output failures as needed.
- [ ] For each category, decide whether execution continues and at what scope: step, test, remaining tests, or whole run.
- [ ] Define how hard failures, soft failures, accessibility findings, and runner failures map to test/run statuses.
- [ ] Specify diagnostic fields, stable IDs, safe context, and rules that prevent secrets from appearing.
- [ ] Define CLI/result signaling principles, including the difference between an unsuccessful test run and a runner unable to execute the plan.
- [ ] Define default 10-minute active-case timeout behaviour and plan/case overrides, operator cancellation and cleanup semantics, case-level parallelism (isolated Playwright context per case, sharing a browser instance; five concurrent contexts by default, configurable at plan level), configurable run/case duration thresholds, and recorded elapsed durations. Exclude queue wait, browser/context startup, and cleanup from active-case timeout accounting.
- [ ] Define the non-failing default accessibility outcome and how plan/case configuration can make violations fail a case.
- [ ] Define the general non-blocking CLI execution warning for authorization, side effects, egress/downloads, limits, and costs; record that production-target identification and production-specific acknowledgement are deferred to TE-019.
- [ ] Add a decision table and examples that cover each error category and continuation policy.

## Completion evidence

- Every defined failure class has a predictable next action, result status, and diagnostic.
- The original failure cause is retained when cleanup or reporting also fails.
- A contributor can determine what a run's result means without reading implementation code.

## Learning reference

[Error model and execution policies](../../Learning%20Plan/Phase%201/06-error-model-and-execution-policies.md)
