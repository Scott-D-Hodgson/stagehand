# 3. Hugo documentation and end-to-end adoption

## Self-assessment: do I need this lesson?

- [ ] I can explain why canonical Markdown should be separate from its rendered website.
- [ ] I know what a static site generator does.
- [ ] I can outline an onboarding journey from obtaining Stagehand to reading a result.
- [ ] I can distinguish a synthetic example from a production-ready user plan.
- [ ] I know why documentation must be checked against actual CLI and editor behaviour.

## What you will learn

- How Hugo transforms source content into a static site.
- How to organise reusable Markdown guidance and navigation.
- How examples and tutorials support adoption without exposing real secrets.
- How to validate the complete user journey across editor, runner, and pipeline.

## Core ideas

A static site generator turns source files and templates into HTML, CSS, and other assets that can be hosted as files. Hugo is planned for the Stagehand documentation site, with canonical Markdown as the maintained source. The generated website is an output, not the place where documentation should be edited.

Useful docs answer a task in the order a person encounters it: install or obtain the tool, understand a plan, edit it in the Vue form-based editor, export it, run it with the CLI, interpret JSON, and optionally retain results in Azure Pipelines. Examples should use synthetic URLs and data, identify required user substitutions, and avoid presenting guesses as product guarantees.

Documentation can drift. Every example should be checked against the current schema, editor controls, CLI help, and output contract. Include the general warning about authorization, side effects, and costs. Explain that users own the systems against which they run tests.

## Apply this to Stagehand

Organise pages around user tasks and concepts, with navigation that works for someone new to the product. Reuse canonical Markdown where sensible; avoid hand-maintaining a second copy of the same reference material in the generated site. Add a short authoring walkthrough and example journeys that lead to a concrete exported plan and understandable result.

Treat a fresh-user journey as an integration review: can a tester locate the editor, create a plan, validate and export it, run it on Windows with the pinned Node.js 26.12.1 and Playwright-managed Chromium, and inspect JSON output? Then can an operator adapt the Azure pipeline example without accidentally committing secrets? Gaps found here should feed back into stories and docs.

## Exercise

Write a documentation outline for a first-time tester. For each page, name the reader's goal, required prior knowledge, action they will take, and evidence of success. Include one synthetic plan journey and identify every placeholder the reader must replace.

## You are ready when

- A new user can follow one coherent path from authoring through execution and result inspection.
- The Markdown source remains canonical and the generated site is reproducible.
- Documentation does not promise deferred formats, direct filesystem access, or unsupported platforms.

## Read next

- [Hugo documentation](https://gohugo.io/documentation/)
- [Hugo content formats](https://gohugo.io/content-management/formats/)
- [E07: Documentation and adoption](../../Planning/Backlog/epics/E07-documentation/README.md)
- [Example journeys](../../Planning/Backlog/example-journeys.md)
- [Phase 4 roadmap](../../Planning/Roadmap/Phase-4-reporting-integrations-and-adoption/README.md)

## Reinforcement quiz

1. What is canonical in the planned documentation workflow: Markdown or generated HTML?
2. What does a static site generator contribute?
3. Why should example plans use synthetic data?
4. Name the core steps in a first-user journey for Stagehand.
5. What warning belongs in run guidance?

<details>
<summary>Answer key</summary>

1. Markdown is canonical; generated HTML is a publishable output.
2. It transforms content and templates into a static site that can be hosted without a Stagehand backend.
3. To avoid exposing real URLs, data, or credentials and to make examples safe to share.
4. Author in the editor, validate/export the plan, run with the CLI, inspect JSON, and optionally retain it as a pipeline artifact.
5. A general warning that users are responsible for authorization, side effects, and costs of the target environment.

</details>
