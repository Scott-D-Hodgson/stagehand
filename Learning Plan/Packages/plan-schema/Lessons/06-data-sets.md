# Lesson 6: Data sets

> “What data-set structure is valid today, and what behaviour is still missing?” — Dana “Data-set Detective” Doyle, Developer

A case may contribute `dataSets`. Each entry has a case-sensitive `name` and `variables` using the ordinary scalar definition shape. A case may name its fallback with `defaultDataSet`.

```json
{
  "dataSets": [
    { "name": "standard", "variables": { "email": { "default": "tester@example.invalid" } } }
  ],
  "defaultDataSet": "standard"
}
```

Case validation rejects malformed definitions and duplicate names inside one case. Bundle validation rejects names duplicated across cases and unknown default names. Selection, precedence, runtime overrides, and runner application are not implemented yet.

## Try it

Explain why `validateCase` can detect a duplicate inside one case but needs `validatePlanBundle` to detect a duplicate contributed by another case.

## You are ready when

- You can describe the accepted JSON shape.
- You do not confuse validated structure with implemented selection.

