# TE-005 - Variable and secret resolution

**Status:** Proposed
**Priority:** Must
**Related stories:** [ATR-016](../epics/E02-execution-engine/stories/ATR-016.md), [ATR-017](../epics/E02-execution-engine/stories/ATR-017.md)

## Objective

Implement fixed localized input definitions, scope/data-set selection, effective environment preflight, and safe redaction in small slices. The accepted contract is in the related stories; the proposed PR sequence is in [M5](../../Work%20Plan/M5-data-and-reuse-semantics.md#incremental-pr-sequence).

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

Current runner-core exposes original raw scan results and does not implement this redaction contract. Pure schema/resolver slices must not be described as enabling safe secret execution. Implement and verify evidence projection before integrating protected preflight and retained output. Necessary raw values stay private to execution.

## Remaining contract design

Review exact allowed fields, metadata/name syntax, complete data-set/CLI precedence, and safe redacted evidence formats. Canonical exact locale matching with default fallback is a recommendation aligned with assertions, not an independently accepted questionnaire answer. No further questionnaire answer is pending; review proposals in the contract draft.
