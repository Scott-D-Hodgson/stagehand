# M6 — Error model and execution policies

**Estimate:** 2–4 person-days  
**Depends on:** M3–M5  
**Roadmap item:** Error model and execution policies

## Accepted initial policy decisions

- A hard assertion stops its current case, but independent remaining cases continue unless a runner-wide failure makes continuation unsafe.
- When `failOnViolation` is enabled, accessibility findings fail the case but do not stop that case's remaining eligible steps.
- Run-outcome precedence is `error`, then `cancelled`, then `failed`, then `passed`.
- The first implementation runs cases sequentially. Case concurrency is deferred until timeout and cancellation behaviour is established.
- Initial cancellation is requested through a standard JavaScript `AbortSignal` supplied to the run coordinator. CLI interrupt handling is later work.

## M6.1 decision table

This table sets the policy boundary for the later implementation slices. It records the policy boundary used by the current coordinator and result adapter.

| Situation | Current case | Later independent cases | Run outcome | Diagnostic rule |
| --- | --- | --- | --- | --- |
| Soft assertion failure | Continue eligible steps; case is `failed`. | Continue. | At least `failed`. | Retain the assertion failure. |
| Hard assertion failure | Stop the case; case is `failed`. | Continue. | At least `failed`. | Retain the assertion failure and step identity. |
| Accessibility findings, `failOnViolation: false` | Continue eligible steps; findings alone do not fail the case. | Continue. | Unchanged by findings alone. | Retain configured findings and effective settings. |
| Accessibility findings, `failOnViolation: true` | Continue eligible steps; case is `failed`. | Continue. | At least `failed`. | Retain configured findings and effective settings. |
| Axe scan execution error | Stop the affected case; case is `error`. | Continue only when the shared runner remains safe. | `error`. | Retain the scan error and step identity; do not represent it as a finding. |
| Browser/action or runner error | Stop the affected case; case is `error`. | Continue only when the shared runner remains safe; otherwise stop the run. | `error`. | Retain the original operational cause. |
| Plan loading, validation, bundle validation, or preparation error | No affected case starts. | Do not start any case. | `error`. | Retain the preflight issue without launching Chromium. |
| Cancellation observed before a case starts | Do not start that case. | Do not start later cases. | `cancelled`, unless an `error` also occurred. | Record the cancellation request. Active-case interruption belongs to later coordinator work. |
| Cleanup error | End the affected case or run safely. | Continue only if isolation remains safe. | `error`. | Preserve the earlier primary cause and retain cleanup failure as secondary context. |
| Result/report output error | Execution has ended; do not retry browser work. | Not applicable. | `error`. | Preserve the execution outcome as context and retain the output failure as the primary reporting error. |

Run aggregation uses this fixed precedence: `error` > `cancelled` > `failed` > `passed`.

## M6.8 diagnostic contract

Each retained diagnostic has a stable `code`, a severity, a safe message, and optional zero-based `stepIndex`. The case result already supplies the stable case ID; shared-step identity remains retained by execution errors but is not yet serialized in result documents. Codes are machine-readable identifiers, while messages are for people and may improve without changing the code.

| Code | Use | Safe retained context |
| --- | --- | --- |
| `preflight.preparation` | A selected case cannot be prepared before Chromium starts. | Case ID and safe preparation reason; never a resolved protected value. |
| `assertion.hard` | A non-soft assertion stops its case. | Case ID, step index, assertion action, and redacted evidence where applicable. |
| `assertion.soft` | A soft assertion is retained while later eligible steps continue. | Case ID, step index, action, and redacted expected/actual evidence. |
| `accessibility.violation` | Configured findings affect the case outcome. | Effective settings and retained redacted finding evidence. |
| `accessibility.scan` | Axe execution fails rather than finding a violation. | Case ID, step index, and a safe scan message. |
| `browser.action` | A browser action cannot complete safely. | Case ID, step index, action, and a safe message. |
| `runner.infrastructure` | The runner, browser lifecycle, or another shared facility fails. | Case ID/step index only when known, and a safe message. |
| `cleanup.failure` | Cleanup adds a failure after execution. | Primary/secondary category and a safe message; retain the original cause internally. |
| `result.output` | A later report write fails after execution ends. | The prior execution outcome and a safe output message. |
| `run.cancelled` | Cancellation stops new work. | Completed-case counts and cancellation state. |

Do not retain resolved protected values, environment values, raw exception stacks, local machine paths, unbounded browser/axe objects, or unreviewed page content in a diagnostic. The final result adapter redacts supplied protected literals across the document. Raw operational errors stay inside runner-core; the result uses a fixed safe message.

### Worked examples

- **No case starts:** bundle validation rejects an unknown shared-step ID. Chromium does not start and the run is `error`.
- **Mixed outcomes:** case A passes, case B has a hard assertion failure, and case C has an axe scan error. Case C is `error`, so the run is `error` even though B is `failed`.
- **Partial cancellation:** A finishes, then cancellation is observed before B starts. A keeps its completed outcome; B and later cases do not start; the run is `cancelled` unless an earlier `error` takes precedence.
- **Cleanup after a failure:** a hard assertion fails, then that case's cleanup also fails. The assertion remains the primary case cause; the cleanup failure is retained as secondary context and makes the run `error` if safe isolation cannot be confirmed.

## M6.4 timing boundary

Durations are integer milliseconds measured with a monotonic clock, not wall-clock timestamps. The coordinator starts whole-run elapsed time when it accepts a run request, before preflight, and stops it after browser/session cleanup but before report writing. This lets a preflight-only failure have a run duration while keeping report-output failure separate.

Active-case time starts immediately before the first case step is dispatched and stops when step dispatch ends, whether it passes, fails, errors, or is cancelled. It includes step waits and automatic accessibility scans. It excludes preflight, browser/context/session startup, waiting for a future concurrency slot, and cleanup.

The accepted default active-case limit is 10 minutes (600,000 milliseconds). Plan/case overrides, threshold warnings, cancellation enforcement, and Playwright timeout integration remain later M6 work. `startElapsedTimer` and `elapsedMilliseconds` provide only the injectable timing foundation; they do not enforce any limit.

## Tasks

- [x] Review [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) and related plan/execution stories.
- [x] Define stable diagnostic codes for preparation, assertions, accessibility, browser/action, runner/infrastructure, cleanup, result output, and cancellation. The v1 validator rejects unknown codes.
- [x] Record the detailed decision table for each category and continuation scope, using the accepted initial policy as its baseline.
- [x] Define precise case-status mappings for hard failures, soft failures, accessibility findings, runner failures, and cancellation in the pure `determineCaseOutcome` helper.
- [x] Define run-status aggregation details from case outcomes, including runs with no cases started and partial cancellation, in the pure `summarizeRunOutcome` helper. It uses `error`, then `cancelled`, then `failed`, then `passed`. Keep the result field shape in M3 and the underlying action/assertion configuration in M4/M5.
- [x] Specify diagnostic fields, stable case/step identity, safe retained context, and redaction rules. Shared-step identity serialization and raw operational detail remain later work.
- [ ] Define CLI/result signaling principles, including the difference between an unsuccessful test run and a runner unable to execute the plan.
- [x] Define the monotonic-clock boundary for whole-run elapsed time and active-case time, with integer-millisecond durations, and add the injectable `startElapsedTimer`/`elapsedMilliseconds` foundation. The accepted 10-minute active-case limit is documented but not enforced. Plan/case overrides, thresholds, cancellation enforcement, and Playwright timeout integration remain later work.
- [x] Add browser-free cancellation and cleanup primitives: an `AbortSignal`-aware sequential-work helper stops before new work begins, and a wrapper retains an execution failure as primary when cleanup also fails. CLI interrupts, active-work interruption, browser coordination, and result serialization remain later work.
- [x] Add `executePlanRun`, which prepares selected cases before Chromium starts, executes them sequentially in isolated sessions, applies current M6 policy/timing/cancellation helpers, and returns an in-memory outcome. Result documents, CLI behaviour, active-work interruption, and concurrency remain later work.
- [x] Add `createResultDocument`, which adapts a coordinator outcome into a validated result-model document with safe operational diagnostics and final-boundary redaction. Report-file writing, CLI behaviour, active-work interruption, and concurrency remain later work.
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
