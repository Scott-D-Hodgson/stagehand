# M5 - Variables, data sets, shared steps, and protected values

**Estimate:** 3-5 person-days
**Depends on:** M3 and M4
**Status:** Complete for the current M5 slices: variable/data-set/shared-step contracts and preparation, caller-supplied protected-value execution, and tested redaction boundaries are implemented. End-to-end plan-run orchestration, direct process-environment/CLI integration, and result production are deferred to later work.

## Objective

Define and implement predictable fixed inputs and one-level shared steps. M3 remains complete; these later contract extensions belong to M5. CLI/editor behaviour and M6 case/run outcome aggregation are not bundled into these slices.

## Accepted MVP contract

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
| Protection | Redact logs/errors/reports and retained/exposed assertion and axe evidence, including markup, URLs, selectors, summaries, related nodes, and retained scan records. Necessary unredacted execution values remain private. Current raw-history APIs do not meet this requirement. |

These are accepted design requirements, not current schema/resolver or secret-safety guarantees. The stories [ATR-016](../Backlog/epics/E02-execution-engine/stories/ATR-016.md), [ATR-017](../Backlog/epics/E02-execution-engine/stories/ATR-017.md), and [ATR-015](../Backlog/epics/E02-execution-engine/stories/ATR-015.md) provide the requirements; [TE-005](../Backlog/technical-enablers/te-005-variable-and-secret-resolution.md) and [TE-006](../Backlog/technical-enablers/te-006-shared-step-and-loop-engine.md) track implementation.

## Deferred scope

Loops are deferred beyond MVP because the intended workflows do not normally need them. [ATR-018](../Backlog/epics/E02-execution-engine/stories/ATR-018.md) retains the earlier bounds/exit proposal as a future candidate, not an MVP commitment. Loop execution, authoring controls, CLI limits, and iteration reporting are excluded.

Also defer lists/nested-object values, interpolation, run-wide data-set selection, page capture/reassignment, reference chains, locator/browser/run-setting references, and direct secret-store integrations. Case selection by ID remains Later under [ATR-006](../Backlog/epics/E01-plan-definition/stories/ATR-006.md); selecting data for a case does not add case filtering.

## Versioning and implementation approach

M5 extends the existing v1 plan, case, and result contracts. Their `version` fields remain `1` while the milestone is in progress; they are evolving project artifacts, not frozen releases. A milestone release can make a deliberate versioning decision once the complete contract is known. Do not claim that a planned field is currently supported until its schema, runtime behaviour, and focused tests are in place.

Build one small, observable capability at a time. Each PR should state what it adds, what remains unsupported, and the focused checks that cover it. Details that become necessary during a slice should be decided narrowly in that PR rather than pre-designed for all of M5.

## Incremental PR sequence

This is a proposed implementation sequence for small reviewable slices, not completed work or a commitment to combine features. Every code slice includes focused public-contract tests and its own documentation/evidence. Split a slice further if review size warrants it.

| Slice | Purpose and boundary |
| --- | --- |
| 1. Variable schema foundation | Implemented: v1 plan/case schemas now validate named variables with required scalar defaults and optional same-type locale variants. Focused valid/invalid tests cover shapes and locale keys; resolution and execution remain unsupported. |
| 1a. Step-variable schema foundation | Implemented: ordinary v1 case steps now accept the same variable-definition shape, including locale-key checks. Definitions remain unresolved. |
| 2. Variable references | Implemented: v1 case schema support for whole-field `{ "var": "name" }` references in `navigate.url`, interaction inputs, and assertion expected/associated-label values. Locators, waits, and settings remain literal; variables remain unresolved at runtime. |
| 3. Ordinary variable resolution | Implemented at the case-session boundary: `resolveVariable` selects an ordinary scalar from step, case, or plan scope, replaces whole definitions, selects locale/default values, preserves types, and reports missing names. `prepareCaseStep` creates detached steps, and `prepareCase` prepares every step, reports the first missing-reference field, and validates the detached case. Runner-core `executeCase` prepares before dispatching any case step and reports preparation failures without dispatching a step. Its browser-free `prepareRunForExecution` helper can prepare a caller-supplied list of cases before browser startup, but full plan orchestration remains later work. |
| 4. Named data sets | Partially implemented: v1 case `dataSets` use `default` as a base set, with optional named sets that layer their values over it. Bundle validation rejects duplicate named keys across cases. `selectCaseDataSet` returns the base set or layers an explicit per-case selection from a supplied bundle collection, rejecting an unknown name before browser work. `runner-core` accepts that collection and selection at its case-session `executeCase` boundary. Step definitions remain narrower than selected data-set definitions, which override case definitions. No run-wide selection or iteration. |
| 5. Shared-step validation and execution | Partially implemented: plans may declare stable `sharedSteps`; cases call them with `{ "action": "sharedSteps", "id": "..." }`. Validation rejects unknown calls, nested calls, and private shared-step variable definitions. `expandCaseSharedSteps` produces detached ordinary steps with call-site and inner-step identity; `prepareCaseSharedSteps` resolves them with the calling case/data-set context and validates the expanded case. Runner-core now dispatches the expanded steps and preserves shared-step identity on preparation and execution failures. Result aggregation/serialization remain later work. |
| 6. Protected environment values and safe evidence | Partially implemented: text variable definitions accept `{ "env": "NAME" }` references. Schema selection preserves the marker, and an injected map resolves only selected names; an own empty value is supplied, while missing/inherited-only names fail. `runner-core` passes resolved values to `executeCase` actions and redacts returned soft failures plus accessibility findings/scan history; hard execution errors use a redacted cause. Direct `scanAccessibility(protectedValues)` redacts returned results and scan errors when callers supply protected values. It does not read `process.env`, and full pre-browser-startup orchestration, CLI support, and result production remain later work. |
| 7. M5 verification and close-out | Run applicable package checks and current CI, reconcile contracts/examples/learning, review retained evidence, and record what is verified. Keep deferred Chromium/axe tests and M6 policy separate. |

## Completion evidence

- Schemas and synthetic fixtures define accepted values/references and reject unsupported constructs.
- Resolution/preflight tests demonstrate precedence, locale replacement/selection, case isolation, effective-only environment access, empty/missing handling, and conversion before browser startup.
- Shared calls preserve ordering and caller/inner-step identity; nested calls fail validation.
- Retained/exposed diagnostics and assertion/axe evidence do not disclose resolved protected values under the agreed tested redaction contract.
- Applicable package checks and current CI results are recorded; documentation distinguishes implemented, verified, proposed, and deferred work.
- Deferred actual Chromium/axe testing remains tied to the project test-site prerequisite; no M5 test claim substitutes for it.

## Learning reference

[Variables and data sets](../../Learning%20Plan/Phase%201/Lessons/10-variables-data-sets.md), [shared steps](../../Learning%20Plan/Phase%201/Lessons/11-shared-steps.md), and [the result-model redaction foundation](../../Learning%20Plan/Packages/result-model/Lessons/06-redaction-foundation.md)
