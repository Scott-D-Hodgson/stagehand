import type { LocatorDefinition } from "../locators.js";
import type { WaitDefinition } from "../waits.js";
import type { NavigationWaitUntil } from "../actions/navigation.js";
import type { SelectOptionSelection } from "../actions/interactions/select-option.js";
import type { ExpectedValue } from "../assertions.js";

export interface SoftAssertionFailure {
  caseId: string;
  stepIndex: number;
  action: "assertText" | "assertHtml" | "assertValue";
  check?: "associatedLabel";
  expected: string;
  actual?: string;
  message: string;
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

export interface TypeStep {
  action: "type";
  locator: LocatorDefinition;
  text: string;
  timeout?: number;
  before?: readonly WaitDefinition[];
  after?: readonly WaitDefinition[];
  scrollIntoView?: boolean;
}

export interface FillStep {
  action: "fill";
  locator: LocatorDefinition;
  value: string;
  timeout?: number;
  before?: readonly WaitDefinition[];
  after?: readonly WaitDefinition[];
  scrollIntoView?: boolean;
}

export type SelectOptionStep = {
  action: "selectOption";
  locator: LocatorDefinition;
  timeout?: number;
  before?: readonly WaitDefinition[];
  after?: readonly WaitDefinition[];
  scrollIntoView?: boolean;
} & SelectOptionSelection;

export interface AssertTextStep {
  action: "assertText";
  locator: LocatorDefinition;
  expected: ExpectedValue;
  timeout?: number;
  soft?: boolean;
}

export interface AssertHtmlStep {
  action: "assertHtml";
  locator: LocatorDefinition;
  expected: ExpectedValue;
  timeout?: number;
  soft?: boolean;
}

export interface AssertValueStep {
  action: "assertValue";
  locator: LocatorDefinition;
  expected: ExpectedValue;
  associatedLabel?: ExpectedValue;
  timeout?: number;
  soft?: boolean;
}

export type ExecutableStep =
  | NavigateStep
  | ClickStep
  | TypeStep
  | FillStep
  | SelectOptionStep
  | AssertTextStep
  | AssertHtmlStep
  | AssertValueStep;
