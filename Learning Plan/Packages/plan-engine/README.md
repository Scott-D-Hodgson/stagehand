# Course: Understanding `@stagehand/plan-engine`

This course teaches how Stagehand safely loads a plan and its referenced case files in Node.js. The [package README](../../../packages/plan-engine/README.md) is the implementation reference.

## In this course you will learn

- Why file access is separate from shared document validation.
- How referenced cases remain tied to their plan entries.
- How Stagehand keeps file loading inside the plan directory.
- Why exact source bytes produce a repeatable fingerprint.

## Do I need this course?

- [ ] I am changing plan or case file loading.
- [ ] I need to review path, link, or capitalization safety.
- [ ] I need to understand `loadPlanFile` failures.
- [ ] I am working with source fingerprints.

## Current boundary

`loadPlanFile` reads one plan and only its referenced cases, validates the loaded bundle, checks path containment, and calculates `sha256-v1`. It does not interpret or run steps, start a browser, or produce a run result.

## Lessons

1. [Loading plans and cases](Lessons/01-loading.md)
2. [Path and link safety](Lessons/02-path-safety.md)
3. [Bundle hand-off](Lessons/03-bundle-hand-off.md)
4. [Source fingerprints](Lessons/04-fingerprints.md)

Finish with the [course skill check](quiz.md).
