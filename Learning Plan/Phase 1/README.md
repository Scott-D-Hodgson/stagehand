# Course: Phase 1 — Contracts and execution foundations

Phase 1 builds the dependable base that later editor, CLI, and reporting work rely on.

## Phase status

M1 through M7 are complete. The course reflects the implemented reusable foundation and its limits: the clean development-container verification uses package and browser/axe doubles, while the CLI, report files, editor, parallel execution, and real Chromium/axe assessment belong to later work. See the [M7 close-out](../../Planning/Work%20Plan/M7-integration-and-phase-1-review.md#m76-phase-1-close-out-and-hand-off) for the evidence and hand-off map. The [work-plan index](../../Planning/Work%20Plan/README.md) links the consistent M0–M7 completion records and their learning references.

## In this phase you will learn

- How Stagehand changes are governed and organized.
- How plans, cases, results, browser work, and reusable inputs fit together.
- How failures and integration boundaries are made explicit.

## Do I need this phase?

- [ ] I am contributing implementation code or reviewing a Phase 1 PR.
- [ ] I need to understand Stagehand's core contracts and package boundaries.
- [ ] I am working on browser execution, variables, shared steps, or error policy.

## Prerequisites

Basic familiarity with Git, JSON, and TypeScript is helpful but not required; technical terms are introduced in the lessons.

## Lessons

1. [Repository collaboration](Lessons/01-repository-collaboration.md)
2. [Package architecture](Lessons/02-package-architecture.md)
3. [Development environment](Lessons/03-development-environment.md)
4. [Plan and case contracts](Lessons/04-plan-case-contracts.md)
5. [Result contracts](Lessons/05-result-contracts.md)
6. [Plan loading and source identity](Lessons/06-plan-loading.md)
7. [Browser lifecycle and isolation](Lessons/07-browser-lifecycle.md)
8. [Locators, waits, and actions](Lessons/08-page-interactions.md)
9. [Assertions and accessibility](Lessons/09-assertions-accessibility.md)
10. [Variables and data sets](Lessons/10-variables-data-sets.md)
11. [Shared steps](Lessons/11-shared-steps.md)
12. [Errors and execution policy](Lessons/12-errors-policy.md)
13. [Phase integration review](Lessons/13-integration-review.md)

Finish with the [Phase 1 skill check](quiz.md).
