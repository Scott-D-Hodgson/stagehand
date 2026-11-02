# TE-006 — Shared-step engine

**Status:** Proposed  
**Priority:** Must  
**Related stories:** [ATR-015](../epics/E02-execution-engine/stories/ATR-015.md); [ATR-018](../epics/E02-execution-engine/stories/ATR-018.md) is deferred beyond MVP

## Objective

Implement one-level reusable step groups using the calling case's variable context, reference validation, and traceable results. Shared groups have no separate parameters or variable defaults. Loop execution is deferred under [ATR-018](../epics/E02-execution-engine/stories/ATR-018.md) and is not an MVP prerequisite.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

The shared-step document contract, pure expansion/preflight, and case-session execution are implemented: plans may declare stable group IDs and cases may call them; duplicate IDs, unknown calls, nested calls, and private group-step variables are rejected. Expanded steps retain call-site and inner-step identity, resolve values through the calling case/data-set context, and dispatch in order. Preparation errors, hard step errors, and soft assertion failures retain that identity. Result aggregation/serialization and protected-value handling remain separate workstreams.
