import { errors, type Page } from "playwright";
import { DEFAULT_LOCATOR_TIMEOUT } from "../defaults.js";
import { LocatorResolutionError } from "../locators.js";
import { executeWaitList } from "../waits.js";
import {
  StringAssertionMismatchError,
  executeStringAssertion,
  checkAssociatedLabel,
  resolveExpectedValue,
} from "../assertions.js";
import { executeNavigation } from "../actions/navigation.js";
import { executeClick } from "../actions/interactions/click.js";
import { executeType } from "../actions/interactions/type.js";
import { executeFill } from "../actions/interactions/fill.js";
import { executeSelectOption } from "../actions/interactions/select-option.js";
import type { ExecutableStep, SoftAssertionFailure } from "./types.js";

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

export async function executeCaseSteps(
  page: Page,
  caseId: string,
  steps: readonly ExecutableStep[],
  locale: string,
  afterStep: (stepIndex: number) => Promise<void>,
): Promise<SoftAssertionFailure[]> {
  if (!Array.isArray(steps)) {
    throw new TypeError("Case steps must be an array.");
  }
  const softFailures: SoftAssertionFailure[] = [];
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
        case "type":
          await executeWaitList(page, step.before ?? []);
          await executeType(page, step.locator, step.text, {
            timeout: step.timeout,
            scrollIntoView: step.scrollIntoView,
          });
          await executeWaitList(page, step.after ?? []);
          break;
        case "fill":
          await executeWaitList(page, step.before ?? []);
          await executeFill(page, step.locator, step.value, {
            timeout: step.timeout,
            scrollIntoView: step.scrollIntoView,
          });
          await executeWaitList(page, step.after ?? []);
          break;
        case "selectOption":
          await executeWaitList(page, step.before ?? []);
          await executeSelectOption(
            page,
            step.locator,
            typeof step.value === "string"
              ? { value: step.value }
              : { label: step.label as string },
            {
              timeout: step.timeout,
              scrollIntoView: step.scrollIntoView,
            },
          );
          await executeWaitList(page, step.after ?? []);
          break;
        case "assertText":
        case "assertHtml":
        case "assertValue": {
          const deadline = performance.now() + (step.timeout ?? DEFAULT_LOCATOR_TIMEOUT);
          try {
            await executeStringAssertion(
              page,
              step.locator,
              step.expected,
              locale,
              step.timeout,
              step.action,
            );
          } catch (error) {
            if (
              step.soft === true &&
              (error instanceof StringAssertionMismatchError ||
                error instanceof LocatorResolutionError ||
                error instanceof errors.TimeoutError)
            ) {
              const expectedText = resolveExpectedValue(step.expected, locale);
              softFailures.push({
                caseId,
                stepIndex,
                action: step.action,
                expected: expectedText,
                ...(error instanceof StringAssertionMismatchError ? { actual: error.actual } : {}),
                message: error.message,
              });
            } else {
              throw error;
            }
          }
          if (step.action === "assertValue" && step.associatedLabel !== undefined) {
            const failure = await checkAssociatedLabel(page, step.locator, step.associatedLabel, locale, deadline);
            if (failure) {
              softFailures.push({ caseId, stepIndex, action: step.action, check: "associatedLabel", ...failure });
            }
          }
          break;
        }
        default:
          throw new TypeError(
            `Action "${String((step as { action?: unknown }).action)}" is not supported by this step executor.`,
          );
      }
    } catch (error) {
      if (
        (action === "assertText" || action === "assertHtml" || action === "assertValue") &&
        (error instanceof StringAssertionMismatchError || error instanceof LocatorResolutionError || error instanceof errors.TimeoutError)
      ) {
        try {
          await afterStep(stepIndex);
        } catch (scanError) {
          throw new StepExecutionError(caseId, stepIndex, String(action), new AggregateError([error, scanError], "Assertion and accessibility scan failed."));
        }
      }
      throw new StepExecutionError(caseId, stepIndex, String(action), error);
    }
    try {
      await afterStep(stepIndex);
    } catch (error) {
      throw new StepExecutionError(caseId, stepIndex, String(action), error);
    }
  }
  return softFailures;
}
