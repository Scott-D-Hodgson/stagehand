import { errors, type Page } from "playwright";
import { DEFAULT_WAIT_TIMEOUT, LOCATOR_RETRY_DELAY } from "./defaults.js";
import { createLocator, type LocatorDefinition } from "./locators.js";

export type WaitDefinition =
  | { waitFor: LocatorDefinition; timeout?: number }
  | { waitForState: "domcontentloaded" | "networkidle"; timeout?: number }
  | { delay: number; timeout?: number };

export class WaitExecutionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "WaitExecutionError";
  }
}

function getWaitTimeout(timeout: number | undefined): number {
  const effectiveTimeout = timeout ?? DEFAULT_WAIT_TIMEOUT;
  if (!Number.isInteger(effectiveTimeout) || effectiveTimeout < 1) {
    throw new RangeError("Wait timeout must be a positive integer in milliseconds.");
  }
  return effectiveTimeout;
}

async function waitForUniqueLocator(
  page: Page,
  definition: LocatorDefinition,
  timeout: number,
): Promise<void> {
  const locator = createLocator(page, definition);
  const deadline = performance.now() + timeout;
  while (true) {
    const matchCount = await locator.count();
    if (matchCount > 1) {
      throw new WaitExecutionError(
        `Locator wait matched ${matchCount} elements; exactly one match is required.`,
      );
    }
    if (matchCount === 1) {
      return;
    }
    const remaining = deadline - performance.now();
    if (remaining <= 0) {
      break;
    }
    await page.waitForTimeout(Math.min(LOCATOR_RETRY_DELAY, remaining));
  }
  throw new WaitExecutionError(
    `Locator wait did not find an element within ${timeout} milliseconds.`,
  );
}

async function executeWaitItem(page: Page, wait: WaitDefinition): Promise<void> {
  if ("waitFor" in wait) {
    await waitForUniqueLocator(page, wait.waitFor, getWaitTimeout(wait.timeout));
    return;
  }
  if ("waitForState" in wait) {
    const timeout = getWaitTimeout(wait.timeout);
    try {
      await page.waitForLoadState(wait.waitForState, { timeout });
    } catch (error) {
      if (error instanceof errors.TimeoutError) {
        throw new WaitExecutionError(
          `Waiting for page state "${wait.waitForState}" exceeded ${timeout} milliseconds.`,
          error,
        );
      }
      throw error;
    }
    return;
  }
  const timeout = getWaitTimeout(wait.timeout);
  if (!Number.isInteger(wait.delay) || wait.delay < 1 || wait.delay > 30_000) {
    throw new RangeError("Wait delay must be an integer from 1 to 30000 milliseconds.");
  }
  if (wait.delay > timeout) {
    await page.waitForTimeout(timeout);
    throw new WaitExecutionError(
      `Fixed delay of ${wait.delay} milliseconds exceeded its ${timeout} millisecond timeout.`,
    );
  }
  await page.waitForTimeout(wait.delay);
}

export async function executeWaitList(
  page: Page,
  waits: readonly WaitDefinition[],
): Promise<void> {
  if (!Array.isArray(waits)) {
    throw new TypeError("Wait list must be an array.");
  }
  for (const wait of waits) {
    await executeWaitItem(page, wait);
  }
}
