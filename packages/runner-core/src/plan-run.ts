import { errors } from "playwright";
import type {
  ResultAccessibilityFinding,
  ResultDiagnostic,
  ResultEffectiveSettings,
  ResultOutcome,
} from "@stagehand/result-model";
import { StringAssertionMismatchError } from "./assertions.js";
import { startBrowserRun } from "./browser/run.js";
import type { BrowserRun, BrowserRunSettings, CaseBrowserSession } from "./browser/types.js";
import { executeWithCleanup, PrimaryFailureError } from "./cleanup.js";
import { CancellationError } from "./cancellation.js";
import { LocatorResolutionError } from "./locators.js";
import { resolveAccessibilitySettings } from "./accessibility/settings.js";
import { AccessibilityScanError } from "./accessibility/scan.js";
import { determineCaseOutcome, type CaseOutcome } from "./outcomes/case.js";
import { summarizeRunOutcome, type RunOutcomeCounts } from "./outcomes/run.js";
import {
  CasePreparationError,
  prepareRunForExecution,
  type PreparedRunExecution,
  type RunPreparationOptions,
} from "./steps/case.js";
import { StepExecutionError } from "./steps/execute.js";
import type { SoftAssertionFailure } from "./steps/types.js";
import { elapsedMilliseconds, startElapsedTimer, type ElapsedTimer, type MonotonicClock } from "./timing.js";

export interface PlanRunOptions extends RunPreparationOptions {
  runSettings?: BrowserRunSettings;
  signal?: AbortSignal;
  clock?: MonotonicClock;
}

export interface ExecutedCase {
  caseId: string;
  outcome: CaseOutcome;
  durationMs: number;
  softFailures: readonly SoftAssertionFailure[];
  accessibilityFindings: readonly ResultAccessibilityFinding[];
  effectiveSettings: ResultEffectiveSettings;
  diagnostics: readonly ResultDiagnostic[];
}

export interface PlanRunOutcome {
  status: ResultOutcome;
  counts: RunOutcomeCounts;
  durationMs: number;
  cases: readonly ExecutedCase[];
  preflightError?: CasePreparationError;
  operationalError?: unknown;
  operationalDiagnostic?: ResultDiagnostic;
}

const ACTIVE_CASE_LIMIT_MS = 600_000;

class ActiveCaseLimitError extends Error {
  constructor() {
    super("Active case execution exceeded the 10-minute limit.");
    this.name = "ActiveCaseLimitError";
  }
}

/*
Checks whether an execution error is a hard assertion failure.
---
Inputs: Unknown error.
---
Output: True for a recognized hard assertion.
*/
function isHardAssertionFailure(error: unknown): boolean {
  const primaryError = error instanceof PrimaryFailureError ? error.primary : error;
  if (!(primaryError instanceof StepExecutionError)) {
    return false;
  }
  if (primaryError.action !== "assertText" && primaryError.action !== "assertHtml" && primaryError.action !== "assertValue") {
    return false;
  }
  return primaryError.cause instanceof StringAssertionMismatchError
    || primaryError.cause instanceof LocatorResolutionError
    || primaryError.cause instanceof errors.TimeoutError;
}

/*
Checks an error chain for an axe scan failure.
---
Inputs: Unknown error.
---
Output: True when a scan error is present.
*/
function hasAccessibilityScanError(error: unknown): boolean {
  if (error instanceof PrimaryFailureError) {
    return hasAccessibilityScanError(error.primary);
  }
  if (error instanceof AccessibilityScanError) {
    return true;
  }
  if (error instanceof StepExecutionError) {
    return hasAccessibilityScanError(error.cause);
  }
  return error instanceof AggregateError && error.errors.some((item) => hasAccessibilityScanError(item));
}

/*
Builds result settings for one executed case.
---
Inputs: Run options, session, and case settings.
---
Output: Safe effective settings.
*/
function getEffectiveSettings(
  options: PlanRunOptions,
  session: CaseBrowserSession | undefined,
  settings: BrowserRunSettings["accessibility"] | undefined,
): ResultEffectiveSettings {
  const accessibility = session?.accessibility ?? resolveAccessibilitySettings(options.runSettings?.accessibility, settings);
  return {
    locale: options.locale,
    accessibility: {
      enabled: accessibility.enabled,
      failOnViolation: accessibility.failOnViolation,
      tags: [...accessibility.tags],
    },
  };
}

/*
Builds a safe diagnostic for one failed case.
---
Inputs: Error and hard-failure flag.
---
Output: A stable diagnostic record.
*/
function getCaseDiagnostic(error: unknown, hardFailure: boolean): ResultDiagnostic {
  const primaryError = error instanceof PrimaryFailureError ? error.primary : error;
  const stepIndex = primaryError instanceof StepExecutionError ? primaryError.stepIndex : undefined;
  if (primaryError instanceof ActiveCaseLimitError) {
    return {
      source: "runner",
      severity: "error",
      code: "runner.infrastructure",
      message: "Active case execution exceeded the 10-minute limit.",
    };
  }
  if (hasAccessibilityScanError(primaryError)) {
    return {
      source: "accessibility",
      severity: "error",
      code: "accessibility.scan",
      message: "Accessibility scanning failed.",
      ...(stepIndex === undefined ? {} : { stepIndex }),
    };
  }
  if (primaryError instanceof StepExecutionError && !hardFailure) {
    return {
      source: "runner",
      severity: "error",
      code: "browser.action",
      message: "Browser action failed.",
      stepIndex: primaryError.stepIndex,
    };
  }
  return {
    source: "runner",
    severity: "error",
    code: hardFailure ? "assertion.hard" : "runner.infrastructure",
    message: hardFailure ? "A hard assertion failed." : "Case execution failed.",
    ...(stepIndex === undefined ? {} : { stepIndex }),
  };
}

/*
Builds a safe diagnostic for cleanup after an earlier failure.
---
Inputs: An execution error.
---
Output: Cleanup diagnostic or nothing.
*/
function getCleanupDiagnostic(error: unknown): ResultDiagnostic | undefined {
  if (!(error instanceof PrimaryFailureError)) {
    return undefined;
  }
  const primaryHardFailure = isHardAssertionFailure(error.primary);
  const stepIndex = error.primary instanceof StepExecutionError
    ? error.primary.stepIndex
    : undefined;
  return {
    source: "runner",
    severity: "error",
    code: "cleanup.failure",
    message: primaryHardFailure
      ? "Cleanup failed after a hard assertion failure."
      : "Cleanup failed after a case execution error.",
    ...(stepIndex === undefined ? {} : { stepIndex }),
  };
}

/*
Builds the in-memory result for a whole run.
---
Inputs: Cases, duration, status facts, and diagnostics.
---
Output: A plan-run outcome.
*/
function createOutcome(options: {
  cases: readonly ExecutedCase[];
  durationMs: number;
  cancelled: boolean;
  operationalError?: unknown;
  preflightError?: CasePreparationError;
  operationalDiagnostic?: ResultDiagnostic;
}): PlanRunOutcome {
  const summary = summarizeRunOutcome({
    caseOutcomes: options.cases.map((entry) => entry.outcome.status),
    cancelled: options.cancelled,
    operationalError: options.operationalError !== undefined || options.preflightError !== undefined,
  });
  return {
    status: summary.status,
    counts: summary.counts,
    durationMs: options.durationMs,
    cases: options.cases,
    ...(options.preflightError === undefined ? {} : { preflightError: options.preflightError }),
    ...(options.operationalError === undefined ? {} : { operationalError: options.operationalError }),
    ...(options.operationalDiagnostic === undefined ? {} : { operationalDiagnostic: options.operationalDiagnostic }),
  };
}

/*
Prepares and runs selected cases sequentially.
---
Inputs: Plan-run options.
---
Output: An in-memory run outcome.
*/
export async function executePlanRun(options: PlanRunOptions): Promise<PlanRunOutcome> {
  const timer = startElapsedTimer(options.clock);
  let prepared: PreparedRunExecution;
  try {
    prepared = prepareRunForExecution(options);
  } catch (error) {
    if (error instanceof CasePreparationError) {
      return createOutcome({
        cases: [],
        durationMs: elapsedMilliseconds(timer, options.clock),
        cancelled: false,
        preflightError: error,
      });
    }
    return createOutcome({
      cases: [],
      durationMs: elapsedMilliseconds(timer, options.clock),
      cancelled: false,
      operationalError: error,
    });
  }
  if (options.signal?.aborted) {
    return createOutcome({
      cases: [],
      durationMs: elapsedMilliseconds(timer, options.clock),
      cancelled: true,
    });
  }
  let run: BrowserRun;
  try {
    run = await startBrowserRun({ ...options.runSettings, locale: options.locale });
  } catch (error) {
    return createOutcome({
      cases: [],
      durationMs: elapsedMilliseconds(timer, options.clock),
      cancelled: false,
      operationalError: error,
    });
  }
  const cases: ExecutedCase[] = [];
  let cancelled = false;
  let operationalError: unknown;
  let operationalDiagnostic: ResultDiagnostic | undefined;
  try {
    for (const preparedCase of prepared.cases) {
      if (options.signal?.aborted) {
        cancelled = true;
        break;
      }
      let caseTimer: ElapsedTimer | undefined;
      let activeDurationMs = 0;
      let softFailures: readonly SoftAssertionFailure[] = [];
      let accessibilityFindings: readonly ResultAccessibilityFinding[] = [];
      let hardFailure = false;
      let caseOperationalError = false;
      let caseError: unknown;
      let cleanupDiagnostic: ResultDiagnostic | undefined;
      let session: CaseBrowserSession | undefined;
      try {
        const createdSession = await run.createCaseSession(preparedCase.settings);
        session = createdSession;
        const activeTimer = startElapsedTimer(options.clock);
        caseTimer = activeTimer;
        softFailures = await executeWithCleanup(
          async () => {
            let failures: readonly SoftAssertionFailure[] = [];
            try {
              failures = await createdSession.executeSteps(
                preparedCase.caseId,
                preparedCase.steps,
                preparedCase.stepIdentities,
                preparedCase.protectedValues,
              );
            } finally {
              activeDurationMs = elapsedMilliseconds(activeTimer, options.clock);
            }
            if (activeDurationMs >= ACTIVE_CASE_LIMIT_MS) {
              throw new ActiveCaseLimitError();
            }
            return failures;
          },
          () => createdSession.close(),
        );
        accessibilityFindings = createdSession.getAccessibilityFindings();
        cases.push({
          caseId: preparedCase.caseId,
          outcome: determineCaseOutcome({
            softFailureCount: softFailures.length,
            hardFailure: false,
            accessibilityFindingCount: accessibilityFindings.length,
            failOnViolation: createdSession.accessibility.failOnViolation,
            operationalError: false,
            cancelled: false,
          }),
          durationMs: activeDurationMs,
          softFailures,
          accessibilityFindings,
          effectiveSettings: getEffectiveSettings(options, createdSession, preparedCase.settings?.accessibility),
          diagnostics: [],
        });
        continue;
      } catch (error) {
        caseError = error;
        hardFailure = isHardAssertionFailure(error);
        caseOperationalError = error instanceof PrimaryFailureError || !hardFailure;
        cleanupDiagnostic = getCleanupDiagnostic(error);
        if (caseOperationalError) {
          operationalError ??= error;
          operationalDiagnostic ??= cleanupDiagnostic ?? getCaseDiagnostic(error, hardFailure);
        }
      }
      if (session) {
        accessibilityFindings = session.getAccessibilityFindings();
      }
      cases.push({
        caseId: preparedCase.caseId,
        outcome: determineCaseOutcome({
          softFailureCount: softFailures.length,
          hardFailure,
          accessibilityFindingCount: accessibilityFindings.length,
          failOnViolation: false,
          operationalError: caseOperationalError,
          cancelled: false,
        }),
        durationMs: activeDurationMs,
        softFailures,
        accessibilityFindings,
        effectiveSettings: getEffectiveSettings(options, session, preparedCase.settings?.accessibility),
        diagnostics: [
          getCaseDiagnostic(caseError, hardFailure),
          ...(cleanupDiagnostic === undefined ? [] : [cleanupDiagnostic]),
        ],
      });
    }
  } catch (error) {
    if (error instanceof CancellationError) {
      cancelled = true;
    } else {
      operationalError ??= error;
    }
  }
  try {
    await run.close();
  } catch (error) {
    operationalError ??= error;
  }
  return createOutcome({
    cases,
    durationMs: elapsedMilliseconds(timer, options.clock),
    cancelled,
    ...(operationalError === undefined ? {} : { operationalError }),
    ...(operationalDiagnostic === undefined ? {} : { operationalDiagnostic }),
  });
}
