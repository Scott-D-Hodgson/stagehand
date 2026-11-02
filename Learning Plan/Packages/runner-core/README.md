# Course: Understanding `@stagehand/runner-core`

This course teaches how Stagehand controls a browser session, executes validated steps, and gathers accessibility observations. The [package README](../../../packages/runner-core/README.md) is the detailed API reference.

## In this course you will learn

- How one browser run manages isolated case sessions and cleanup.
- How locators, waits, actions, assertions, and step dispatch work together.
- How ordinary variables are prepared before case-step dispatch.
- How accessibility settings, scans, mapping, and collection remain separate responsibilities.

## Do I need this course?

- [ ] I am changing browser lifecycle or case-session behaviour.
- [ ] I am adding or reviewing an action, assertion, wait, or locator.
- [ ] I need to understand hard versus soft failures.
- [ ] I am working on axe scanning or retained accessibility evidence.

## Current boundary

Runner-core manages Playwright Chromium, isolated case sessions, the current action/assertion vocabulary, automatic eligible-step scans, finding mapping/collection, and ordinary case preparation before dispatch. Full plan orchestration, result production, protected-value safety, and M6 outcome policy remain future work. The current mocked-browser suite has 134 passing tests in the development container. Actual Chromium/axe assessment tests remain deferred until Stagehand has a project-owned test site.

## Lessons

1. [Browser lifecycle](Lessons/01-browser-lifecycle.md)
2. [Locators](Lessons/02-locators.md)
3. [Waits](Lessons/03-waits.md)
4. [Actions](Lessons/04-actions.md)
5. [Assertions](Lessons/05-assertions.md)
6. [Step dispatch](Lessons/06-step-dispatch.md)
7. [Case preparation](Lessons/07-case-preparation.md)
8. [Accessibility settings and scans](Lessons/08-accessibility-scans.md)
9. [Accessibility mapping and collection](Lessons/09-accessibility-evidence.md)
10. [Package structure and verification](Lessons/10-structure-and-verification.md)

Finish with the [course skill check](quiz.md).
