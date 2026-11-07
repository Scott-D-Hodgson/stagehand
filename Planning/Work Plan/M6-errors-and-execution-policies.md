# M6 — Error model and execution policies

**Status:** Complete
**Original estimate:** 2–4 person-days (not actual effort)
**Depends on:** M3–M5

## Objective

Established predictable failure, continuation, timing, cancellation, and cleanup policies, then implemented sequential prepared-case coordination and validated in-memory results.

## Tasks completed

- Implemented pure case outcome and run aggregation helpers and stable diagnostic-code validation.
- Added injectable monotonic timing, cancellation before new work, and cleanup handling that preserves primary and secondary causes.
- Implemented `executePlanRun` preflight and sequential isolated case execution, plus `createResultDocument` safe adaptation and final redaction.
- Enforced the fixed active-case limit after dispatch completes and verified policy fixtures, including corrected browser-action diagnostics.
- Recorded future CLI exit meanings and the non-blocking operator-responsibility warning.

## Decisions made

- A hard assertion stops its case; independent cases continue when safe. Soft failures and configured accessibility findings fail a case without stopping eligible steps.
- Run precedence is `error` > `cancelled` > `failed` > `passed`; scan execution errors are operational failures, not findings.
- Cancellation uses a caller-supplied AbortSignal and prevents later case work; it does not forcibly interrupt active Playwright operations.
- Whole-run elapsed time includes preflight and cleanup but excludes report writing. Active-case time includes dispatched work/waits/scans, excludes setup/cleanup, and has a fixed 600,000 ms limit.
- Serialized diagnostics use safe codes/messages and reviewed context; raw errors stay internal. Cleanup failure does not erase the original execution diagnostic.

## Deferred work

- CLI implementation, interrupt wiring, report-file output, and production loader-to-runner orchestration remain later phase work; their policy definitions are not shipped commands.
- Concurrency, forced interruption, configurable active-case limits, threshold warnings, and Playwright timeout integration remain deferred.
- Shared-step identity serialization and richer operational detail remain later work. Production-target detection/acknowledgement is deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).
- Actual Chromium/axe and report-file tests remain deferred.

## Completion evidence

- The owner reported passing development-container test execution after the M6.13 browser-action diagnostic correction.
- The policy fixture matrix covers preflight, assertion failures, findings, scan errors, browser/cleanup failures, cancellation, time limits, output diagnostics, and redaction using doubles.
- M7 later verified the integrated 297-check baseline; the result-output fixture demonstrates safe adaptation, not file writing.

## Learning plan reference

[Errors and execution policy](../../Learning%20Plan/Phase%201/Lessons/12-errors-policy.md).

## Supporting detail

### M6.1 decision table

This table records the accepted policy used by the coordinator and result adapter. Loading and report-output rows also define boundaries for deferred production orchestration and file writing; they do not establish those integrations as implemented.

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

### M6.8 diagnostic contract

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

### M6.10 cleanup failure results

When case execution and its cleanup both fail, the coordinator keeps two diagnostics in order: the original execution diagnostic first, then `cleanup.failure`. The original diagnostic records the primary category, such as `assertion.hard` or `runner.infrastructure`; the cleanup diagnostic is the secondary category. The case and run are `error`. The current sequential coordinator still attempts later independent cases. The run-level diagnostic is the safe `cleanup.failure` record, while the raw primary and cleanup errors remain inside runner-core.

### M6.11 cancellation and active-case limit

When cancellation is observed before a case starts, the coordinator does not start that case or later cases. The result document records safe `run.cancelled` context. An earlier operational error still takes precedence over cancellation.

Active case-step execution has a fixed 10-minute limit. The monotonic timer starts immediately before step dispatch and stops when dispatch ends, so setup and cleanup do not count. Stagehand does not forcibly interrupt a Playwright operation already in progress. Instead, after active step work finishes, a limit reached or exceeded becomes a safe `runner.infrastructure` case error; cleanup still runs and later independent cases continue.

### M6.12 future CLI signalling and execution warning

The CLI is not implemented. When it is, it should return one stable exit code for the final run meaning:

| Exit code | Meaning | Example |
| --- | --- | --- |
| `0` | The run passed. | Every completed case passed. |
| `1` | The run completed but test expectations failed. | A hard or soft assertion failed, or configured accessibility findings failed a case. |
| `2` | The run was cancelled. | Cancellation was observed before a later case started. |
| `3` | The runner could not start execution because its input was invalid. | Plan loading, validation, bundle validation, or preparation failed. |
| `4` | The runner encountered an operational error. | Browser/action, accessibility-scan, cleanup, timeout, or result-output failure. |

The CLI should display a non-blocking warning before every run. It should say that the operator is responsible for authorizing the target and accepting possible side effects, network egress or downloads, target limits, and costs. The warning informs; it does not ask for confirmation, detect a target environment, prove authorization, or prevent execution. Production-target identification and production-specific acknowledgement remain deferred to [TE-019](../Backlog/technical-enablers/te-019-production-target-identification-and-warning.md).

### M6.13 fixture matrix

The focused runner-core tests below provide the current policy fixtures. They use mocked browser and axe behaviour; they do not provide real Chromium or live axe coverage. A `result.output` fixture verifies the result adapter preserves a safe output diagnostic after execution. It does not add report-file writing.

| Policy category | Fixture | Expected policy evidence |
| --- | --- | --- |
| Preflight | `plan-run.test.js`: `returns a preflight error without starting Chromium` | No browser launch; run is `error`. |
| Hard assertion | `plan-run.test.js`: `records a hard assertion failure and continues to an independent case` | Affected case fails; later case runs. |
| Soft assertion | `case-outcome.test.js`: `fails for soft and hard assertion failures` | Soft failure produces `failed`. |
| Accessibility findings | `case-outcome.test.js` and `plan-run.test.js`: configured-finding fixtures | Unconfigured findings pass; configured findings fail but later steps run. |
| Axe scan error | `plan-run.test.js`: `records an axe scan execution error with the accessibility diagnostic code` | Case and run are `error`; code is `accessibility.scan`. |
| Browser action and cleanup | `plan-run.test.js`: `records a browser action failure and continues to an independent case` | Code is `browser.action`; cleanup is secondary; later case runs. |
| Cancellation | `plan-run.test.js`: cancellation fixtures | New case work stops; cancellation loses to an earlier error. |
| Active-case limit | `plan-run.test.js`: `marks an expired active case as an error after cleanup and continues later cases` | Expired case is `error`; later case runs. |
| Result output | `result.test.js`: `retains a safe result-output diagnostic after execution` | Code is `result.output`; raw operational detail is absent. |
| Result redaction | `result.test.js`: redaction fixtures | Supplied protected values are redacted at the result boundary. |

#### Worked examples

- **No case starts:** bundle validation rejects an unknown shared-step ID. Chromium does not start and the run is `error`.
- **Mixed outcomes:** case A passes, case B has a hard assertion failure, and case C has an axe scan error. Case C is `error`, so the run is `error` even though B is `failed`.
- **Partial cancellation:** A finishes, then cancellation is observed before B starts. A keeps its completed outcome; B and later cases do not start; the run is `cancelled` unless an earlier `error` takes precedence.
- **Cleanup after a failure:** a hard assertion fails, then that case's cleanup also fails. The case retains `assertion.hard` first and `cleanup.failure` second; the run is `error` with the safe cleanup diagnostic.

### M6.4 timing boundary

Durations are integer milliseconds measured with a monotonic clock, not wall-clock timestamps. The coordinator starts whole-run elapsed time when it accepts a run request, before preflight, and stops it after browser/session cleanup but before report writing. This lets a preflight-only failure have a run duration while keeping report-output failure separate.

Active-case time starts immediately before the first case step is dispatched and stops when step dispatch ends, whether it passes, fails, errors, or is cancelled. It includes step waits and automatic accessibility scans. It excludes preflight, browser/context/session startup, waiting for a future concurrency slot, and cleanup.

The active-case limit is 10 minutes (600,000 milliseconds). Plan/case overrides, threshold warnings, forced active-work interruption, and Playwright timeout integration remain later work. `startElapsedTimer` and `elapsedMilliseconds` provide the injectable timing foundation used by the coordinator to enforce the limit after active step work completes.
