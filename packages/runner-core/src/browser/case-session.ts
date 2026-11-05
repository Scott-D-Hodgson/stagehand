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
import { prepareCaseForExecution } from "../steps/case.js";
import { createAccessibilityFindingCollector } from "../accessibility/collection.js";
import { scanAccessibility } from "../accessibility/scan.js";

/*
Creates one isolated case-session API.
---
Inputs: Context, page, run settings, accessibility settings, and close callback.
---
Output: A case browser session.
*/
export function createCaseBrowserSession(input: {
  context: BrowserContext;
  page: Page;
  settings: BrowserRunSettings;
  accessibility: EffectiveAccessibilitySettings;
  onClose: (session: CaseBrowserSession) => void;
}): CaseBrowserSession {
  const collector = createAccessibilityFindingCollector();
  const scans: StepAccessibilityScan[] = [];
  let sessionClosePromise: Promise<void> | undefined;
  const session: CaseBrowserSession = {
    context: input.context,
    page: input.page,
    accessibility: input.accessibility,
    async scanAccessibility(protectedValues = []) {
      return scanAccessibility({
        page: input.page,
        accessibility: session.accessibility,
        protectedValues,
      });
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
      return resolveUniqueLocator(input.page, locator, timeout);
    },
    async click(locator, options = {}) {
      await executeClick(session.page, locator, options);
    },
    async type(locator, text, options = {}) {
      await executeType(session.page, locator, text, options);
    },
    async fill(locator, value, options = {}) {
      await executeFill(session.page, locator, value, options);
    },
    async selectOption(locator, selection, options = {}) {
      await executeSelectOption(session.page, locator, selection, options);
    },
    async assertText(locator, expected, options = {}) {
      await executeStringAssertion({
        page: session.page,
        definition: locator,
        expected,
        locale: input.settings.locale ?? "en-CA",
        timeout: options.timeout,
        action: "assertText",
      });
    },
    async assertHtml(locator, expected, options = {}) {
      await executeStringAssertion({
        page: session.page,
        definition: locator,
        expected,
        locale: input.settings.locale ?? "en-CA",
        timeout: options.timeout,
        action: "assertHtml",
      });
    },
    async assertValue(locator, expected, options = {}) {
      const locale = input.settings.locale ?? "en-CA";
      const deadline = performance.now() + (options.timeout ?? DEFAULT_LOCATOR_TIMEOUT);
      await executeStringAssertion({
        page: session.page,
        definition: locator,
        expected,
        locale,
        timeout: options.timeout,
        action: "assertValue",
      });
      if (options.associatedLabel !== undefined) {
        return checkAssociatedLabel({
          page: session.page,
          definition: locator,
          expected: options.associatedLabel,
          locale,
          deadline,
        });
      }
    },
    async runWaitList(waits) {
      await executeWaitList(session.page, waits);
    },
    async navigate(url, options = {}) {
      return executeNavigation(session.page, url, options);
    },
    async executeSteps(caseId, steps, stepIdentities, protectedValues = []) {
      return executeCaseSteps({
        page: session.page,
        caseId,
        steps,
        locale: input.settings.locale ?? "en-CA",
        afterStep: async (stepIndex) => {
          if (!session.accessibility.enabled || session.page.isClosed()) {
            return;
          }
          const outcome = await session.scanAccessibility(protectedValues);
          if (outcome.status === "completed") {
            scans.push({ caseId, stepIndex, results: outcome.results });
            collector.add(outcome.results);
          }
        },
        ...(stepIdentities === undefined ? {} : { stepIdentities }),
        protectedValues,
      });
    },
    async executeCase(options) {
      const prepared = prepareCaseForExecution(options, input.settings.locale ?? "en-CA");
      return session.executeSteps(prepared.caseId, prepared.steps, prepared.stepIdentities, prepared.protectedValues);
    },
    close() {
      if (sessionClosePromise) {
        return sessionClosePromise;
      }
      sessionClosePromise = (async () => {
        try {
          await input.context.close();
        } finally {
          input.onClose(session);
        }
      })();
      return sessionClosePromise;
    },
  };
  return session;
}
