# ADR-003 — Versioned test-plan contract

**Status:** Accepted

## Context

The CLI, execution library, Vue editor, integrations, and examples need a shared definition of valid plans. Plan features will evolve over time.

## Decision

Every plan declares a schema version. The plan contract is a shared, version-controlled JSON Schema document in the monorepo, consumed by both the Vue editor and CLI runner so they validate against the same definition. Unsupported versions are rejected, and future migrations are explicit rather than silent.

## Consequences

- Changes to plan syntax require schema and fixture updates.
- The Vue editor and CLI runner must validate against the same versioned plan JSON Schema document; runtime-specific validation code may add semantic checks but must not contradict the shared schema.
- The editor and runner must clearly report unsupported versions.
- Result output has a separate versioned contract.
- Example plans are validated in CI.
