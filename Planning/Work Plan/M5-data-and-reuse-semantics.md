# M5 — Variables, data sets, shared steps, and protected values

**Status:** Complete
**Original estimate:** 3–5 person-days (not actual effort)
**Depends on:** M3, M4

## Objective

Implemented fixed localized inputs, data-set selection, one-level shared steps, and caller-supplied protected-value resolution with tested redaction boundaries.

## Tasks completed

- Extended schemas for scalar variable definitions and whole-field references in supported action/assertion inputs.
- Implemented scope selection, locale fallback, detached step/case preparation, consuming-field conversion, and validation.
- Implemented named data-set selection and shared-step expansion with caller and inner-step diagnostic identity.
- Implemented effective-only environment-reference resolution from an injected map and protected-value handling for returned diagnostics and assertion/axe evidence.

## Decisions made

- Used text, number, and boolean values; whole-field references replace interpolation. Ordinary strings remain literal.
- Selected step > data set > case > plan precedence, replacing whole definitions before locale/default selection.
- Kept data-set selection per case, values fixed during execution, and shared groups one level deep with the calling case's context.
- Resolved only effective environment references; present empty values count as supplied. Kept necessary execution values private and applied redaction at exposed boundaries.
- Extended evolving v1 contracts deliberately; did not silently introduce a released-format migration.

## Deferred work

- Direct process-environment lookup, CLI overrides, and production plan-file orchestration remain Phase 3 work. M6 subsequently completed sequential coordination and in-memory result production.
- Loops remain beyond MVP under [ATR-018](../Backlog/epics/E02-execution-engine/stories/ATR-018.md); lists/objects, interpolation, reference chains, capture/reassignment, run-wide data selection, and direct secret stores are excluded.
- Editor authoring belongs to [M12](M12-variables-data-sets-and-shared-steps.md). Real Chromium/axe redaction assessment awaits the project test site.

## Completion evidence

- Schemas and synthetic fixtures cover accepted definitions and reject unsupported forms; preparation checks cover precedence, locales, data sets, missing inputs, and case isolation.
- Shared-step fixtures demonstrate ordering, caller/inner identity, and nested-call rejection; protected-value fixtures cover effective-only lookup and retained evidence under the tested contract.
- M5 is recorded complete for these slices. M7's owner-reported clean development-container baseline later passed the expanded 297 checks; no real-browser secret-safety guarantee follows from doubles.

## Learning plan reference

[Variables and data sets](../../Learning%20Plan/Phase%201/Lessons/10-variables-data-sets.md), [shared steps](../../Learning%20Plan/Phase%201/Lessons/11-shared-steps.md), and [result redaction](../../Learning%20Plan/Packages/result-model/Lessons/06-redaction-foundation.md).

## Supporting detail

### Accepted contract summary

| Area | Accepted rule |
| --- | --- |
| Values | Text, numbers, or booleans. Each variable has a required default and optional locale variants, all of the same resolved scalar type. Environment references supply text. No list or arbitrary nested-object values. |
| References | Whole-field {"var":"name"} objects in action inputs and assertion expected values. Definitions contain scalar/default/locale metadata or protected {"env":"NAME"} values, not references to other variables. Ordinary strings remain literal. |
| Names | Variable, data-set, and shared-step IDs are case-sensitive. Locale tags are a separate matching concern. |
| Scope | Step overrides selected data-set values, which override case values, which override plan values. A winning definition replaces the entire inherited definition, including its locale map. Then select locale/default and convert for the consuming field. CLI overrides remain deferred. |
| Data sets | A case `dataSets` object has a `default` base set and may contribute named sets to the plan collection. Select per case; an explicit named set layers its definitions over the base. Unknown selected names and duplicate named keys across cases fail before browser startup. |
| Resolution | Validate document structure throughout. Resolve environment values only for effective inputs after scope/data-set/locale selection. Unselected/overridden environment references need not exist. Missing required effective inputs fail before browser startup; present empty environment values count as supplied. |
| Lifetime | Values are fixed for execution; per-case overrides/selection cannot change another case. No page capture or reassignment. |
| Conversion | Convert numbers/booleans to text for text fields; preserve types elsewhere and validate the consuming field. Conversion does not permit mixed-type locale variants. |
| Shared steps | Stable IDs as `sharedSteps` object keys, calling-case variable context, no separate parameters/private defaults, and no calls from one shared step list to another. Preserve caller and inner-step traceability. |
| Protection | Tested caller-supplied protected-value redaction covers retained diagnostics and assertion/axe evidence. Necessary execution values remain private; this is not a real-browser secret-safety guarantee. |
