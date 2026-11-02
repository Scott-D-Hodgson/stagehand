# Phase 3 skill check

1. What is orchestration responsible for?
2. Why should cases use isolated browser contexts?
3. What does a concurrency limit protect?
4. How is cancellation different from a crash?
5. Why must a cleanup error not replace the primary failure?
6. What makes CLI behaviour suitable for automation?

## Answer key

1. Coordinating validated inputs, case execution, resources, outcomes, and cleanup across a complete run.
2. To prevent cookies, storage, and page state from leaking between cases.
3. Predictable resource use while several cases make progress.
4. Cancellation is a requested controlled stop that still permits reporting and cleanup.
5. The original failure explains why execution failed; cleanup trouble is important secondary evidence.
6. Stable exit codes, machine-readable artifacts, clear output, and no unexpected interactive prompts.
