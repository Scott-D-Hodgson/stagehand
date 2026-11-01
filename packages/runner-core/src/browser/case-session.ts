import type { BrowserContext, Page } from "playwright";
import type { BrowserRunSettings, CaseBrowserSession } from "./types.js";
import type { EffectiveAccessibilitySettings, StepAccessibilityScan } from "../accessibility/types.js";
import { DEFAULT_LOCATOR_TIMEOUT } from "../defaults.js";
import { resolveUniqueLocator } from "../locators.js";
import { executeWaitList } from "../waits.js";
import { executeStringAssertion, checkAssociatedLabel } from "../assertions.js";
import { executeNavigation } from "../actions/navigation.js";
import { executeClick } from "../actions/interactions/click.js";
import { executeType } from "../actions/interactions/type.js";
import { executeFill } from "../actions/interactions/fill.js";
import { executeSelectOption } from "../actions/interactions/select-option.js";
import { executeCaseSteps } from "../steps/execute.js";
import { createAccessibilityFindingCollector } from "../accessibility/collection.js";
import { scanAccessibility } from "../accessibility/scan.js";

export function createCaseBrowserSession(
  createdContext: BrowserContext,
  page: Page,
  settings: BrowserRunSettings,
  accessibility: EffectiveAccessibilitySettings,
  onClose: (session: CaseBrowserSession) => void,
): CaseBrowserSession {
  const collector = createAccessibilityFindingCollector();
  const scans: StepAccessibilityScan[] = [];
  let sessionClosePromise: Promise<void> | undefined;
  const session: CaseBrowserSession = {
    context: createdContext,
    page,
    accessibility,
    async scanAccessibility() {
      return scanAccessibility(page, session.accessibility);
    },
    getAccessibilityFindings() {
      return collector.getFindings();
    },
    getAccessibilityScans() {
      return scans.map((scan) => ({ ...scan }));
    },
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
    async type(locator, text, options = {}) {
      await executeType(page, locator, text, options);
    },
    async fill(locator, value, options = {}) {
      await executeFill(page, locator, value, options);
    },
    async selectOption(locator, selection, options = {}) {
      await executeSelectOption(page, locator, selection, options);
    },
    async assertText(locator, expected, options = {}) {
      await executeStringAssertion(
        page,
        locator,
        expected,
        settings.locale ?? "en-CA",
        options.timeout,
        "assertText",
      );
    },
    async assertHtml(locator, expected, options = {}) {
      await executeStringAssertion(
        page,
        locator,
        expected,
        settings.locale ?? "en-CA",
        options.timeout,
        "assertHtml",
      );
    },
    async assertValue(locator, expected, options = {}) {
      const locale = settings.locale ?? "en-CA";
      const deadline = performance.now() + (options.timeout ?? DEFAULT_LOCATOR_TIMEOUT);
      await executeStringAssertion(page, locator, expected, locale, options.timeout, "assertValue");
      if (options.associatedLabel !== undefined) {
        return checkAssociatedLabel(page, locator, options.associatedLabel, locale, deadline);
      }
    },
    async runWaitList(waits) {
      await executeWaitList(page, waits);
    },
    async navigate(url, options = {}) {
      return executeNavigation(page, url, options);
    },
    async executeSteps(caseId, steps) {
      return executeCaseSteps(page, caseId, steps, settings.locale ?? "en-CA", async (stepIndex) => {
        if (!session.accessibility.enabled || page.isClosed()) {
          return;
        }
        const outcome = await session.scanAccessibility();
        if (outcome.status === "completed") {
          scans.push({ caseId, stepIndex, results: outcome.results });
          collector.add(outcome.results);
        }
      });
    },
    close() {
      if (sessionClosePromise) {
        return sessionClosePromise;
      }
      sessionClosePromise = (async () => {
        try {
          await createdContext.close();
        } finally {
          onClose(session);
        }
      })();
      return sessionClosePromise;
    },
  };
  return session;
}
