# Lesson 7: Case preparation

> “How are case variables and a selected data set prepared before the first step is dispatched?” — Casey “Case Composer” Cole, Developer

`executeCase({ case, planVariables?, dataSets?, selectedDataSet? })` asks `plan-schema` to select a case default or explicit per-case data set, then prepare a detached case using the run locale. Supported `{ "var": "name" }` references are replaced, and numbers/booleans become text for text destinations. The selected definitions sit below step variables but above same-named case and plan definitions.

Preparation covers the whole case before dispatch starts. A `CasePreparationError` retains the case ID, source path, reason, and message; no step from that call is dispatched.

This is a case-session boundary. Chromium and the session already exist, so full pre-browser-startup orchestration remains future work. Data-set selection and protected environment values are also not integrated.

## Try it

Place a valid navigation step before a later missing variable. Then replace the missing-variable case with an unknown selected data-set name. Explain why navigation still does not occur in either case.

## You are ready when

- You can distinguish preparation from step-by-step resolution.
- You can state the current browser-startup boundary honestly.

