# Lesson 10: Variables and data sets

> “How can cases reuse fixed inputs without hiding where their values came from?” — Vince “Variable Wrangler” Valdez, Developer

Variables have case-sensitive names, scalar defaults, and optional same-type locale values. Narrower scope replaces broader scope: step, selected data set, case, then plan. Whole-field `{ "var": "name" }` references keep ordinary text literal.

Cases can declare named data sets and a default name. `runner-core` now accepts the validated data-set collection and an optional per-case selection at its case-session boundary. It chooses the explicit name or default, rejects an unknown name before dispatch, and prepares selected definitions before case steps run. Full orchestration must still move this preflight ahead of browser startup. Protected environment values require safe redaction before execution.

## Try it

Predict a variable value when a case override omits a locale present at plan scope. Then explain why the plan locale is not merged in.

## You are ready when

- You can state scope and replacement rules.
- You distinguish case-session selection from future pre-browser orchestration.

