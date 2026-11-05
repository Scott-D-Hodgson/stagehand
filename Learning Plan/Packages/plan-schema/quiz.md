# `plan-schema` course skill check

Use the package source and tests when needed. Answer in your own words.

1. What does `version: 1` identify, and how is it different from JSON Schema Draft 2020-12?
2. What are `$defs` and `$ref`, and why does a case step use them?
3. Which plan properties provide metadata, options, reusable values, shared steps, and case references?
4. Where do current named data sets live, and how do they differ from plan variables?
5. What is Ajv's job, and what kind of rule does Stagehand add after Ajv has checked the schema?
6. Why can reference matching not prove filesystem containment?
7. Name two checks that require a parsed bundle.
8. What are the three ordinary variable value types, and what must be true of their locale values?
9. How does a protected environment reference differ from a literal string definition?
10. Put step, selected data set, case, and plan variables in precedence order.
11. How does a case choose a data set, and what happens when the selected name is unknown?
12. Why must one shared-step group not call another, and what identity does an expanded step retain?
13. Practical task: add a synthetic invalid case test and explain the expected path and keyword before running it.
14. Which public plan-schema functions validate a case and prepare it for execution?

## Answer key

1. It identifies the current Stagehand plan/case contract. Draft 2020-12 is the standard language used to write the JSON rules.
2. `$defs` stores reusable schema rules inside one contract; `$ref` uses one of those rules elsewhere. This keeps repeated rules such as locators consistent.
3. `version` and `id` are metadata; `defaults` holds options; `variables` holds plan inputs; `sharedSteps` holds reuse; `cases` holds ordered case paths.
4. They are contributed by cases through `dataSets`; there is no current `plan.dataSets` property. Plan variables are broad defaults, while a selected data set is chosen for one case.
5. Ajv applies the JSON Schema structure rules. Stagehand then applies semantic rules, such as valid locale tags or absolute HTTP/HTTPS navigation URLs.
6. A filesystem link can redirect a real path; only filesystem-aware canonical resolution can check the target.
7. Examples include one case per plan reference, unique case IDs, plan-wide unique data-set names, and known default data-set names.
8. String, number, and boolean. A definition's locale values must have the same type as its default.
9. A protected reference stores an environment-variable name instead of a value and is allowed only for text definitions. A caller supplies the actual value later; the schema does not read `process.env`.
10. Step, selected data set, case, then plan. The first definition found replaces the broader definition completely.
11. Without an explicit selection, `dataSets.default` is used. A selected named set layers over it. An unknown name returns a clear pre-browser preparation failure.
12. One-level calls avoid recursion and preserve understandable context. An expanded step retains the calling case-step index, shared-step ID, and inner-step index.
13. A good answer predicts the exact field path and the schema or semantic rule, then confirms it through the public package import.
14. `validateCase` checks the case; `prepareCase` prepares its selected values and steps.
