# TE-005 - Variable and secret resolution

**Status:** Proposed
**Priority:** Must
**Related stories:** [ATR-016](../epics/E02-execution-engine/stories/ATR-016.md), [ATR-017](../epics/E02-execution-engine/stories/ATR-017.md)

## Objective

Implement fixed localized input definitions, scope/data-set selection, effective environment preflight, and safe redaction in small slices. The accepted contract is in the related stories; the completed implementation summary and remaining scope are in [M5](../../Work%20Plan/M5-data-and-reuse-semantics.md).

## Acceptance criteria

- Require defaults with optional same-type locale variants; support whole-field variable references and protected environment-reference values.
- Resolve case-sensitive scope/data-set inputs with whole-definition replacement and isolated fixed case contexts.
- Convert number/boolean inputs only for text fields; validate other consuming fields with types preserved.
- Reject unknown selected sets, duplicate names, and missing effective references before browser startup.
- Resolve only effective environment references after overrides and locale selection; accept present empty values and do not require unused branches.
- Preserve protected-value metadata through execution and conversion; redact logs/errors/reports and retained/exposed assertion/axe evidence.
- Document and verify safe representations that preserve result formats and do not expose original raw references through public retained evidence.
- Add focused tests and implementation evidence per slice without adding loops, chains, interpolation, mutation, or out-of-scope reference locations.

## Current gap and sequencing

`result-model` provides a pure `redactEvidence` helper, plan-schema can look up an already-selected protected name from a caller-supplied map, and protected `executeCase` calls redact returned soft failures plus retained accessibility findings/scan history. A direct scan can redact values explicitly supplied by its caller. General runner APIs remain not secret-safe by default. Do not describe this as direct process-environment support or complete protected execution; integrate and verify remaining retained-output paths before broadening the API.

## Implementation approach

Keep the v1 contracts while M5 is in progress. Variable definitions/references, ordinary resolution, pure per-case data-set selection, case-session runner hand-off, shared-step execution, the pure evidence-redaction foundation, and injected-map protected-value lookup are implemented. Next integrate protected values at the runner boundary and retained-output boundary in focused PRs. Full orchestration must still move effective preflight ahead of browser startup. Define only the details needed by the active slice and record its tests and remaining limits.
