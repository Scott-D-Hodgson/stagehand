import type { ResultOutcome } from "@stagehand/result-model";

export interface RunOutcomeFacts {
  caseOutcomes: readonly ResultOutcome[];
  cancelled: boolean;
  operationalError: boolean;
}

export interface RunOutcomeCounts {
  passed: number;
  failed: number;
  cancelled: number;
  error: number;
}

export interface RunOutcomeSummary {
  status: ResultOutcome;
  counts: RunOutcomeCounts;
}

function countOutcomes(caseOutcomes: readonly ResultOutcome[]): RunOutcomeCounts {
  const counts: RunOutcomeCounts = { passed: 0, failed: 0, cancelled: 0, error: 0 };
  for (const outcome of caseOutcomes) {
    counts[outcome] += 1;
  }
  return counts;
}

export function summarizeRunOutcome(facts: RunOutcomeFacts): RunOutcomeSummary {
  const counts = countOutcomes(facts.caseOutcomes);
  if (facts.operationalError || counts.error > 0) {
    return { status: "error", counts };
  }
  if (facts.cancelled || counts.cancelled > 0) {
    return { status: "cancelled", counts };
  }
  if (counts.failed > 0) {
    return { status: "failed", counts };
  }
  return { status: "passed", counts };
}
