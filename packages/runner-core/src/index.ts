import {
  chromium,
  errors,
  type BrowserContext,
  type Locator,
  type Page,
  type Response,
} from "playwright";

export interface Viewport {
  width: number;
  height: number;
}

export interface BrowserContextSettings {
  viewport?: Viewport;
  timeZone?: string;
}

export interface BrowserRunSettings {
  locale?: string;
  browser?: BrowserContextSettings & { headless?: boolean };
}

export interface CaseSettings {
  browser?: BrowserContextSettings;
}

export interface CaseBrowserSession {
  context: BrowserContext;
  page: Page;
  resolveLocator(
    locator: LocatorDefinition,
    options?: LocatorResolutionOptions,
  ): Promise<Locator>;
  click(locator: LocatorDefinition, options?: ClickOptions): Promise<void>;
  runWaitList(waits: readonly WaitDefinition[]): Promise<void>;
  navigate(url: string, options?: NavigationOptions): Promise<Response | null>;
  executeSteps(caseId: string, steps: readonly ExecutableStep[]): Promise<void>;
  close(): Promise<void>;
}

export type LocatorDefinition =
  | { role: string; name?: string }
  | { label: string }
  | { css: string }
  | { xpath: string };

export interface LocatorResolutionOptions {
  timeout?: number;
}

export interface ClickOptions {
  timeout?: number;
  scrollIntoView?: boolean;
}

export type WaitDefinition =
  | { waitFor: LocatorDefinition; timeout?: number }
  | { waitForState: "domcontentloaded" | "networkidle"; timeout?: number }
  | { delay: number; timeout?: number };

export type NavigationWaitUntil = "domcontentloaded" | "networkidle";

export interface NavigationOptions {
  timeout?: number;
  waitUntil?: NavigationWaitUntil;
}

export interface NavigateStep {
  action: "navigate";
  url: string;
  timeout?: number;
  waitUntil?: NavigationWaitUntil;
}

export interface ClickStep {
  action: "click";
  locator: LocatorDefinition;
  timeout?: number;
  before?: readonly WaitDefinition[];
  after?: readonly WaitDefinition[];
  scrollIntoView?: boolean;
}

export type ExecutableStep = NavigateStep | ClickStep;

export interface BrowserRun {
  createCaseSession(settings?: CaseSettings): Promise<CaseBrowserSession>;
  close(): Promise<void>;
}

const DEFAULT_VIEWPORT: Viewport = { width: 1280, height: 720 };
const DEFAULT_LOCATOR_TIMEOUT = 30_000;
const DEFAULT_WAIT_TIMEOUT = 30_000;
const DEFAULT_NAVIGATION_TIMEOUT = 30_000;
const LOCATOR_RETRY_DELAY = 1_000;
const MAX_LOCATOR_ATTEMPTS = 3;

export class LocatorResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocatorResolutionError";
  }
}

export class WaitExecutionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "WaitExecutionError";
  }
}

export class StepExecutionError extends Error {
  caseId: string;
  stepIndex: number;
  action: string;
  constructor(caseId: string, stepIndex: number, action: string, cause: unknown) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(`Case "${caseId}", step ${stepIndex} (${action}) failed: ${detail}`, { cause });
    this.name = "StepExecutionError";
    this.caseId = caseId;
    this.stepIndex = stepIndex;
    this.action = action;
  }
}

function createLocator(page: Page, definition: LocatorDefinition): Locator {
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

async function resolveUniqueLocator(
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

async function executeClick(
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

async function executeWaitList(
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

function validateNavigationUrl(url: string): void {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
  }
  try {
    const parsedUrl = new URL(url);
    if (
      (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") ||
      parsedUrl.hostname.length === 0
    ) {
      throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
    }
  } catch {
    throw new TypeError("Navigation URL must be an absolute HTTP or HTTPS URL with a host.");
  }
}

async function executeNavigation(
  page: Page,
  url: string,
  options: NavigationOptions,
): Promise<Response | null> {
  validateNavigationUrl(url);
  const timeout = options.timeout ?? DEFAULT_NAVIGATION_TIMEOUT;
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new RangeError("Navigation timeout must be a positive integer in milliseconds.");
  }
  const waitUntil = options.waitUntil ?? "domcontentloaded";
  if (waitUntil !== "domcontentloaded" && waitUntil !== "networkidle") {
    throw new RangeError("Navigation waitUntil must be domcontentloaded or networkidle.");
  }
  return page.goto(url, { timeout, waitUntil });
}

async function executeCaseSteps(
  page: Page,
  caseId: string,
  steps: readonly ExecutableStep[],
): Promise<void> {
  if (!Array.isArray(steps)) {
    throw new TypeError("Case steps must be an array.");
  }
  for (const [stepIndex, step] of steps.entries()) {
    const action = (step as { action?: unknown }).action;
    try {
      switch (step.action) {
        case "navigate":
          await executeNavigation(page, step.url, {
            timeout: step.timeout,
            waitUntil: step.waitUntil,
          });
          break;
        case "click":
          await executeWaitList(page, step.before ?? []);
          await executeClick(page, step.locator, {
            timeout: step.timeout,
            scrollIntoView: step.scrollIntoView,
          });
          await executeWaitList(page, step.after ?? []);
          break;
        default:
          throw new TypeError(
            `Action "${String((step as { action?: unknown }).action)}" is not supported by this step executor.`,
          );
      }
    } catch (error) {
      throw new StepExecutionError(caseId, stepIndex, String(action), error);
    }
  }
}

export async function startBrowserRun(
  settings: BrowserRunSettings = {},
): Promise<BrowserRun> {
  const browser = await chromium.launch({
    headless: settings.browser?.headless ?? true,
  });
  const activeSessions = new Set<CaseBrowserSession>();
  const pendingCreations = new Set<Promise<CaseBrowserSession>>();
  let lifecycleState: "open" | "closing" | "closed" = "open";
  let runClosePromise: Promise<void> | undefined;
  async function createSession(caseSettings: CaseSettings): Promise<CaseBrowserSession> {
    let context: BrowserContext | undefined;
    try {
      const createdContext = await browser.newContext({
        locale: settings.locale ?? "en-CA",
        timezoneId: caseSettings.browser?.timeZone ?? settings.browser?.timeZone ?? "UTC",
        viewport: caseSettings.browser?.viewport ?? settings.browser?.viewport ?? DEFAULT_VIEWPORT,
      });
      context = createdContext;
      if (lifecycleState !== "open") {
        throw new Error("The browser run is closing or closed.");
      }
      const page = await createdContext.newPage();
      if (lifecycleState !== "open") {
        throw new Error("The browser run is closing or closed.");
      }
      let sessionClosePromise: Promise<void> | undefined;
      const session: CaseBrowserSession = {
        context: createdContext,
        page,
        async resolveLocator(locator, options = {}) {
          const timeout = options.timeout ?? DEFAULT_LOCATOR_TIMEOUT;
          if (!Number.isInteger(timeout) || timeout < 1) {
            throw new RangeError("Locator timeout must be a positive integer in milliseconds.");
          }
          return resolveUniqueLocator(page, locator, timeout);
        },
        async click(locator, options = {}) {
          await executeClick(page, locator, options);
        },
        async runWaitList(waits) {
          await executeWaitList(page, waits);
        },
        async navigate(url, options = {}) {
          return executeNavigation(page, url, options);
        },
        async executeSteps(caseId, steps) {
          await executeCaseSteps(page, caseId, steps);
        },
        close() {
          if (sessionClosePromise) {
            return sessionClosePromise;
          }
          sessionClosePromise = (async () => {
            try {
              await createdContext.close();
            } finally {
              activeSessions.delete(session);
            }
          })();
          return sessionClosePromise;
        },
      };
      activeSessions.add(session);
      return session;
    } catch (error) {
      if (context) {
        try {
          await context.close();
        } catch {
          // Preserve the case setup error; run shutdown still closes Chromium.
        }
      }
      throw error;
    }
  }
  return {
    async createCaseSession(caseSettings = {}) {
      if (lifecycleState !== "open") {
        throw new Error("The browser run is closing or closed.");
      }
      const creationPromise = createSession(caseSettings);
      pendingCreations.add(creationPromise);
      try {
        return await creationPromise;
      } finally {
        pendingCreations.delete(creationPromise);
      }
    },
    close() {
      if (runClosePromise) {
        return runClosePromise;
      }
      lifecycleState = "closing";
      runClosePromise = (async () => {
        let firstError: unknown;
        for (const creationPromise of [...pendingCreations]) {
          try {
            await creationPromise;
          } catch {
            // Case setup already reports its failure to the caller; cleanup continues.
          }
        }
        for (const session of [...activeSessions]) {
          try {
            await session.close();
          } catch (error) {
            firstError ??= error;
          }
        }
        try {
          await browser.close();
        } catch (error) {
          firstError ??= error;
        } finally {
          lifecycleState = "closed";
        }
        if (firstError !== undefined) {
          throw firstError;
        }
      })();
      return runClosePromise;
    },
  };
}
