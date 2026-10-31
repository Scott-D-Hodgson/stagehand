import {
  chromium,
  type BrowserContext,
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
  close(): Promise<void>;
}

export interface BrowserRun {
  createCaseSession(settings?: CaseSettings): Promise<CaseBrowserSession>;
  close(): Promise<void>;
}

const DEFAULT_VIEWPORT: Viewport = { width: 1280, height: 720 };

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
