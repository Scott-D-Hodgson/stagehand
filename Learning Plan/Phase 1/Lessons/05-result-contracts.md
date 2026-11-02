# Lesson 5: Result contracts

> “How does Stagehand describe what happened without deciding every outcome rule inside the schema?” — Reese “Result Recorder” Ray, Developer

The result v1 schema defines the saved JSON shape: run metadata, source identity, cases, steps, effective settings, and accessibility evidence. TypeScript types support implementation code; runtime schema validation checks actual values.

Cross-field outcome and aggregation decisions belong to M6. A schema can require `caseCounts`; it should not quietly invent how failures combine into a run status.

See the [result-model course](../../Packages/result-model/README.md).

## Try it

Classify a required URL format and a rule that failed cases make a run fail. Which belongs to schema structure, and which belongs to policy?

## You are ready when

- You can separate result shape from execution policy.
- You know the schema is normative for emitted JSON.

