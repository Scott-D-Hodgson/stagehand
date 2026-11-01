import type { Page } from "playwright";
import { DEFAULT_LOCATOR_TIMEOUT } from "../../defaults.js";
import { resolveUniqueLocator, type LocatorDefinition } from "../../locators.js";

export interface ClickOptions {
  timeout?: number;
  scrollIntoView?: boolean;
}

export async function executeClick(
  page: Page,
  definition: LocatorDefinition,
  options: ClickOptions,
): Promise<void> {
  const timeout = options.timeout ?? DEFAULT_LOCATOR_TIMEOUT;
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new RangeError("Click timeout must be a positive integer in milliseconds.");
  }
  if (options.scrollIntoView !== undefined && typeof options.scrollIntoView !== "boolean") {
    throw new TypeError("scrollIntoView must be a boolean when provided.");
  }
  const deadline = performance.now() + timeout;
  const locator = await resolveUniqueLocator(page, definition, timeout);
  const remaining = Math.floor(deadline - performance.now());
  if (remaining < 1) {
    throw new Error(`Click exceeded its ${timeout} millisecond timeout while resolving the locator.`);
  }
  await locator.click({
    timeout: remaining,
    scroll: options.scrollIntoView === false ? "none" : "auto",
  });
}
