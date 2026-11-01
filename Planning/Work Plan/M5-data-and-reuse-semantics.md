# M5 - Variables, data sets, shared steps, and protected values

**Estimate:** 3-5 person-days (original estimate; reassess after the detailed contract draft)
**Depends on:** M3 and M4
**Status:** Accepted scope recorded; detailed contract and implementation pending

## Objective

Define and implement predictable fixed inputs and one-level shared steps. M3 remains complete; these later contract extensions belong to M5. CLI/editor behaviour and M6 case/run outcome aggregation are not bundled into these slices.

## Accepted MVP contract

| Area | Accepted rule |
| --- | --- |
| Values | Text, numbers, or booleans. Each variable has a required default and optional locale variants, all of the same resolved scalar type. Environment references supply text. No list or arbitrary nested-object values. |
| References | Whole-field {"var":"name"} objects in action inputs and assertion expected values. Definitions contain scalar/default/locale metadata or protected {"env":"NAME"} values, not references to other variables. Ordinary strings remain literal. |
| Names | Variable, data-set, and shared-group names are case-sensitive. Locale tags are a separate matching concern. |
| Scope | Step overrides case, case overrides plan; CLI overrides JSON at its targeted plan/case scope. A winning definition replaces the entire inherited definition, including its locale map. Then select locale/default and convert for the consuming field. |
| Data sets | Cases may contribute named sets to the plan collection. Select per case; absent runtime selection uses the case default. Selected values override same-named case-default definitions. Unknown selected names and duplicate set names fail before browser startup. |
| Resolution | Validate document structure throughout. Resolve environment values only for effective inputs after scope/data-set/locale selection. Unselected/overridden environment references need not exist. Missing required effective inputs fail before browser startup; present empty environment values count as supplied. |
| Lifetime | Values are fixed for execution; per-case overrides/selection cannot change another case. No page capture or reassignment. |
| Conversion | Convert numbers/booleans to text for text fields; preserve types elsewhere and validate the consuming field. Conversion does not permit mixed-type locale variants. |
| Shared steps | Stable IDs, calling-case variable context, no separate parameters/private defaults, and no calls from one shared group to another. Preserve caller and inner-step traceability. |
| Protection | Redact logs/errors/reports and retained/exposed assertion and axe evidence, including markup, URLs, selectors, summaries, related nodes, and retained scan records. Necessary unredacted execution values remain private. Current raw-history APIs do not meet this requirement. |

These are accepted design requirements, not current schema/resolver or secret-safety guarantees. The stories [ATR-016](../Backlog/epics/E02-execution-engine/stories/ATR-016.md), [ATR-017](../Backlog/epics/E02-execution-engine/stories/ATR-017.md), and [ATR-015](../Backlog/epics/E02-execution-engine/stories/ATR-015.md) provide the requirements; [TE-005](../Backlog/technical-enablers/te-005-variable-and-secret-resolution.md) and [TE-006](../Backlog/technical-enablers/te-006-shared-step-and-loop-engine.md) track implementation.

## Deferred scope

Loops are deferred beyond MVP because the intended workflows do not normally need them. [ATR-018](../Backlog/epics/E02-execution-engine/stories/ATR-018.md) retains the earlier bounds/exit proposal as a future candidate, not an MVP commitment. Loop execution, authoring controls, CLI limits, and iteration reporting are excluded.

Also defer lists/nested-object values, interpolation, run-wide data-set selection, page capture/reassignment, reference chains, locator/browser/run-setting references, and direct secret-store integrations. Case selection by ID remains Later under [ATR-006](../Backlog/epics/E01-plan-definition/stories/ATR-006.md); selecting data for a case does not add case filtering.

## Contract details still to draft

- Review the exact allowed action/assertion fields and proposed default/locales wrapper, including associated-label expected values and interaction options.
- Recommendation for review: use exact canonical BCP 47 matching with default fallback and duplicate canonical-key rejection, consistent with existing assertions. Do not silently introduce language-prefix fallback.
- Specify name syntax, collection shapes, complete CLI/data-set precedence examples, and safe diagnostic/source paths.
- Define shared-call/inner-step identity without losing case/step positions or prematurely adding M6 aggregation.
- Design redacted representations that preserve field formats, and cover encoded/transformed protected content without promising unbounded automatic secret detection. Current original raw scan-reference exposure must be reconciled before protected execution.
- Keep compatibility changes deliberate and document before widening schemas. No new owner answer is pending from the completed questionnaire; remaining proposals need review in the contract draft.

## Incremental PR sequence

This is a proposed implementation sequence for small reviewable slices, not completed work or a commitment to combine features. Every code slice includes focused public-contract tests and its own documentation/evidence. Split a slice further if review size warrants it.

| Slice | Purpose and boundary |
| --- | --- |
| 1. Contract and synthetic fixtures | Review exact reference-enabled fields, localized definition shape/matching, naming rules, data-set/CLI precedence, shared-step identity, and safe redacted evidence formats. Document the unresolved proposals before changing schemas. |
| 2. Localized variable/reference schemas | Add default/locale scalar definitions, protected environment-reference shapes, and whole-field references in the agreed fields. Reject invalid names/shapes, mixed variant types, chains, and out-of-scope reference locations. No execution yet. |
| 3. Pure scope and locale resolution | Resolve unprotected inputs with case-sensitive lookup, whole-definition replacement, locale/default selection, type preservation, and text-field conversion. Preserve source context for diagnostics; leave environment values unresolved. |
| 4. Named data-set selection | Validate and collect plan/case-contributed sets, reject duplicate/unknown names, apply per-case runtime/default selection, and import definitions with accepted precedence. Do not add run-wide selection or iteration. |
| 5. Shared-group schemas and validation | Define stable group IDs/call shape, reject unknown or nested group calls, and preserve calling-case input rules without parameters/private defaults. No execution yet. |
| 6. Shared-group expansion and traceability | Expand one-level calls with caller/inner-step identity, using the calling case context. Verify ordering and source paths without implementing M6 run aggregation. |
| 7. Redaction and safe evidence projection | Use synthetic protected values to design and verify safe assertion/axe projections, including URLs, selectors, related nodes, errors, and exposed retained records. Preserve valid result formats and handle empty values safely. |
| 8. Effective environment preflight | Resolve only winning scope/data-set/locale environment references before browser launch. Accept present empty values, reject missing effective values without disclosure, and retain protection metadata for redaction. Depend on the redaction slice; do not enable unsafe public execution paths. |
| 9. Resolved ordinary-input execution | Connect prepared non-secret inputs and shared steps to existing case-session dispatch with preflight before browser startup. Keep validation/loading ownership explicit; no CLI/editor or full run/result orchestration. |
| 10. Protected execution and retained evidence | Integrate protected preflight, execution, and redacted retained/exposed assertion/axe evidence. Remove original-reference escape paths for protected observations; verify errors and cleanup do not disclose secrets. Do not enable real protected inputs until this path is safe. |
| 11. M5 verification and close-out | Run applicable package checks and current CI, reconcile contracts/examples/learning, review compatibility and retained evidence, and record what is verified. Keep deferred Chromium/axe tests and M6 policy separate. |

## Completion evidence

- Schemas and synthetic fixtures define accepted values/references and reject unsupported constructs.
- Resolution/preflight tests demonstrate precedence, locale replacement/selection, case isolation, effective-only environment access, empty/missing handling, and conversion before browser startup.
- Shared calls preserve ordering and caller/inner-step identity; nested calls fail validation.
- Retained/exposed diagnostics and assertion/axe evidence do not disclose resolved protected values under the agreed tested redaction contract.
- Applicable package checks and current CI results are recorded; documentation distinguishes implemented, verified, proposed, and deferred work.
- Deferred actual Chromium/axe testing remains tied to the project test-site prerequisite; no M5 test claim substitutes for it.

## Learning reference

[Variable scopes, data sets, shared steps, and protected values](../../Learning%20Plan/Phase%201/05-variables-data-sets-shared-steps-and-loops.md)
