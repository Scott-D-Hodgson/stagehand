# M5 — Variables, data sets, shared steps, and bounded loops

**Estimate:** 3–5 person-days  
**Depends on:** M3 and M4  
**Roadmap item:** Variable scopes, data sets, shared steps, and loop semantics

## Tasks

- [ ] Review [TE-005](../Backlog/technical-enablers/te-005-variable-and-secret-resolution.md), [TE-006](../Backlog/technical-enablers/te-006-shared-step-and-loop-engine.md), and relevant stories.
- [ ] Specify nested variable scopes: plan values flow into cases and steps; case values shadow plan values; step values shadow case values; CLI options override JSON values at their specified plan/case scope.
- [ ] Define data-set shape and selection/iteration behaviour. A case file may contribute a named data set to the plan-level collection and specify its default set; a run-time selection replaces that default for the execution, is imported into case variables, and wins over same-named case-default values. Specify duplicate/unknown-name behaviour, runtime selection scope, and how case/data identity appears in results.
- [ ] Define shared-step identifiers, use of the calling case's variables (including imported named-set values), traceability in diagnostics, and validation rejecting a shared-step call from within another shared step. Shared steps do not have separate parameters or variable defaults.
- [ ] Define bounded loop syntax; default the iteration limit to 10 and allow plan/case overrides. Specify behaviour when the limit is reached. A hard assertion failure in a loop immediately stops the case and exits the loop.
- [ ] Specify environment-variable-only secret references for the initial release, fail missing required references before browser startup, and define redaction expectations. Track secret-store integrations as future work.
- [ ] Extend the schema, fixtures, and examples with synthetic data; ensure no arbitrary executable JavaScript is introduced.
- [ ] Note that case selection by ID is listed as Later in ATR-006 and avoid silently pulling it into MVP scope.

## Completion evidence

- Authors can predict where each variable is available and when it is discarded.
- Data cases and shared-step calls remain identifiable in diagnostics/results.
- All repetition is bounded, with a defined maximum and clear failure behaviour.
- Shared-step groups are one level deep; a shared-step cannot call another shared-step.
- Secret references are external and the contract rules out emitting their resolved values.

## Learning reference

[Variable scopes, data sets, shared steps, and loop semantics](../../Learning%20Plan/Phase%201/05-variables-data-sets-shared-steps-and-loops.md)
