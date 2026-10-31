# Package learning plans

These guides focus on the implementation inside an individual Stagehand package. They complement the phase lessons: use the phase lessons for cross-cutting concepts and milestone context, and use a package guide to understand its source files, public API, and checks.

## Packages

- [Plan schema](plan-schema/README.md) - versioned plan and case schemas, synchronous validation helpers, Ajv, and the package's tests.
- [Plan engine](plan-engine/README.md) - Node-side plan and case file loading, link containment, shared validation, and loader tests.
- [Result model](result-model/README.md) - the normative result schema, TypeScript API, runtime validation, and public-entry tests.
- [Runner core](runner-core/README.md) - Chromium run lifecycle, effective browser settings, isolated case sessions, navigation, locator resolution, direct clicks, ordered waits, and cleanup.

Add a package guide when that package has implementation worth teaching. Keep the guide scoped to what exists today and label planned behaviour as future work.
