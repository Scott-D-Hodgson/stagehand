# TE-003 — Playwright browser lifecycle and factory

**Status:** In Progress
**Priority:** Must  
**Related stories:** ATR-003, ATR-008, ATR-013

## Objective

Implement Playwright browser selection, context settings, action handlers, lifecycle, and cleanup within the runner architecture. No separate adapter package is required while Playwright is the only supported browser automation library.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

The initial `runner-core` slice now starts one Chromium process per run, creates an isolated context and page per case, applies the agreed browser defaults and case viewport/time-zone overrides, and coordinates shutdown with in-flight case setup and concurrent close calls. Step handlers and the remaining execution behaviour are still outstanding. Refine this enabler into smaller tasks if implementation reveals independent workstreams.
