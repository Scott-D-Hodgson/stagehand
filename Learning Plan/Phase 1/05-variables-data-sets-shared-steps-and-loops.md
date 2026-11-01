# 5. Variable scopes, data sets, shared steps, and protected values

## Self-assessment: do I need this lesson?

- [ ] I can distinguish a definition, a resolved value, and a reference.
- [ ] I can resolve scope overrides before selecting a locale without merging inherited variants.
- [ ] I can explain named data selection without implying automatic iteration.
- [ ] I can distinguish an absent environment value from a present empty value.
- [ ] I can identify secret disclosure in retained assertion and axe evidence.

## What you will learn

How the accepted M5 design makes fixed inputs reusable across cases and locales, and how to review its implementation in small PRs. The first M5 slice validates variable-definition shapes in the v1 schemas; references, resolution, data sets, shared steps, and protected values are still future work.

## Core ideas

A variable definition describes a named, case-sensitive input. Its default is required; locale variants are optional. Values are text, numbers, or booleans, with one resolved scalar type across all variants. The v1 schemas now validate this default/locales wrapper and reject empty names. A protected {"env":"NAME"} value names a process environment variable and resolves to text, but is a later M5 slice.

A whole-field {"var":"name"} reference supplies an action input or assertion expected value. Ordinary text such as "${name}" stays literal. Locator and browser/run-setting references, reference chains, page capture, reassignment, interpolation, and lists are deferred. Names are case-sensitive.

Scope is like choosing the most specific instruction sheet: step overrides case, case overrides plan. CLI overrides JSON at its targeted scope. The winning definition replaces the whole inherited definition, including its locale map; then select locale/default, resolve any selected environment value, and convert for the consuming field. Numbers/booleans become text in text fields; other types remain intact.

The accepted replacement rule is separate from the still-proposed locale algorithm. The recommendation is to match canonical locale tags exactly, reject duplicate canonical keys, and fall back to default, following existing assertions. Do not invent prefix fallback or merge rules in an implementation.

Named data sets select inputs for a case; absent runtime selection uses its default, while an explicit unknown selection fails. Selected definitions override same-named case defaults. Cases may contribute sets to the plan collection; duplicate names are errors. Reuse in separate executions does not require a loop. Loops and their editor/CLI/reporting features are deferred beyond MVP under [ATR-018](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-018.md).

A shared group is a reusable sequence, like a scene used by several cases. It reads the calling case context and has no parameters/private defaults. Shared groups cannot call other groups. Results must retain caller and inner-step identity; the exact contract is still to be drafted.

## Effective inputs and protected evidence

Validate structure everywhere, but resolve environment values only for effective scope/data-set/locale inputs before browser startup. A missing environment value in an unselected set or overridden definition does not block a run. A missing required effective value does. Empty text is a valid supplied value, including for negative tests. Inputs are fixed during execution; scope overrides are not runtime assignments.

Redaction must cover logs, errors, reports, retained assertion values, axe markup/URLs/selectors/summaries/related nodes, and exposed retained scan records. Existing runner-core raw-history references do not provide that protection. Copying an observation is not sanitization. Protected execution must not be enabled until safe projection and end-to-end retention paths are verified.

## Exercise

Create two synthetic cases and one shared group. Give a plan variable a default and fr-CA variant, then override it in one case with only a default. Using the proposed exact-match algorithm, explain why that case does not inherit the plan variant. Show that the other case remains unchanged.

Add a named set selected only for the first case, an unselected set containing a missing environment reference, an overridden environment reference, and a selected present-but-empty environment value. Draw the effective definitions and identify which environment names are looked up. Add an unknown selected set, duplicate name, and missing effective reference; each must fail before any browser starts.

Show 3 becoming "3" for an assertion text field, while its numeric definition remains numeric. Reject a boolean locale variant under a numeric default before reading environment values. Use [the synthetic story example](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-016.md#synthetic-design-example) as a starting point, not as a current executable fixture.

Finally, put a synthetic protected marker into assertion diagnostics and axe HTML/URL/selector evidence. Identify private execution data versus retained/exposed output and explain why original raw references cannot bypass redaction. Do not use real secrets or claim this paper exercise verifies redaction.

## You are ready when

- You can predict scope, locale selection, and conversion without relying on mutable state.
- You can distinguish omitted selection/default fallback from an explicitly unknown name.
- You can explain why structural validation does not require resolving unused environment values.
- You can trace shared caller/inner-step identity without introducing nested calls or loops.
- You can explain why protected execution depends on safe retained evidence, not merely environment lookup.

## Incremental implementation practice

Follow the [M5 PR sequence](../../Planning/Work%20Plan/M5-data-and-reuse-semantics.md#incremental-pr-sequence): draft contracts, add schemas, resolve ordinary inputs, select data sets, validate/expand shared groups, protect evidence, resolve effective environment inputs, integrate ordinary then protected execution, and close with verification. Each slice should teach and verify one responsibility. A schema-only PR does not ship resolution; an environment resolver does not establish secret-safe execution.

## References

- [M5 work plan](../../Planning/Work%20Plan/M5-data-and-reuse-semantics.md)
- [ATR-016: variable contract](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-016.md)
- [ATR-017: protected inputs](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-017.md)
- [ATR-015: shared groups](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-015.md)
- [TE-005: variable and secret resolution](../../Planning/Backlog/technical-enablers/te-005-variable-and-secret-resolution.md)
- [TE-006: shared-step engine](../../Planning/Backlog/technical-enablers/te-006-shared-step-and-loop-engine.md)
- [Current assertion locale implementation](../../packages/runner-core/src/assertions.ts)

## Reinforcement quiz

1. Does a narrower definition inherit locale variants it omits?
2. What are {"var":"name"} and {"env":"NAME"} used for?
3. Must an unselected data set's environment references exist?
4. Is empty environment text missing?
5. Does converting a value to text allow mixed scalar types across variants?
6. Does selecting a named data set execute a loop?
7. Why must redaction precede protected execution integration?
8. Which details remain proposals rather than accepted or implemented behaviour?

<details>
<summary>Answer key</summary>

1. No. Replace the whole definition, then select locale/default from the winner.
2. The first supplies a whole-field action/assertion value; the second names a protected environment value in a definition.
3. No. Validate its structure but resolve environment values only for effective inputs.
4. No. Present empty text is supplied; an absent required effective value fails before startup.
5. No. All variants share one resolved scalar type; field conversion follows selection.
6. No. Loop execution is deferred beyond MVP.
7. Diagnostics and retained assertion/axe observations could otherwise disclose resolved values through existing raw-history paths.
8. M5 is built in small slices. The first slice adds only variable-definition schema support and focused tests; references, resolution, data sets, shared steps, and protected values remain later work. No M5 schema or resolver implementation is claimed yet.

</details>

## Incremental practice

Start with a small schema-only change: add a named variable with a required scalar default and, optionally, locale variants of the same type. Write one valid example and focused invalid examples. Do not add reference resolution, data sets, shared steps, or environment lookup in that PR.

M5 keeps the v1 contracts while the milestone is in progress. Each later PR should add one capability, explain its limits, and verify that capability before moving on.
