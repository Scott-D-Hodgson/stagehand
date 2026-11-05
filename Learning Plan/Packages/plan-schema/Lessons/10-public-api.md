# Lesson 10: Public API anatomy

> “Which plan-schema tools should I use instead of reaching into its folders?” — Sally “Schema Switchboard” Singh, Developer

[← Previous: shared steps](09-shared-steps.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)

`src/index.ts` is the public switchboard for plan-schema. It exports validation, reference matching, and preparation tools. Callers give it already-read JSON-like data; it does not open files or launch a browser.

## Functions

| Function | What it does | Inputs | Output |
| --- | --- | --- | --- |
| `validatePlan` / `validateCase` | Check one plan or case, including Stagehand semantic rules. | Unknown document value. | Valid confirmation or issues. |
| `validatePlanBundle` | Checks that a plan and its loaded cases agree. | Plan and parsed cases. | Valid confirmation or issues. |
| `matchCaseReferences` | Matches plan case entries to available paths. | Plan and paths. | Matches or issues. |
| `resolveVariable` / `resolveEnvironmentValue` | Resolve one ordinary or protected variable value. | Resolution options. | Value metadata or a safe failure. |
| `selectCaseDataSet` | Chooses the effective case data set. | Case and selection options. | Selected variables or failure. |
| `expandCaseSharedSteps` / `prepareCaseSharedSteps` | Expand reusable steps and prepare their values. | Case and shared-step options. | Expanded/prepared case or failure. |
| `prepareCaseStep` / `prepareCase` | Prepare one step or all case steps before execution. | Preparation options. | Prepared data or a failure. |
| `validatePlanSchema` / `validateCaseSchema` | Run only the JSON Schema portion of validation. | Unknown document value. | Valid confirmation or schema issues. |

## Types

| Type or value | What it describes | Used by |
| --- | --- | --- |
| `ValidationResult` / `ValidationIssue` | A validation answer and its issue details. | Validation functions. |
| `CaseReferenceMatch*` | Matched case-reference details. | Reference matching. |
| `VariableDefinition`, `VariableValue`, `VariableResolutionResult` | Variable definitions and resolved values. | Variable functions. |
| `NamedDataSet`, `SharedSteps`, `ExpandedCaseStep` | Data-set and shared-step structures. | Preparation and expansion. |
| `PrepareCase*` / `Resolve*` option and result types | Input and output shapes for preparation/resolution helpers. | TypeScript callers. |

The public values `planSchemaV1` and `caseSchemaV1` are the version 1 JSON Schema documents. Schema-aware tools and tests use them.

```ts
import { prepareCase, validateCase } from "@stagehand/plan-schema";

const checked = validateCase(caseJson);
if (checked.valid) {
  const prepared = prepareCase({ case: caseJson, locale: "en-CA" });
  console.log(prepared.prepared);
}
```

Validation and preparation are separate on purpose: validation decides whether the document is acceptable; preparation resolves its selected values before browser work begins.

## Try it

Pick a case with a variable and a shared-step call. Identify which public function validates it and which prepares it.

## You are ready when

- You can choose a validator, matcher, resolver, or preparer from the public API.
- You can explain why this package works with data rather than file paths or browser pages.
- You can distinguish a type-only export from a callable function.

[← Previous: shared steps](09-shared-steps.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)
