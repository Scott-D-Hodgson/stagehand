# Lesson 2: Browser-safe shared contracts

> “How can a browser form follow the same rules as the runner?” — Casey “Contract” Moore, Developer

[← Previous: application foundation](01-application-foundation.md) · [Course outline](../README.md) · [Next: container visual checks →](03-container-visual-checks.md)

The editor must not recreate plan rules in a second, slightly different form. Instead it imports `validatePlan` through the public `@stagehand/plan-schema` entry point. The small `validateEditorPlan` boundary makes that use explicit and gives future editor state one place to request shared validation.

This is browser-safe because it uses validation rules, not Node-only file loading. `@stagehand/plan-engine` owns filesystem containment and source fingerprints; the browser editor must not import it merely to validate values.

```mermaid
flowchart LR
  E[Vue editor state] --> V[validateEditorPlan]
  V --> S[@stagehand/plan-schema public entry]
  S --> R[Validation result]
  R --> E
```

The validation result says whether a value follows the shared contract. It does not make an incomplete editor draft safe to export, save it to IndexedDB, or decide how a field should display an error. Those are later editor concerns.

## Try it

Read `apps/web/src/document/validation.ts` and its test. Change a copied sample in your head so it lacks `cases`; identify the expected result before reading the assertion.

## You are ready when

- You can explain why validation is imported through a package public entry.
- You can distinguish browser validation from Node-side file loading.
- You can identify where future UI-specific validation presentation belongs.

[← Previous: application foundation](01-application-foundation.md) · [Course outline](../README.md) · [Next: container visual checks →](03-container-visual-checks.md)
