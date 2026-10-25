# TE-002 — Reusable Node.js/TypeScript package structure

**Status:** Proposed  
**Priority:** Must  
**Related stories:** ATR-007, ATR-008

## Objective

Define workspace and package boundaries for runner core (which uses Playwright directly), schema, plan engine, result model, reporters, and CLI.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

Refine this enabler into smaller tasks if implementation reveals independent workstreams.

## Current M1 direction

- Use npm for the workspace and package management.
- Keep separate reusable packages for the plan schema, plan engine, runner core, and result model. Include a reporters package provisionally; revisit it only if implementation shows that a separate package is unnecessary.
- Treat the Vue editor in `apps/web` as an npm workspace package/application. Do not add a separate editor-components library unless a concrete reuse need appears.
- The plan schema owns plan structure and validation and should work in both Node.js and the browser. The plan engine interprets valid plans without pulling execution logic into the schema package.
- The runner core owns test execution and uses Playwright directly. The CLI owns command-line input/output and calls the runner core.
- The result model owns the common result contract. Reporters format that result into the output selected by the CLI; JSON is the initial format.
- Keep shared contracts independent of applications, the runner core, and Playwright.
- Give each package one documented public entry point initially; add named subpaths only when a concrete need arises. At scaffold stage, workspace manifests record package identity and version only. Add the supported entry point to each package's `package.json` `exports` field, alongside its source entry file and entry-point check, in that package's implementation change. The plan-schema package has now added its initial schema exports and build; its validation API and public-entry check remain outstanding.
- Keep the initial design lean. Accept refactoring when implementation reveals a need rather than adding structure in anticipation of hypothetical needs.
- Use TypeScript by default for new implementation code. Keep schema documents and synthetic plan/case examples as JSON data. The root workspace now has a shared strict TypeScript configuration; the plan-schema package is the first implementation using it.

Initial dependency rules: the plan engine may depend on the plan schema; the runner core may depend on the plan engine and result model; reporters may depend on the result model; the CLI may compose the runner core and reporters; and the web editor may depend on the plan schema. The plan schema and result model do not depend on apps, runner core, or Playwright. Avoid circular dependencies. Refine these rules only when implementation needs a justified change.

## Versioning direction

- Version the reusable packages, CLI, and web editor in lockstep as one Stagehand product.
- Use the `MAJOR.MINOR.PATCH` pattern: major for breaking changes, minor for backward-compatible additions, and patch for backward-compatible fixes.
- Keep the product pre-1.0 until the first release candidate.
- Before the first release candidate, breaking changes may increment the minor number while the major number remains `0`. Starting with the first release candidate, use major for breaking changes, minor for backward-compatible additions, and patch for backward-compatible fixes.
