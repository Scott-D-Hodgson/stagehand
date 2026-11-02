# Lesson 13: Phase integration review

> “How do we know the Phase 1 pieces form one coherent foundation rather than separate demos?” — Iris “Integration Inspector” Ingram, Developer

Integration review follows data across boundaries: authored JSON → validation → safe loading → preparation → browser dispatch → observations → result shape. Each hand-off must preserve identity, errors, and documented scope.

```mermaid
flowchart LR
    A[Plan and cases] --> V[Validate and load]
    V --> P[Prepare inputs]
    P --> E[Execute steps]
    E --> O[Collect observations]
    O --> R[Future complete result]
```

Several pieces remain planned: full orchestration before browser startup, CLI protected-value boundaries, result production, and M6 policy. `executeCase` can use a caller-supplied protected-value map and redact returned soft failures and retained automatic accessibility evidence, without reading `process.env`; a direct scan can redact values its caller supplies. Shared steps now expand and execute at the case-session boundary, but that is not yet full result traceability. A coherent foundation states these gaps plainly.

## Try it

Trace one case through the diagram and name the package responsible at each hand-off.

## You are ready when

- You can explain the complete intended flow and current gaps.
- You can spot a responsibility placed in the wrong package.
