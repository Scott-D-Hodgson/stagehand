# ADR-001 — Use a monorepo

**Status:** Accepted

## Context

Stagehand includes a reusable Node.js/TypeScript runner, CLI, local-first Vue SPA, shared schemas, reporters, Markdown documentation, Hugo website, development container, and agent guidance. These components will frequently need coordinated changes while contracts are evolving.

## Decision

Use one Git monorepo initially. Organise components as separate packages/apps with explicit boundaries and allow separate CI jobs and release artifacts. Revisit repository splitting only if team ownership, access control, or independent release requirements justify it.

## Alternatives considered

### Multiple repositories

Advantages include independent permissions and release workflows. Disadvantages include coordination overhead, cross-repository contract/version management, and risk of documentation/schema drift.

## Consequences

- Cross-component changes can be reviewed in one pull request.
- CI should support component-aware workflows and avoid unnecessary full builds where safe.
- Shared contracts require explicit versioning even inside a monorepo.
- The decision can be revisited when independent teams or release cycles emerge.
