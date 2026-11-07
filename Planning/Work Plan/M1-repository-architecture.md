# M1 — Repository architecture and package boundaries

**Status:** Complete
**Original estimate:** 2–4 person-days (not actual effort)
**Depends on:** M0

## Objective

Established the initial workspace structure, package responsibilities, and dependency direction without implementing the future applications.

## Tasks completed

- Reviewed the local-first architecture and component dependency graph.
- Selected npm and created the root workspace manifest, lockfile, per-workspace manifests, and implementation notes.
- Recorded package boundaries, public-entry conventions, versioning rules, and the distinction between actual scaffolds and proposed paths.

## Decisions made

- Accepted [ADR-004](../Backlog/decisions/ADR-004-initial-workspace-and-package-boundaries.md) and the responsibilities in [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).
- Kept shared contracts independent of applications, runner-core, and Playwright, with a browser-compatible schema package and one public entry point per package.
- Used lockstep versioning; before the first release candidate, breaking changes may increment the minor version. Kept reporters provisional and the editor in `apps/web`, without a separate component library.

## Deferred work

- Source entries, exports, and executable boundary checks were left to the implementation milestones; M3–M7 subsequently supplied these for implemented packages.
- Application behaviour remains assigned to later phases; proposed repository paths do not establish implemented packages.

## Completion evidence

- The owner confirmed the architecture direction and dependency graph on 2026-10-22.
- The workspace skeleton and lockfile were present and resolvable; the decision record and [repository footprint](../Repository/structure.md) documented the boundaries.
- M7 later verified implemented package boundaries; this later evidence does not change M1's scaffold-stage scope.

## Learning plan reference

[Package architecture](../../Learning%20Plan/Phase%201/Lessons/02-package-architecture.md).
