# Lesson 4: Focused editor tests

> “What is the smallest editor test that earns its keep?” — Tessa “Test” Roy, Developer

[← Previous: container visual checks](03-container-visual-checks.md) · [Course outline](../README.md) · [Next: document-state path →](05-document-state-path.md)

Vitest is the editor unit-test runner. It shares Vite's transformation pipeline, so TypeScript modules can be tested without creating a separate test build configuration. The first test checks the editor validation boundary with one minimal valid plan and one invalid plan that omits a required property.

Run the one-time test command from the repository root:

```bash
npm test --workspace @stagehand/web
```

Use unit tests for deterministic document-state rules: preserving a recovered out-of-catalogue locale, calculating whether an export is allowed, or comparing a local revision. The current draft tests prove that an out-of-catalogue locale value preserves unrelated plan data and does not mutate the original draft. They do not prove keyboard behaviour, screen-reader announcements, or browser storage behaviour. Those require appropriately scoped browser checks later.

Localization tests also belong here when they exercise stable language rules. The validation-status test checks i18next's zero, one, and other plural resources for both initial locales, so a future wording change cannot quietly reintroduce “issue(s)” style copy.

The GitHub Actions web job repeats the production build and one-time Vitest run on Linux after a clean install. It gives pull requests a repeatable check of the M8.1 foundation, but it does not open a browser or replace the forwarded-port visual smoke check.

## Try it

Run the test command. Add no test merely to increase a count; propose a test when a new editor-state rule could regress without it.

## You are ready when

- You can run the editor tests once and in watch mode.
- You can choose whether a proposed rule belongs in a unit test or a browser check.
- You can explain why a test must exercise a meaningful boundary, not just a framework import.

[← Previous: container visual checks](03-container-visual-checks.md) · [Course outline](../README.md) · [Next: document-state path →](05-document-state-path.md)
