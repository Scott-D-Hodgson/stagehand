# M1 — Repository architecture and package boundaries

**Estimate:** 2–4 person-days  
**Depends on:** M0  
**Roadmap item:** Monorepo structure and package boundaries

## Tasks

- [ ] Review [ADR-001](../Backlog/decisions/ADR-001-monorepo.md) and [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md); confirm the monorepo choice remains suitable.
- [ ] Draw the dependency graph for the schema, plan engine, runner core, Playwright adapter, CLI, editor, result model, reporters, and docs.
- [ ] Define the initial workspace layout, package responsibilities, public entry points, and allowed dependency directions.
- [ ] Decide workspace/package manager and baseline versioning conventions; document the reasons and any unresolved decisions.
- [ ] Add minimal workspace configuration and package skeletons only where needed to validate the boundaries.
- [ ] Record the architecture decision and update the proposed repository footprint.

## Completion evidence

- A reviewed architecture diagram and package responsibility list.
- Workspace/package skeleton can be resolved by the chosen package manager.
- No low-level shared contract depends on an application package.
- Architecture choice and known tradeoffs are recorded.

## Learning reference

[Monorepo structure and package boundaries](../../Learning%20Plan/Phase%201/01-monorepo-structure-and-package-boundaries.md)
