import type { BrowserContext, Locator, Page, Response } from "playwright";
import type { ResultAccessibilityFinding } from "@stagehand/result-model";
import type {
  AccessibilitySettings,
  EffectiveAccessibilitySettings,
  AccessibilityScanOutcome,
  StepAccessibilityScan,
} from "../accessibility/types.js";
import type { LocatorDefinition, LocatorResolutionOptions } from "../locators.js";
import type { ClickOptions } from "../actions/interactions/click.js";
import type { TypeOptions } from "../actions/interactions/type.js";
import type { FillOptions } from "../actions/interactions/fill.js";
import type {
  SelectOptionOptions,
  SelectOptionSelection,
} from "../actions/interactions/select-option.js";
import type {
  AssertionOptions,
  ValueAssertionOptions,
  AssociatedLabelFailure,
  ExpectedValue,
} from "../assertions.js";
import type { WaitDefinition } from "../waits.js";
import type { NavigationOptions } from "../actions/navigation.js";
import type { ExecutableStep, SoftAssertionFailure } from "../steps/types.js";
import type { CaseExecutionOptions } from "../steps/case.js";

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
  accessibility?: AccessibilitySettings;
}

export interface CaseSettings {
  browser?: BrowserContextSettings;
  accessibility?: AccessibilitySettings;
}

export interface CaseBrowserSession {
  context: BrowserContext;
  page: Page;
  accessibility: EffectiveAccessibilitySettings;
  scanAccessibility(): Promise<AccessibilityScanOutcome>;
  getAccessibilityFindings(): ResultAccessibilityFinding[];
  getAccessibilityScans(): StepAccessibilityScan[];
  resolveLocator(
    locator: LocatorDefinition,
    options?: LocatorResolutionOptions,
  ): Promise<Locator>;
  click(locator: LocatorDefinition, options?: ClickOptions): Promise<void>;
  type(locator: LocatorDefinition, text: string, options?: TypeOptions): Promise<void>;
  fill(locator: LocatorDefinition, value: string, options?: FillOptions): Promise<void>;
  selectOption(
    locator: LocatorDefinition,
    selection: SelectOptionSelection,
    options?: SelectOptionOptions,
  ): Promise<void>;
  assertText(
    locator: LocatorDefinition,
    expected: ExpectedValue,
    options?: AssertionOptions,
  ): Promise<void>;
  assertHtml(
    locator: LocatorDefinition,
    expected: ExpectedValue,
    options?: AssertionOptions,
  ): Promise<void>;
  assertValue(
    locator: LocatorDefinition,
    expected: ExpectedValue,
    options?: ValueAssertionOptions,
  ): Promise<AssociatedLabelFailure | undefined>;
  runWaitList(waits: readonly WaitDefinition[]): Promise<void>;
  navigate(url: string, options?: NavigationOptions): Promise<Response | null>;
  executeSteps(
    caseId: string,
    steps: readonly ExecutableStep[],
  ): Promise<SoftAssertionFailure[]>;
  executeCase(options: CaseExecutionOptions): Promise<SoftAssertionFailure[]>;
  close(): Promise<void>;
}

export interface BrowserRun {
  createCaseSession(settings?: CaseSettings): Promise<CaseBrowserSession>;
  close(): Promise<void>;
}
