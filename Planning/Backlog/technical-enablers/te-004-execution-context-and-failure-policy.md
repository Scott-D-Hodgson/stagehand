# TE-004 — Execution context and failure policy

**Status:** Proposed  
**Priority:** Must  
**Related stories:** ATR-009, ATR-010, ATR-012, ATR-018

## Objective

Implement current case and step tracking, using the case ID and zero-based step index, alongside hard/soft assertions, recoverable failures, and runner-level error classification.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

The initial M6 policy is: hard assertions stop their current case while independent cases continue unless continuation is unsafe; configured accessibility findings fail a case but do not stop its remaining eligible steps; run precedence is `error`, then `cancelled`, then `failed`, then `passed`. Begin sequentially and defer concurrency. A future run coordinator receives cancellation through an `AbortSignal`; CLI interrupt handling is later work.

Refine this enabler into smaller tasks if implementation reveals independent workstreams.
