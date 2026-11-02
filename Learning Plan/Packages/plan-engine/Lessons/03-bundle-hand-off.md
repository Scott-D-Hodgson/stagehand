# Lesson 3: Bundle hand-off

> “Why does the loader pass parsed cases to `plan-schema` in plan-reference order?” — Hannah “Hand-off Helper” Hayes, Developer

The loader knows which file supplied each parsed value. Shared `validatePlanBundle` knows cross-document rules. Keeping the cases in plan order lets an issue such as `/caseFiles/1/defaultDataSet` map back to `plan.cases[1]` and its original path.

This is a hand-off between two responsibilities:

- `plan-engine`: filesystem reading, containment, parsing, and source association.
- `plan-schema`: document and cross-document validity.

The split keeps browser-compatible validation free of Node filesystem APIs while avoiding duplicate contract rules in the loader.

## Try it

Trace a duplicate case ID and a duplicate data-set name from the bundle issue back to the plan reference a user should see.

## You are ready when

- You can explain why the loader must preserve order and references.
- You know which package owns filesystem errors and which owns bundle rules.

