# Lesson 10: Variables and data sets

> “How can cases reuse fixed inputs without hiding where their values came from?” — Vince “Variable Wrangler” Valdez, Developer

[← Previous: assertions accessibility](09-assertions-accessibility.md) · [Phase outline](../README.md) · [Next: shared steps →](11-shared-steps.md)


Variables have case-sensitive names, scalar defaults, and optional same-type locale values. Narrower scope replaces broader scope: step, selected data set, case, then plan. Whole-field `{ "var": "name" }` references keep ordinary text literal.

Cases can define `dataSets.default` as a base set, plus named sets that contain only changed values. Selecting a named set layers it over the base and rejects an unknown name before dispatch. `runner-core` accepts the validated bundle collection and optional per-case selection at its case-session boundary, preparing selected definitions before steps run. Its browser-free `prepareRunForExecution` helper can prepare a caller-selected list before startup, but full orchestration has not connected that helper to browser lifecycle. Text definitions may use `{ "env": "NAME" }` references. Plan-schema looks up an already-selected name from a caller-supplied map; it does not read `process.env`. `executeCase` can use that supplied map, sends the effective value to browser actions, and redacts returned soft failures and retained automatic accessibility evidence. A direct scan can redact only values its caller supplies. CLI integration and complete pre-browser orchestration remain future work.

## Try it

Predict a variable value when a case override omits a locale present at plan scope. Then explain why the plan locale is not merged in.

## You are ready when

- You can state scope and replacement rules.
- You distinguish case-session selection from future pre-browser orchestration.

[← Previous: assertions accessibility](09-assertions-accessibility.md) · [Phase outline](../README.md) · [Next: shared steps →](11-shared-steps.md)
