# Lesson 7: Case preparation

> “How are case inputs and shared steps prepared before the first step is dispatched?” — Casey “Case Composer” Cole, Developer

`executeCase({ case, planVariables?, dataSets?, selectedDataSet?, sharedStepGroups? })` asks `plan-schema` to select a case default or explicit per-case data set, expand `callSharedSteps` markers, then prepare detached steps using the run locale. Supported `{ "var": "name" }` references are replaced, and numbers/booleans become text for text destinations. The selected definitions sit below step variables but above same-named case and plan definitions.

Preparation covers the whole case before dispatch starts. A `CasePreparationError` retains the case ID, source path, reason, message, and shared-step identity when applicable; no step from that call is dispatched. A runtime `StepExecutionError` retains the same shared-step identity.

This is a case-session boundary. Chromium and the session already exist, so full pre-browser-startup orchestration remains future work. Protected environment values are not integrated.

## Try it

Place a valid navigation step before a later missing variable. Then replace the missing-variable case with an unknown selected data-set name. Explain why navigation still does not occur in either case.

## You are ready when

- You can distinguish preparation from step-by-step resolution.
- You can state the current browser-startup boundary honestly.

