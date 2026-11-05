# Lesson 11: Public API anatomy

> “Which runner-core tools run a case, and which simply prepare or describe it?” — Rory “Runner Router” Reid, Developer

[← Previous: package structure](10-structure-and-verification.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)

`src/index.ts` is runner-core’s public control panel. It exposes browser lifecycle, preparation, policy, accessibility, and result tools. Internal files call each other directly; package users import from this one place.

## Functions

| Function group | What it does | Inputs | Output |
| --- | --- | --- | --- |
| `startBrowserRun` | Launches Chromium and creates isolated case sessions. | Run settings. | Browser-run lifecycle. |
| `prepareCaseForExecution` / `prepareRunForExecution` | Resolve selected variables and shared steps before browser work. | Case/run preparation options. | Prepared steps and protected-value details. |
| `executePlanRun` | Prepares and runs selected cases sequentially. | Plan-run options. | In-memory run outcome. |
| `createResultDocument` | Converts an outcome into checked result JSON. | Outcome, source plan, timestamps, and protected values. | Valid result document. |
| `determineCaseOutcome` / `summarizeRunOutcome` | Apply M6 status precedence. | Known case/run facts. | Case or run outcome. |
| `resolveAccessibilitySettings`, `mapAccessibilityFindings`, `createAccessibilityFindingCollector` | Resolve scan settings and retain selected finding evidence. | Settings or trusted axe observations. | Settings, findings, or collector. |
| `startElapsedTimer` / `elapsedMilliseconds` | Measure elapsed time with an injectable stopwatch. | Timer and optional clock. | Timer record or integer milliseconds. |
| `executeSequentially`, `throwIfCancelled`, `executeWithCleanup` | Support sequential work, cancellation, and cleanup. | Work, signal, or cleanup functions. | Outputs or retained failures. |

### Reading grouped inputs

Several runner-core functions use one typed options object when they need several related inputs. The property names explain each value at the call site, and a future optional setting can be added without changing every existing call.

```ts
const outcome = await executePlanRun({
  cases,
  locale: "en-CA",
  signal,
});
```

This is useful for a growing group of settings. A small, naturally ordered pair can stay as ordinary parameters; `elapsedMilliseconds(timer, clock)` is easier to read that way.

## Types

| Type or value | What it describes | Used by |
| --- | --- | --- |
| `BrowserRun`, `CaseBrowserSession`, `BrowserRunSettings` | Browser lifecycle and configuration. | Browser callers. |
| `ExecutableStep`, action option types, and assertion option types | Prepared browser work and settings. | Direct session calls and dispatch. |
| `PreparedCaseExecution`, `PreparedRunExecution`, `PlanRunOutcome` | Preflight and coordinator data. | Plan-run callers. |
| `CaseOutcome*`, `RunOutcome*`, `ElapsedTimer`, `MonotonicClock` | M6 status and timing facts. | Policy and timing callers. |
| Accessibility scan, finding, and settings types | Assessment inputs and retained observations. | Accessibility callers. |
| Error classes such as `StepExecutionError`, `CancellationError`, and `ResultDocumentError` | Expected failure categories. | Error handling and tests. |

```ts
import { createResultDocument, executePlanRun } from "@stagehand/runner-core";

const outcome = await executePlanRun({ cases, locale: "en-CA" });
const result = createResultDocument({ outcome, sourcePlan, startedAt, endedAt });
```

This is still an in-memory flow. It does not load plan files, write a result file, or provide a CLI command.

## Try it

Trace the example from preparation through `executePlanRun` to `createResultDocument`. Identify which package owns file loading if the caller starts with a path.

## You are ready when

- You can choose lifecycle, preparation, coordinator, or result functions from the public API.
- You can explain why a case session is separate from a whole browser run.
- You can identify which public types describe data and which exports perform work.

[← Previous: package structure](10-structure-and-verification.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)
