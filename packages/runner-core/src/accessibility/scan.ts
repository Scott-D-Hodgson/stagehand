import AxeBuilder from "@axe-core/playwright";
import type { Page } from "playwright";
import { redactEvidence } from "@stagehand/result-model";
import type { AccessibilityScanOutcome, EffectiveAccessibilitySettings } from "./types.js";

export class AccessibilityScanError extends Error {
  constructor(cause: unknown) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(`Accessibility scan failed: ${detail}`, { cause });
    this.name = "AccessibilityScanError";
  }
}

function redactCause(cause: unknown, protectedValues: readonly string[]): unknown {
  if (protectedValues.length === 0) {
    return cause;
  }
  const detail = cause instanceof Error ? cause.message : String(cause);
  const redacted = new Error(redactEvidence(detail, protectedValues));
  if (cause instanceof Error) {
    redacted.name = cause.name;
  }
  return redacted;
}

export async function scanAccessibility(
  page: Page,
  accessibility: EffectiveAccessibilitySettings,
  protectedValues: readonly string[] = [],
): Promise<AccessibilityScanOutcome> {
  if (!accessibility.enabled) {
    return { status: "disabled" };
  }
  try {
    const builder = new AxeBuilder({ page });
    const tags = [...accessibility.tags];
    if (tags.length > 0) {
      builder.withTags(tags);
    }
    const results = await builder.analyze();
    return {
      status: "completed",
      results: protectedValues.length === 0 ? results : redactEvidence(results, protectedValues),
    };
  } catch (cause) {
    throw new AccessibilityScanError(redactCause(cause, protectedValues));
  }
}
