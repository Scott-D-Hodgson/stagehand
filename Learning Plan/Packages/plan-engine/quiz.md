# `plan-engine` course skill check

1. Why is file reading in `plan-engine` rather than `plan-schema`?
2. Why does the loader resolve the original reference instead of only its normalized matching text?
3. What does `caseIndex` preserve?
4. Why is an unreferenced malformed file ignored?
5. Which records enter `sha256-v1`, and in what order?
6. Does a successful load mean the test ran?
7. Practical task: trace one outside-directory link failure from a plan reference to the returned issue.

## Answer key

1. File access needs Node APIs; shared schema validation must also remain usable by browser consumers.
2. Filesystem links can change how later segments resolve, so the loader must check and read the actual referenced target.
3. It preserves the connection between a parsed case and its position/reference in the plan.
4. The loader deliberately reads only files the plan references.
5. The plan raw bytes with label `plan`, then referenced case raw bytes in plan order with normalized relative-path labels.
6. No. Loading, parsing, validation, containment, and fingerprinting happen before execution.
7. A strong answer distinguishes logical matching from segment-by-segment canonical containment and identifies the original reference in the diagnostic.
