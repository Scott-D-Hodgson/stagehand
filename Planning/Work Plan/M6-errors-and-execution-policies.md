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
| Cancellation observed before a case starts | Do not start that case. | Do not start later cases. | `cancelled`, unless an `error` also occurred. | Emit safe `run.cancelled`; an active Playwright operation is not forcibly interrupted. |
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

## M6.10 cleanup failure results

When case execution and its cleanup both fail, the coordinator keeps two diagnostics in order: the original execution diagnostic first, then `cleanup.failure`. The original diagnostic records the primary category, such as `assertion.hard` or `runner.infrastructure`; the cleanup diagnostic is the secondary category. The case and run are `error`. The current sequential coordinator still attempts later independent cases. The run-level diagnostic is the safe `cleanup.failure` record, while the raw primary and cleanup errors remain inside runner-core.

## M6.11 cancellation and active-case limit

When cancellation is observed before a case starts, the coordinator does not start that case or later cases. The result document records safe `run.cancelled` context. An earlier operational error still takes precedence over cancellation.

Active case-step execution has a fixed 10-minute limit. The monotonic timer starts immediately before step dispatch and stops when dispatch ends, so setup and cleanup do not count. Stagehand does not forcibly interrupt a Playwright operation already in progress. Instead, after active step work finishes, a limit reached or exceeded becomes a safe `runner.infrastructure` case error; cleanup still runs and later independent cases continue.

## M6.12 future CLI signalling and execution warning

The CLI is not implemented. When it is, it should return one stable exit code for the final run meaning:

| Exit code | Meaning | Example |
| --- | --- | --- |
| `0` | The run passed. | Every completed case passed. |
| `1` | The run completed but test expectations failed. | A hard or soft assertion failed, or configured accessibility findings failed a case. |
| `2` | The run was cancelled. | Cancellation was observed before a later case started. |
| `3` | The runner could not start execution because its input was invalid. | Plan loading, validation, bundle validation, or preparation failed. |
| `4` | The runner encountered an operational error. | Browser/action, accessibility-scan, cleanup, timeout, or result-output failure. |

The CLI should display a non-blocking warning before every run. It should say that the operator is responsible for authorizing the target and accepting possible side effects, network egress or downloads, target limits, and costs. The warning informs; it does not ask for confirmation, detect a target environment, prove authorization, or prevent execution. Production-target identification and production-specific acknowledgement remain deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).

### Worked examples

- **No case starts:** bundle validation rejects an unknown shared-step ID. Chromium does not start and the run is `error`.
- **Mixed outcomes:** case A passes, case B has a hard assertion failure, and case C has an axe scan error. Case C is `error`, so the run is `error` even though B is `failed`.
- **Partial cancellation:** A finishes, then cancellation is observed before B starts. A keeps its completed outcome; B and later cases do not start; the run is `cancelled` unless an earlier `error` takes precedence.
- **Cleanup after a failure:** a hard assertion fails, then that case's cleanup also fails. The case retains `assertion.hard` first and `cleanup.failure` second; the run is `error` with the safe cleanup diagnostic.

## M6.4 timing boundary

Durations are integer milliseconds measured with a monotonic clock, not wall-clock timestamps. The coordinator starts whole-run elapsed time when it accepts a run request, before preflight, and stops it after browser/session cleanup but before report writing. This lets a preflight-only failure have a run duration while keeping report-output failure separate.

Active-case time starts immediately before the first case step is dispatched and stops when step dispatch ends, whether it passes, fails, errors, or is cancelled. It includes step waits and automatic accessibility scans. It excludes preflight, browser/context/session startup, waiting for a future concurrency slot, and cleanup.

The active-case limit is 10 minutes (600,000 milliseconds). Plan/case overrides, threshold warnings, forced active-work interruption, and Playwright timeout integration remain later M6 work. `startElapsedTimer` and `elapsedMilliseconds` provide the injectable timing foundation used by the coordinator to enforce the limit after active step work completes.

## Tasks

- [x] Review [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) and related plan/execution stories.
- [x] Define stable diagnostic codes for preparation, assertions, accessibility, browser/action, runner/infrastructure, cleanup, result output, and cancellation. The v1 validator rejects unknown codes.
- [x] Record the detailed decision table for each category and continuation scope, using the accepted initial policy as its baseline.
- [x] Define precise case-status mappings for hard failures, soft failures, accessibility findings, runner failures, and cancellation in the pure `determineCaseOutcome` helper.
- [x] Define run-status aggregation details from case outcomes, including runs with no cases started and partial cancellation, in the pure `summarizeRunOutcome` helper. It uses `error`, then `cancelled`, then `failed`, then `passed`. Keep the result field shape in M3 and the underlying action/assertion configuration in M4/M5.
- [x] Specify diagnostic fields, stable case/step identity, safe retained context, and redaction rules. Shared-step identity serialization and raw operational detail remain later work.
- [x] Define CLI/result signalling principles, including the difference between an unsuccessful test run and a runner unable to execute the plan.
- [x] Define the monotonic-clock boundary for whole-run elapsed time and active-case time, with integer-millisecond durations, and add the injectable `startElapsedTimer`/`elapsedMilliseconds` foundation. Enforce the fixed 10-minute active-case limit after active step work completes. Plan/case overrides, thresholds, forced interruption, and Playwright timeout integration remain later work.
- [x] Add browser-free cancellation and cleanup primitives: an `AbortSignal`-aware sequential-work helper stops before new work begins, and a wrapper retains an execution failure as primary when cleanup also fails. CLI interrupts, active-work interruption, browser coordination, and result serialization remain later work.
- [x] Add `executePlanRun`, which prepares selected cases before Chromium starts, executes them sequentially in isolated sessions, applies current M6 policy/timing/cancellation helpers, and returns an in-memory outcome. CLI behaviour, active-work interruption, and concurrency remain later work.
- [x] Add `createResultDocument`, which adapts a coordinator outcome into a validated result-model document with safe operational diagnostics and final-boundary redaction. Report-file writing, CLI behaviour, active-work interruption, and concurrency remain later work.
- [x] Define execution-time effects of the accessibility policy established in M4: findings do not fail by default, configured findings fail a case without stopping later eligible steps, and axe execution errors produce `accessibility.scan` and follow runner error policy.
- [x] Carry a cleanup failure through the coordinator and result adapter without replacing the primary execution diagnostic. Emit a safe `cleanup.failure` record after the primary diagnostic, and cover hard-assertion and operational-error cases.
- [x] Record safe `run.cancelled` context in result documents and enforce the fixed active-case limit with the monotonic timer. Cover cancellation before startup, expiry, cleanup, and later-case continuation without adding forced active-work interruption.
- [x] Define the general non-blocking CLI execution warning for authorization, side effects, egress/downloads, limits, and costs; record that production-target identification and production-specific acknowledgement are deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).
- [ ] Add a decision table, examples, and fixtures covering each error category, continuation policy, status mapping, and aggregation, including cancellation before any case starts, partial cancellation, case timeout, a runner failure before cases start, cleanup failure after an earlier failure, configured accessibility findings, axe execution failure, and report-write failure. Specify how the original cause is retained when cleanup or reporting adds a secondary failure.

## Completion evidence

- Every defined failure class has a predictable next action, result status, and diagnostic.
- The decision table demonstrates run aggregation and preserves the primary cause when cleanup or report writing also fails.
- Fixtures cover representative run/case aggregation and secondary-error outcomes.
- A contributor can determine what a run's result means without reading implementation code.

## Learning reference

[Errors and execution policy](../../Learning%20Plan/Phase%201/Lessons/12-errors-policy.md)
