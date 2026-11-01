import { chromium, type BrowserContext } from "playwright";
import type { BrowserRunSettings, BrowserRun, CaseSettings, CaseBrowserSession } from "./types.js";
import { DEFAULT_VIEWPORT } from "../defaults.js";
import { resolveAccessibilitySettings } from "../accessibility/settings.js";
import { createCaseBrowserSession } from "./case-session.js";

export async function startBrowserRun(
  settings: BrowserRunSettings = {},
): Promise<BrowserRun> {
  const runAccessibility = resolveAccessibilitySettings(settings.accessibility);
  const browser = await chromium.launch({
    headless: settings.browser?.headless ?? true,
  });
  const activeSessions = new Set<CaseBrowserSession>();
  const pendingCreations = new Set<Promise<CaseBrowserSession>>();
  let lifecycleState: "open" | "closing" | "closed" = "open";
  let runClosePromise: Promise<void> | undefined;
  async function createSession(caseSettings: CaseSettings): Promise<CaseBrowserSession> {
    const accessibility = resolveAccessibilitySettings(runAccessibility, caseSettings.accessibility);
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
      const session = createCaseBrowserSession(createdContext, page, settings, accessibility, (closedSession) => {
        activeSessions.delete(closedSession);
      });
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
