# Lesson 10: Variables and data sets

> “How can cases reuse fixed inputs without hiding where their values came from?” — Vince “Variable Wrangler” Valdez, Developer

Variables have case-sensitive names, scalar defaults, and optional same-type locale values. Narrower scope replaces broader scope: step, case, then plan. Whole-field `{ "var": "name" }` references keep ordinary text literal.

Cases can declare named data sets and a default name. Pure selection now chooses the default or an explicit per-case name, rejecting unknown names before browser work. Selected definitions override same-named case definitions during preparation, while step definitions remain narrower. Runner integration remains a future slice. Protected environment values require safe redaction before execution.

## Try it

Predict a variable value when a case override omits a locale present at plan scope. Then explain why the plan locale is not merged in.

## You are ready when

- You can state scope and replacement rules.
- You distinguish implemented pure selection from future runner integration.

