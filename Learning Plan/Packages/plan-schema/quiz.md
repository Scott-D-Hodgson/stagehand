# `plan-schema` course skill check

Use the package source and tests when needed. Answer in your own words.

1. What is the difference between Stagehand schema version 1 and JSON Schema Draft 2020-12?
2. Why does invalid user input return issues rather than normally throwing?
3. Why can reference matching not prove filesystem containment?
4. Name two checks that require a parsed bundle.
5. A case definition overrides a plan definition but omits its `fr-CA` value. Is the plan's `fr-CA` value merged in?
6. How does a case choose a data set, and what remains unimplemented afterward?
7. Practical task: add a synthetic invalid case test and explain the expected path and keyword before running it.

## Answer key

1. Version 1 identifies Stagehand's evolving document contract; Draft 2020-12 is the rule language used to describe it.
2. Validation failures are expected user-facing results. Structured issues let editors and callers point to each problem.
3. A link can redirect the real path; only filesystem-aware canonical resolution can check the target.
4. Examples include case count, unique case IDs, plan-wide unique data-set names, and known default data-set names.
5. No. The narrower definition replaces the complete broader definition, then falls back to its own default.
6. `selectCaseDataSet` uses an explicit per-case name when supplied, otherwise the case default; the selected definitions sit below step variables and above case/plan definitions. Runner hand-off and runtime application remain future work.
7. A good answer predicts the exact field path and the schema or semantic rule, then confirms it through the public package import.
