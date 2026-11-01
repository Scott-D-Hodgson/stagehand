import { errors, type Locator, type Page } from "playwright";
import { LOCATOR_RETRY_DELAY, MAX_LOCATOR_ATTEMPTS } from "./defaults.js";

export type LocatorDefinition =
  | { role: string; name?: string }
  | { label: string }
  | { css: string }
  | { xpath: string };

export interface LocatorResolutionOptions {
  timeout?: number;
}

export class LocatorResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocatorResolutionError";
  }
}

export function createLocator(page: Page, definition: LocatorDefinition): Locator {
  if ("role" in definition) {
    if (definition.name === undefined) {
      return page.getByRole(definition.role as Parameters<Page["getByRole"]>[0]);
    }
    return page.getByRole(definition.role as Parameters<Page["getByRole"]>[0], {
      name: definition.name,
      exact: true,
    });
  }
  if ("label" in definition) {
    return page.getByLabel(definition.label, { exact: true });
  }
  if ("css" in definition) {
    return page.locator(definition.css);
  }
  return page.locator(`xpath=${definition.xpath}`);
}

function getAttemptCount(timeout: number): number {
  let attempts = MAX_LOCATOR_ATTEMPTS;
  while (attempts > 1 && attempts + (attempts - 1) * LOCATOR_RETRY_DELAY > timeout) {
    attempts -= 1;
  }
  return attempts;
}

export async function resolveUniqueLocator(
  page: Page,
  definition: LocatorDefinition,
  timeout: number,
): Promise<Locator> {
  const locator = createLocator(page, definition);
  const attemptCount = getAttemptCount(timeout);
  const deadline = performance.now() + timeout;
  for (let attempt = 0; attempt < attemptCount; attempt += 1) {
    const attemptsRemaining = attemptCount - attempt;
    const gapsRemaining = attemptsRemaining - 1;
    const remaining = Math.max(0, deadline - performance.now());
    if (remaining <= 0) {
      break;
    }
    const waitBudget = Math.max(
      1,
      Math.floor((remaining - gapsRemaining * LOCATOR_RETRY_DELAY) / attemptsRemaining),
    );
    try {
      await locator.waitFor({ state: "attached", timeout: waitBudget });
    } catch (error) {
      if (!(error instanceof errors.TimeoutError)) {
        throw error;
      }
      if (attempt === attemptCount - 1 || deadline - performance.now() <= LOCATOR_RETRY_DELAY) {
        break;
      }
      await page.waitForTimeout(LOCATOR_RETRY_DELAY);
      continue;
    }
    const matchCount = await locator.count();
    if (matchCount > 1) {
      throw new LocatorResolutionError(
        `Locator matched ${matchCount} elements; exactly one match is required.`,
      );
    }
    if (matchCount === 1) {
      return locator;
    }
    if (attempt < attemptCount - 1 && deadline - performance.now() > LOCATOR_RETRY_DELAY) {
      await page.waitForTimeout(LOCATOR_RETRY_DELAY);
    }
  }
  throw new LocatorResolutionError(
    `Locator did not match an element within ${timeout} milliseconds after ${attemptCount} attempt${attemptCount === 1 ? "" : "s"}.`,
  );
}
