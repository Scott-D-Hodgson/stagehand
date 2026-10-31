import {
  chromium,
  errors,
  type BrowserContext,
  type Locator,
  type Page,
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

export interface BrowserRun {
  createCaseSession(settings?: CaseSettings): Promise<CaseBrowserSession>;
  close(): Promise<void>;
}

const DEFAULT_VIEWPORT: Viewport = { width: 1280, height: 720 };
const DEFAULT_LOCATOR_TIMEOUT = 30_000;
const LOCATOR_RETRY_DELAY = 1_000;
const MAX_LOCATOR_ATTEMPTS = 3;

export class LocatorResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocatorResolutionError";
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
