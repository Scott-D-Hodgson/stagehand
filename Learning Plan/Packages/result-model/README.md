# Course: Understanding `@stagehand/result-model`

This course teaches the shape of Stagehand's saved run results and the difference between describing a result and deciding one. The [package README](../../../packages/result-model/README.md) is the implementation reference.

## In this course you will learn

- Why JSON Schema and TypeScript types both exist.
- How runtime result validation works.
- How accessibility evidence is represented.
- Which outcome and aggregation rules remain outside this package.

## Do I need this course?

- [ ] I am changing the result JSON format or its TypeScript types.
- [ ] I need to interpret a `validateResult` issue.
- [ ] I am mapping accessibility findings into saved evidence.
- [ ] I need to separate result structure from execution policy.

## Current boundary

The package exports the normative result v1 schema, matching TypeScript types, and a runtime validator. It checks document shape and formats. It does not calculate fingerprints, create results, scan pages, or decide case/run outcomes.

## Lessons

1. [The result contract](Lessons/01-result-contract.md)
2. [Schema and TypeScript](Lessons/02-schema-and-types.md)
3. [Runtime validation](Lessons/03-runtime-validation.md)
4. [Accessibility evidence](Lessons/04-accessibility-evidence.md)
5. [Structure versus execution policy](Lessons/05-policy-boundary.md)

Finish with the [course skill check](quiz.md).
