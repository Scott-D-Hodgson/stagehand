import type { Page } from "playwright";
import { DEFAULT_LOCATOR_TIMEOUT } from "../../defaults.js";
import { resolveUniqueLocator, type LocatorDefinition } from "../../locators.js";

export interface SelectOptionOptions {
  timeout?: number;
  scrollIntoView?: boolean;
}

export type SelectOptionSelection =
  | { value: string; label?: never }
  | { label: string; value?: never };

export async function executeSelectOption(
  page: Page,
  definition: LocatorDefinition,
  selection: SelectOptionSelection,
  options: SelectOptionOptions,
): Promise<void> {
  const timeout = options.timeout ?? DEFAULT_LOCATOR_TIMEOUT;
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new RangeError("selectOption timeout must be a positive integer in milliseconds.");
  }
  if (options.scrollIntoView !== undefined && typeof options.scrollIntoView !== "boolean") {
    throw new TypeError("scrollIntoView must be a boolean when provided.");
  }
  if (typeof selection !== "object" || selection === null || Array.isArray(selection)) {
    throw new TypeError("selectOption must provide exactly one string value or label.");
  }
  const hasValue = "value" in selection && typeof selection.value === "string";
  const hasLabel = "label" in selection && typeof selection.label === "string";
  if (hasValue === hasLabel) {
    throw new TypeError("selectOption must provide exactly one string value or label.");
  }
  const deadline = performance.now() + timeout;
  const locator = await resolveUniqueLocator(page, definition, timeout);
  let remaining = Math.floor(deadline - performance.now());
  if (remaining < 1) {
    throw new Error(`selectOption exceeded its ${timeout} millisecond timeout while resolving the locator.`);
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
      throw new Error("selectOption target is outside the viewport and scrollIntoView is false.");
    }
    remaining = Math.floor(deadline - performance.now());
    if (remaining < 1) {
      throw new Error(`selectOption exceeded its ${timeout} millisecond timeout while checking the viewport.`);
    }
  }
  const option = hasValue
    ? { value: (selection as { value: string }).value }
    : { label: (selection as { label: string }).label };
  await locator.selectOption(option, { timeout: remaining });
}
