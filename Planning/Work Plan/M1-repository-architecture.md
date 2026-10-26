# M1 — Repository architecture and package boundaries

**Estimate:** 2–4 person-days  
**Depends on:** M0  
**Roadmap item:** Monorepo structure and package boundaries

## Tasks

- [x] Review [ADR-002](../Backlog/decisions/ADR-002-local-first-editor.md) and [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md); confirm the recorded decisions and package-structure direction.
- [x] Review the [component dependency graph](../Diagrams/M1-component-dependency-graph.md) and confirm it as the current design to work towards, including the agreed result-model-to-JSON flow with optional later format converters.
- [x] Finalize and document the initial workspace layout, package responsibilities, public entry-point convention, and allowed dependency directions in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) and the proposed repository footprint.
- [x] Select npm as the workspace/package manager.
- [x] Define lockstep versioning and baseline version conventions in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md), including the pre-release rule for breaking changes.
- [x] Add the initial npm workspace configuration and package manifests; note the future source entry files and public-entry checks in each workspace without implementing them.
- [x] Record the architecture decision in [ADR-004](../Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md) and update the proposed repository footprint.

## Completion evidence

- The developer reviewed and confirmed [ADR-002](../Backlog/decisions/ADR-002-local-first-editor.md), [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md), and the component dependency graph as the current direction on 2026-10-22.
- npm is selected; the separate-package direction, shared-contract independence, browser-compatible schema package, one documented public entry point per package, and lean-design principle are recorded in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) and the proposed repository footprint. Reporters are included provisionally. The Vue editor is an app workspace package under `apps/web`, not a separate editor-components library.
- At M1 completion, the initial package responsibilities, dependency rules, and public entry-point convention were documented in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md), while package-specific `exports` declarations remained future work. The plan-schema package has since added its public entry point and `exports` declaration.
- Lockstep versioning for reusable packages, CLI, and web editor, the `MAJOR.MINOR.PATCH` meanings, pre-1.0 status until the first release candidate, and the rule that pre-RC breaking changes increment the minor number are recorded in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).
- At M1 completion, the root npm workspace manifest and lockfile plus per-workspace manifests and implementation notes were present; source entry files and public-entry checks were left for later incremental implementation. Since then, the plan-schema package has gained its initial JSON Schemas, TypeScript entry point, `exports`, build target, synchronous validation helpers, and public-entry tests.
- The initial workspace and package-boundary decision is recorded in [ADR-004](../Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md), and the proposed repository footprint distinguishes the created scaffolds from unimplemented paths.
- A reviewed architecture diagram and package responsibility list.
- Workspace/package skeleton can be resolved by the chosen package manager.
- No source-level contract dependencies exist to inspect at scaffold stage; [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md) records the rule that shared contracts remain independent of applications, runner core, and Playwright.
- Architecture choice and known tradeoffs are recorded.

## Learning reference

[Monorepo structure and package boundaries](../../Learning%20Plan/Phase%201/01-monorepo-structure-and-package-boundaries.md)
