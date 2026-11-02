# Course: Understanding `@stagehand/plan-schema`

This course teaches how Stagehand describes valid plan and case documents, checks them, and prepares ordinary variable values. The [package README](../../../packages/plan-schema/README.md) remains the detailed implementation reference.

## In this course you will learn

- What a Stagehand document contract promises.
- How single-document, reference, and bundle validation differ.
- How variables, named data sets, and shared steps are validated and prepared.
- What this package deliberately leaves to file loading and browser execution.

## Do I need this course?

- [ ] I review changes to plan or case JSON.
- [ ] I need to understand a validation error path.
- [ ] I am changing variables, data sets, references, or schema versions.
- [ ] I need to know whether a rule belongs in `plan-schema`, `plan-engine`, or `runner-core`.

If you checked any item, this course is relevant.

## Current boundary

The package validates v1 plan/case shapes, semantic locale/time-zone/URL rules, case references, parsed bundles, ordinary and protected variable definitions, named data-set structure, and shared-step group/call relationships. It can select a case default or explicit data set, expand shared-step calls with source identity, then prepare variable references using the calling case's selected context. A selected protected `{ "env": "NAME" }` reference remains protected until a caller uses the pure, injected-map lookup helper; preparation still stops before browser dispatch. The package does not read files, execute shared steps, read `process.env`, or start a browser. The focused suite passed 65 tests in the development container before the shared-step expansion slice; record its updated result before merging.

## Lessons

1. [Contracts](Lessons/01-contracts.md)
2. [Validation](Lessons/02-validation.md)
3. [Case references](Lessons/03-case-references.md)
4. [Bundle validation](Lessons/04-bundle-validation.md)
5. [Variables](Lessons/05-variables.md)
6. [Data sets](Lessons/06-data-sets.md)
7. [Shared-step contracts](Lessons/07-shared-step-contracts.md)
8. [Shared-step expansion](Lessons/08-shared-step-expansion.md)

Finish with the [course skill check](quiz.md).
