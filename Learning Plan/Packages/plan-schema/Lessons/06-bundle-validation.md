# Lesson 6: Bundle validation

> “What can Stagehand check only after the plan and all referenced cases are available together?” — Bonnie “Bundle Builder” Brooks, Developer

[← Previous: case references](05-case-references.md) · [Course outline](../README.md) · [Next: variables →](07-variables.md)



A **bundle** is the parsed plan plus its parsed cases in plan-reference order. `validatePlanBundle` checks each document, requires one case per reference, and detects relationships that one file cannot prove alone: duplicate case IDs, duplicate named data-set keys across cases, and unknown shared-step calls.

```mermaid
flowchart TD
    subgraph E[plan-engine]
        P[Parsed plan]
        C1[Parsed case 0]
        C2[Parsed case 1]
    end
    subgraph S[plan-schema]
        B[validatePlanBundle]
    end
    P --> B
    C1 --> B
    C2 --> B
    B --> R[Valid bundle or indexed issues]
```

Issue paths begin with `/caseFiles/{index}` so the caller can connect an error to the matching plan reference. Bundle validation still does not read files or execute steps.

## Try it

Create two synthetic cases with the same ID, then with different IDs but the same data-set name. Compare the issue paths.

## You are ready when

- You can name a rule that requires the complete bundle.
- You can explain why case order must match plan-reference order.

[← Previous: case references](05-case-references.md) · [Course outline](../README.md) · [Next: variables →](07-variables.md)
