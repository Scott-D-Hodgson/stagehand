# 2. Plan authoring, validation, and accessible interaction

## Self-assessment: do I need this lesson?

- [ ] I can explain why a form should guide a user toward valid choices.
- [ ] I know the difference between field-level, document-level, and execution-time validation.
- [ ] I can describe how to represent repeated steps and nested plan concepts without making the editor confusing.
- [ ] I know why localized expected values should not be confused with browser locale.
- [ ] I can name a way to make an editor usable with a keyboard and assistive technology.

## What you will learn

- How to turn a structured plan contract into a form-driven authoring flow.
- How to report validation errors near the control that can fix them.
- How to make complex concepts such as variables, data sets, and shared steps understandable.
- How accessibility and localization affect editor design.

## Core ideas

Validation is a set of guardrails, not a scolding. A form can prevent invalid combinations, explain required fields, and still validate the whole document before export. Some rules depend on multiple fields or referenced files, so they cannot be checked by one input control alone. Runtime checks still matter for environment variables and browser behaviour that the editor cannot know.

Stagehand users author test plans, not programming scripts. Prefer clear labels, guided choices, and summaries. Loops and their authoring controls are deferred beyond MVP. For named data sets, the editor should make selected inputs and overrides understandable. Shared steps should show where they are called and which case variables they use. Do not hide structure merely to make a screen look simple.

Localization has two separate jobs: browser locale configures the page under test, while localized expected values let the plan assert different text for different cultures. Keep these controls separate and make the selected locale/value pairing visible.

## Apply this to Stagehand

Use the shared plan schema to validate document shape, and provide actionable paths to the invalid field or referenced case. Keep stable IDs separate from human-readable names, which may be edited or translated. The planned editor supports plans, cases, browser/run configuration, localized expected values, variables, shared steps, and referenced case files.

The intended first user is a non-technical tester. Use plain-language labels and examples, but keep advanced options discoverable. Ensure keyboard focus is visible, controls have programmatic labels, errors are associated with fields, and dialogs can be operated without a mouse. Automated accessibility checks are useful but do not replace trying the main workflow with keyboard navigation.

## Exercise

Sketch a form for an input-value assertion with two localized expected values. Add one valid and three invalid examples: missing selector, unsupported locale tag, and a value that does not match the schema. For each, write the message and where it should appear. Then describe how a keyboard user reaches and corrects each field.

## You are ready when

- A tester can tell what to enter, why a value is invalid, and how to fix it.
- Schema errors and cross-field errors are presented in context without claiming the plan ran.
- Localized expected values and browser locale are distinct in both labels and behaviour.

## Read next

- [Vue form input bindings](https://vuejs.org/guide/essentials/forms.html)
- [Epic E05: Local-first web editor](../../Planning/Backlog/epics/E05-web-editor/README.md)
- [Plan schema story ATR-001](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md)
- [Localized plan content ATR-005](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-005.md)

## Reinforcement quiz

1. Why does a form still need whole-document validation?
2. Name one rule that might need more than a single field to validate.
3. What is the difference between browser locale and localized expected text?
4. Why should an error message be associated with its field?

<details>
<summary>Answer key</summary>

1. References and relationships across fields or files may be invalid even when each individual input looks valid.
2. Examples include a case's referenced data set, a shared-group reference, or consistency between an action and its required locator.
3. Browser locale affects the application-under-test session. Localized expected text selects the assertion value for the intended culture.
4. It helps users find and correct the problem, including users navigating with assistive technology.

</details>
