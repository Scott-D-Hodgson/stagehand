# 5. Variable scopes, data sets, shared steps, and loop semantics

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, work through the exercise to check your reasoning about lifetime and bounds.

- [ ] I can explain variable scope and lifetime and why they are different from a variable's value.
- [ ] I understand how data cases let one test run with different inputs.
- [ ] I can describe a benefit and a debugging cost of reusable step groups.
- [ ] I know why loops need explicit limits and predictable exit behaviour.
- [ ] I can explain why secret values should come from outside the plan and stay out of logs and reports.

## What you will learn

- How variables hold values during a run and why scope matters.
- How data-driven tests reuse a plan with multiple input records.
- How shared steps reduce duplication without obscuring behaviour.
- Why loops need explicit bounds and predictable variable rules.

## Core ideas

A **variable** gives a value a name so later steps can refer to it. **Scope** describes where that name is visible and how long its value lives. A test-local variable should not unexpectedly leak into another test. **Data sets** provide named input records so the same test can run for different cases.

A **shared step group** is a reusable sequence that multiple cases can call. This is like a well-rehearsed scene used in several performances: change it once and every caller may be affected. Stagehand keeps its input rules simple: a shared step reads the calling case's variables; it does not declare its own parameters or variable defaults.

A **loop** repeats work. Loops need bounds, explicit iteration data, and clear exit behaviour so a plan cannot repeat indefinitely or consume unbounded time. Stagehand's initial proposed default is 10 iterations, with plan/case overrides.

## Concepts to understand

- **Lifetime:** when a value is created, updated, and discarded.
- **Visibility:** which steps can read or write a value.
- **Shadowing:** reusing a name in a nested scope; potentially confusing unless rules are simple.
- **Data-driven execution:** run a test repeatedly with different inputs while retaining a stable test identity and reporting each case clearly.
- **Reuse and indirection:** shared steps prevent copy/paste but can make the actual path harder to follow.
- **Iteration limit:** a maximum count that bounds execution even if input or exit conditions are wrong.
- **Secret reference:** a pointer to externally supplied sensitive data rather than the secret value itself. Stagehand backlog calls for environment-variable secret references; the value should not be written into plans, logs, or reports.

## Apply this to Stagehand

The test plan contains shared steps, executable cases, and named data sets. A case is one executable test case with steps. Case JSON files can contribute named data sets to the plan-level collection. A case can name its default set; at run time, a selected set is imported into the case's variables and overrides same-named case-default values. Define how a runtime selection targets one or more cases and how duplicate or unknown set names are handled in [ATR-016](../../Planning/Backlog/epics/E02-execution-engine/stories/ATR-016.md).

The current variable scope is plan > case > step, with narrower scopes shadowing wider ones; CLI values replace JSON values at their specified scope. Named data-set values are imported into the case for that run; a run-time selection wins over the case's default set values. Shared steps use the calling case's variables and cannot call other shared steps. They have no separate parameters or variable defaults. Loops default to 10 iterations and plan/case options can override the bound. A hard assertion failure inside a loop stops the case immediately, which exits the loop. Environment variables are the initial secret source; missing required secrets fail before browser startup. Managed secret stores are future work. Do not allow arbitrary executable JavaScript in plans; ATR-001 excludes it from the initial release.

## Exercise

Design a small login-style synthetic scenario with two cases, a plan-level named data set contributed by a case file, a run-time data-set override, and one reusable setup sequence. Draw the scope/lifetime of each variable, show one name where the run-time set wins over the case default, note which values are sensitive and how they are supplied, and trace both a normal loop and a hard assertion failure that exits the loop and case. Add stable IDs to distinguish cases in diagnostics without relying on translated descriptions.

## You are ready when

- Variable visibility and lifetime can be explained without relying on hidden implementation behaviour.
- Data cases and shared steps can be traced in a report back to their source plan.
- Repetition is bounded and deterministic, and sensitive values are not accidentally emitted.

## Read next

- [TE-005 — Variable and secret resolution](../../Planning/Backlog/technical-enablers/te-005-variable-and-secret-resolution.md)
- [TE-006 — Shared-step and loop engine](../../Planning/Backlog/technical-enablers/te-006-shared-step-and-loop-engine.md)
- [ATR-001 — Versioned JSON test-plan schema](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md)

## Reinforcement quiz

Try these from memory, then open the answer key.

1. What does scope tell you? What does lifetime tell you?
2. How can a case get a default named data set, and what happens when the run selects a different set?
3. What is one benefit and one risk of shared steps?
4. What protects a plan from an accidental or unbounded loop?
5. Where should a sensitive value come from, and where should it not appear?
6. What happens when a hard assertion fails inside a loop?

<details>
<summary>Answer key</summary>

1. Scope tells you where a variable is visible; lifetime tells you when it exists and when it is discarded.
2. A case can declare a default set from the plan-level collection. A run-time selection replaces that default and its same-named values take precedence for that execution.
3. Shared steps reduce duplication; they can also hide execution paths or make one change affect many callers.
4. Define an explicit maximum iteration count and clear exit behaviour, and validate those bounds.
5. Resolve it from an approved external source such as an environment variable or secret store. Do not put the actual value in the plan, logs, diagnostics, screenshots, or reports.
6. The runner exits the loop and immediately stops the current case.

</details>
