import AxeBuilder from "@axe-core/playwright";
import type { Page } from "playwright";
import type { AccessibilityScanOutcome, EffectiveAccessibilitySettings } from "./types.js";

export class AccessibilityScanError extends Error {
  constructor(cause: unknown) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(`Accessibility scan failed: ${detail}`, { cause });
    this.name = "AccessibilityScanError";
  }
}

export async function scanAccessibility(
  page: Page,
  accessibility: EffectiveAccessibilitySettings,
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
    return { status: "completed", results: await builder.analyze() };
  } catch (cause) {
    throw new AccessibilityScanError(cause);
  }
}
