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
import { executeWithCleanup } from "./cleanup.js";
import { CancellationError } from "./cancellation.js";
import { LocatorResolutionError } from "./locators.js";
import { resolveAccessibilitySettings } from "./accessibility/settings.js";
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
}

function isHardAssertionFailure(error: unknown): boolean {
  if (!(error instanceof StepExecutionError)) {
    return false;
  }
  if (error.action !== "assertText" && error.action !== "assertHtml" && error.action !== "assertValue") {
    return false;
  }
  return error.cause instanceof StringAssertionMismatchError
    || error.cause instanceof LocatorResolutionError
    || error.cause instanceof errors.TimeoutError;
}

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

function getCaseDiagnostic(error: unknown, hardFailure: boolean): ResultDiagnostic {
  const stepIndex = error instanceof StepExecutionError ? error.stepIndex : undefined;
  return {
    source: "runner",
    severity: "error",
    code: hardFailure ? "assertion.hard" : "runner.infrastructure",
    message: hardFailure ? "A hard assertion failed." : "Case execution failed.",
    ...(stepIndex === undefined ? {} : { stepIndex }),
  };
}

function createOutcome(
  cases: readonly ExecutedCase[],
  durationMs: number,
  cancelled: boolean,
  operationalError?: unknown,
  preflightError?: CasePreparationError,
): PlanRunOutcome {
  const summary = summarizeRunOutcome({
    caseOutcomes: cases.map((entry) => entry.outcome.status),
    cancelled,
    operationalError: operationalError !== undefined || preflightError !== undefined,
  });
  return {
    status: summary.status,
    counts: summary.counts,
    durationMs,
    cases,
    ...(preflightError === undefined ? {} : { preflightError }),
    ...(operationalError === undefined ? {} : { operationalError }),
  };
}

export async function executePlanRun(options: PlanRunOptions): Promise<PlanRunOutcome> {
  const timer = startElapsedTimer(options.clock);
  let prepared: PreparedRunExecution;
  try {
    prepared = prepareRunForExecution(options);
  } catch (error) {
    if (error instanceof CasePreparationError) {
      return createOutcome([], elapsedMilliseconds(timer, options.clock), false, undefined, error);
    }
    return createOutcome([], elapsedMilliseconds(timer, options.clock), false, error);
  }
  if (options.signal?.aborted) {
    return createOutcome([], elapsedMilliseconds(timer, options.clock), true);
  }
  let run: BrowserRun;
  try {
    run = await startBrowserRun({ ...options.runSettings, locale: options.locale });
  } catch (error) {
    return createOutcome([], elapsedMilliseconds(timer, options.clock), false, error);
  }
  const cases: ExecutedCase[] = [];
  let cancelled = false;
  let operationalError: unknown;
  try {
    for (const preparedCase of prepared.cases) {
      if (options.signal?.aborted) {
        cancelled = true;
        break;
      }
      let caseTimer: ElapsedTimer | undefined;
      let softFailures: readonly SoftAssertionFailure[] = [];
      let accessibilityFindings: readonly ResultAccessibilityFinding[] = [];
      let hardFailure = false;
      let caseOperationalError = false;
      let caseError: unknown;
      let session: CaseBrowserSession | undefined;
      try {
        const createdSession = await run.createCaseSession(preparedCase.settings);
        session = createdSession;
        caseTimer = startElapsedTimer(options.clock);
        softFailures = await executeWithCleanup(
          () => createdSession.executeSteps(
            preparedCase.caseId,
            preparedCase.steps,
            preparedCase.stepIdentities,
            preparedCase.protectedValues,
          ),
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
          durationMs: caseTimer === undefined ? 0 : elapsedMilliseconds(caseTimer, options.clock),
          softFailures,
          accessibilityFindings,
          effectiveSettings: getEffectiveSettings(options, createdSession, preparedCase.settings?.accessibility),
          diagnostics: [],
        });
        continue;
      } catch (error) {
        caseError = error;
        hardFailure = isHardAssertionFailure(error);
        caseOperationalError = !hardFailure;
        if (caseOperationalError) {
          operationalError ??= error;
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
        durationMs: caseTimer === undefined ? 0 : elapsedMilliseconds(caseTimer, options.clock),
        softFailures,
        accessibilityFindings,
        effectiveSettings: getEffectiveSettings(options, session, preparedCase.settings?.accessibility),
        diagnostics: [getCaseDiagnostic(caseError, hardFailure)],
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
  return createOutcome(cases, elapsedMilliseconds(timer, options.clock), cancelled, operationalError);
}
