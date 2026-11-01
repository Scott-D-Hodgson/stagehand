import { errors, type Page } from "playwright";
import { DEFAULT_LOCATOR_TIMEOUT } from "./defaults.js";
import { createLocator, resolveUniqueLocator, type LocatorDefinition } from "./locators.js";

export interface AssertionOptions {
  timeout?: number;
}

export interface ValueAssertionOptions extends AssertionOptions {
  associatedLabel?: ExpectedValue;
}

export interface AssociatedLabelFailure {
  expected: string;
  actual?: string;
  message: string;
}

export interface ExpectedValue {
  default: string;
  locales?: Record<string, string>;
}

export class StringAssertionMismatchError extends Error {
  expected: string;
  actual: string;
  constructor(action: "assertText" | "assertHtml" | "assertValue", expected: string, actual: string) {
    const contentType = action === "assertText" ? "text" : action === "assertHtml" ? "HTML" : "value";
    super(`Expected ${contentType} ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}.`);
    this.name = "StringAssertionMismatchError";
    this.expected = expected;
    this.actual = actual;
  }
}

export function resolveExpectedValue(expected: ExpectedValue, locale: string): string {
  if (
    typeof expected !== "object" ||
    expected === null ||
    typeof expected.default !== "string" ||
    (expected.locales !== undefined &&
      (typeof expected.locales !== "object" || expected.locales === null || Array.isArray(expected.locales)))
  ) {
    throw new TypeError("Assertion expected value must have a string default and optional locale values.");
  }
  const canonicalLocale = Intl.getCanonicalLocales(locale)[0];
  if (expected.locales) {
    for (const [key, value] of Object.entries(expected.locales)) {
      if (typeof value !== "string") {
        throw new TypeError("Assertion locale values must be strings.");
      }
      if (Intl.getCanonicalLocales(key)[0] === canonicalLocale) {
        return value;
      }
    }
  }
  return expected.default;
}

export async function executeStringAssertion(
  page: Page,
  definition: LocatorDefinition,
  expected: ExpectedValue,
  locale: string,
  timeout: number | undefined,
  action: "assertText" | "assertHtml" | "assertValue",
): Promise<void> {
  const effectiveTimeout = timeout ?? DEFAULT_LOCATOR_TIMEOUT;
  if (!Number.isInteger(effectiveTimeout) || effectiveTimeout < 1) {
    throw new RangeError(`${action} timeout must be a positive integer in milliseconds.`);
  }
  const expectedText = resolveExpectedValue(expected, locale);
  const deadline = performance.now() + effectiveTimeout;
  const locator = await resolveUniqueLocator(page, definition, effectiveTimeout);
  const remaining = Math.floor(deadline - performance.now());
  if (remaining < 1) {
    throw new errors.TimeoutError(
      `${action} exceeded its ${effectiveTimeout} millisecond timeout while resolving the locator.`,
    );
  }
  const actualValue =
    action === "assertText"
      ? await locator.innerText({ timeout: remaining })
      : action === "assertHtml"
        ? await locator.innerHTML({ timeout: remaining })
        : await locator.inputValue({ timeout: remaining });
  if (actualValue !== expectedText) {
    throw new StringAssertionMismatchError(action, expectedText, actualValue);
  }
}

export async function checkAssociatedLabel(
  page: Page,
  definition: LocatorDefinition,
  expected: ExpectedValue,
  locale: string,
  deadline: number,
): Promise<AssociatedLabelFailure | undefined> {
  const expectedText = resolveExpectedValue(expected, locale);
  try {
    const remaining = Math.floor(deadline - performance.now());
    if (remaining < 1) {
      throw new errors.TimeoutError("Associated-label check exceeded the assertion timeout.");
    }
    const texts = await createLocator(page, definition).evaluate((element) => {
      const labels = (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).labels;
      return Array.from(labels ?? [], (label) => label.innerText);
    }, undefined, { timeout: remaining });
    if (texts.length !== 1) {
      return {
        expected: expectedText,
        message: `Associated-label check found ${texts.length} labels; exactly one is required.`,
      };
    }
    if (texts[0] !== expectedText) {
      return {
        expected: expectedText,
        actual: texts[0]!,
        message: `Expected associated label ${JSON.stringify(expectedText)} but received ${JSON.stringify(texts[0])}.`,
      };
    }
  } catch (error) {
    if (!(error instanceof errors.TimeoutError)) {
      throw error;
    }
    return { expected: expectedText, message: error.message };
  }
}
