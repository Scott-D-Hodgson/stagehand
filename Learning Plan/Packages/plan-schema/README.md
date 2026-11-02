# Course: Understanding `@stagehand/plan-schema`

This course teaches how Stagehand describes valid plan and case documents, checks them, and prepares ordinary variable values. The [package README](../../../packages/plan-schema/README.md) remains the detailed implementation reference.

## In this course you will learn

- What a Stagehand document contract promises.
- How single-document, reference, and bundle validation differ.
- How variables and named data sets are represented and checked.
- What this package deliberately leaves to file loading and browser execution.

## Do I need this course?

- [ ] I review changes to plan or case JSON.
- [ ] I need to understand a validation error path.
- [ ] I am changing variables, data sets, references, or schema versions.
- [ ] I need to know whether a rule belongs in `plan-schema`, `plan-engine`, or `runner-core`.

If you checked any item, this course is relevant.

## Current boundary

The package validates v1 plan/case shapes, semantic locale/time-zone/URL rules, case references, parsed bundles, ordinary variables, and named data-set structure. It can prepare ordinary variable references. It does not read files, select data sets, resolve protected environment values, or start a browser. The focused suite currently has 59 passing tests in the development container.

## Lessons

1. [Contracts](Lessons/01-contracts.md)
2. [Validation](Lessons/02-validation.md)
3. [Case references](Lessons/03-case-references.md)
4. [Bundle validation](Lessons/04-bundle-validation.md)
5. [Variables](Lessons/05-variables.md)
6. [Data sets](Lessons/06-data-sets.md)

Finish with the [course skill check](quiz.md).
