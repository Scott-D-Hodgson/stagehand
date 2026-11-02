# Phase 4 skill check

1. What is the difference between validating a result and deciding its overall outcome?
2. Why does a clean automated accessibility scan not prove accessibility?
3. Which result artifact is authoritative?
4. Why should a pipeline publish results even after tests fail?
5. Where must protected values be redacted?
6. Why are the security documents not proof of compliance?

## Answer key

1. Validation checks document shape; aggregation policy interprets collected execution outcomes.
2. Automated tools cover only some issues, and incomplete checks may require human review.
3. The versioned Stagehand JSON result.
4. A failing run is when its evidence is most needed for diagnosis and review.
5. Before output or retention, including assertion evidence, axe evidence, messages, and artifacts.
6. They help assessment and planning, but compliance requires evidence and review of the actual system and its operation.
