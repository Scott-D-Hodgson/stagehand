import {
  redactEvidence,
  validateResult,
  type ResultAssertion,
  type ResultDiagnostic,
  type ResultStep,
  type ResultSourcePlan,
  type StagehandResultV1,
} from "@stagehand/result-model";
import type { ExecutedCase, PlanRunOutcome } from "./plan-run.js";

export interface ResultDocumentOptions {
  outcome: PlanRunOutcome;
  sourcePlan: ResultSourcePlan;
  startedAt: string;
  endedAt: string;
  protectedValues?: readonly string[];
}

export class ResultDocumentError extends Error {
  issues: ReadonlyArray<{ path: string; keyword: string; message: string }>;
  constructor(issues: ReadonlyArray<{ path: string; keyword: string; message: string }>) {
    super("The run outcome could not be converted into a valid result document.");
    this.name = "ResultDocumentError";
    this.issues = issues;
  }
}

/*
Groups soft assertion failures into result steps.
---
Inputs: One executed case.
---
Output: Failed step records.
*/
function mapSoftFailures(caseOutcome: ExecutedCase): ResultStep[] {
  const grouped = new Map<number, ResultAssertion[]>();
  for (const failure of caseOutcome.softFailures) {
    const assertions = grouped.get(failure.stepIndex) ?? [];
    assertions.push({ mode: "soft", outcome: "failed", message: failure.message });
    grouped.set(failure.stepIndex, assertions);
  }
  return [...grouped.entries()].map(([index, assertions]) => ({
    index,
    outcome: "failed",
    durationMs: 0,
    assertions,
    diagnostics: [],
  }));
}

/*
Builds safe run-level diagnostics.
---
Inputs: A plan-run outcome.
---
Output: Diagnostic records.
*/
function mapRunDiagnostics(outcome: PlanRunOutcome): ResultDiagnostic[] {
  if (outcome.preflightError) {
    return [{
      source: "preflight",
      severity: "error",
      code: "preflight.preparation",
      message: "Case preparation failed before browser startup.",
    }];
  }
  if (outcome.operationalError !== undefined) {
    return [outcome.operationalDiagnostic ?? {
      source: "runner",
      severity: "error",
      code: "runner.infrastructure",
      message: "The runner encountered an operational error.",
    }];
  }
  if (outcome.status === "cancelled") {
    return [{
      source: "runner",
      severity: "info",
      code: "run.cancelled",
      message: "Run cancellation stopped new case work.",
    }];
  }
  return [];
}

/*
Builds and validates a result-model document.
---
Inputs: Outcome, source plan, timestamps, and protected values.
---
Output: A validated result document.
*/
export function createResultDocument(options: ResultDocumentOptions): StagehandResultV1 {
  const result: StagehandResultV1 = {
    version: 1,
    sourcePlan: options.sourcePlan,
    run: {
      outcome: options.outcome.status,
      startedAt: options.startedAt,
      endedAt: options.endedAt,
      durationMs: options.outcome.durationMs,
      caseCounts: {
        total: options.outcome.cases.length,
        ...options.outcome.counts,
      },
      diagnostics: mapRunDiagnostics(options.outcome),
    },
    cases: options.outcome.cases.map((caseOutcome) => ({
      id: caseOutcome.caseId,
      outcome: caseOutcome.outcome.status,
      durationMs: caseOutcome.durationMs,
      effectiveSettings: caseOutcome.effectiveSettings,
      steps: mapSoftFailures(caseOutcome),
      diagnostics: [...caseOutcome.diagnostics],
      accessibilityFindings: [...caseOutcome.accessibilityFindings],
    })),
  };
  const redacted = redactEvidence(result, options.protectedValues ?? []);
  const validation = validateResult(redacted);
  if (!validation.valid) {
    throw new ResultDocumentError(validation.issues);
  }
  return redacted;
}
