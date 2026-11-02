# Lesson 1: The result contract

> “What does `result-model` promise about a saved Stagehand run result?” — Rita “Result Reader” Rhodes, Developer

The result v1 JSON Schema is the normative—meaning authoritative—runtime contract. It describes required run metadata, cases, indexed steps, effective settings, findings, counts, and source fingerprint shape.

A contract describes the container, not how every value was produced. A valid result may still contain counts or outcomes that future M6 execution policy would judge inconsistent. The validator also does not calculate the fingerprint; `plan-engine` does that while loading source files.

Each step uses a zero-based `index` within its case. Case ID plus step index provides current traceability; there is no author-assigned step ID.

## Try it

Open the synthetic result example and identify which fields describe source identity, case identity, and step identity.

## You are ready when

- You can identify the normative result artifact.
- You can explain why structural validity is not outcome-policy correctness.

