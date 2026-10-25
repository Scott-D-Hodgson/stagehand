# TE-007 — Common result model

**Status:** Proposed  
**Priority:** Must  
**Related stories:** ATR-020

## Objective

Define versioned result structures for tests, steps, assertions, accessibility findings, diagnostics, artifacts, and exact source provenance. The versioned result JSON Schema, owned alongside the result-model package, is the normative validation contract for emitted result JSON.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Emitted JSON validates against the result JSON Schema, and fixtures verify that the result-model package representation remains aligned with it.
- Results identify both the logical source plan and a deterministic, version-identified fingerprint of the exact plan/case contents used for the run. The fingerprint's inputs, encoding, framing, and path/order rules are explicit and produce the same value across supported OSes for the same inputs.
- Failure modes and security implications are addressed where relevant.

## Notes

Refine this enabler into smaller tasks if implementation reveals independent workstreams.
