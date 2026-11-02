# Lesson 5: Variables

> “How are ordinary reusable values defined, chosen, and placed into a case step?” — Victor “Variable Virtuoso” Vega, Developer

An ordinary variable definition has a required text, number, or boolean `default` and optional same-type locale values. Names are case-sensitive. The narrower scope wins: step, then selected data set, then case, then plan. The winning definition replaces the whole broader definition; locale maps are not merged.

A step refers to a value with a whole-field object such as `{ "var": "email" }`. Ordinary strings stay literal. `resolveVariable` chooses a definition and locale/default value. `prepareCaseStep` and `prepareCase` replace supported references in detached copies, converting numbers and booleans to text only for text destinations.

Think of scope as stacked instruction cards: use the topmost card that names the value, then read only that card.

## Try it

Define `greeting` at plan and case scope with different locale maps. Predict the value for `fr-CA` when the case definition has no `fr-CA` entry.

## You are ready when

- You can state the scope order and whole-definition replacement rule.
- You know why `${email}` is literal text rather than interpolation.

