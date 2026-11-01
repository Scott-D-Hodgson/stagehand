import type { Page } from "playwright";
import { DEFAULT_LOCATOR_TIMEOUT } from "../../defaults.js";
import { resolveUniqueLocator, type LocatorDefinition } from "../../locators.js";

export interface FillOptions {
  timeout?: number;
  scrollIntoView?: boolean;
}

export async function executeFill(
  page: Page,
  definition: LocatorDefinition,
  value: string,
  options: FillOptions,
): Promise<void> {
  const timeout = options.timeout ?? DEFAULT_LOCATOR_TIMEOUT;
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new RangeError("Fill timeout must be a positive integer in milliseconds.");
  }
  if (options.scrollIntoView !== undefined && typeof options.scrollIntoView !== "boolean") {
    throw new TypeError("scrollIntoView must be a boolean when provided.");
  }
  const deadline = performance.now() + timeout;
  const locator = await resolveUniqueLocator(page, definition, timeout);
  let remaining = Math.floor(deadline - performance.now());
  if (remaining < 1) {
    throw new Error(`Fill exceeded its ${timeout} millisecond timeout while resolving the locator.`);
  }
  if (options.scrollIntoView === false) {
    const box = await locator.boundingBox({ timeout: remaining });
    const viewport = page.viewportSize();
    if (
      !box ||
      !viewport ||
      box.x < 0 ||
      box.y < 0 ||
      box.x + box.width > viewport.width ||
      box.y + box.height > viewport.height
    ) {
      throw new Error("Fill target is outside the viewport and scrollIntoView is false.");
    }
    remaining = Math.floor(deadline - performance.now());
    if (remaining < 1) {
      throw new Error(`Fill exceeded its ${timeout} millisecond timeout while checking the viewport.`);
    }
  }
  await locator.fill(value, { timeout: remaining });
}
