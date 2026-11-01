# 2. Parallel execution, timeouts, cancellation, and failure policy

## Self-assessment: do I need this lesson?

- [ ] I can explain the difference between concurrency and parallelism.
- [ ] I understand why each case needs isolated browser state.
- [ ] I can distinguish queue time from active case execution time.
- [ ] I know what should happen when a hard assertion fails in a case.
- [ ] I can describe cancellation and the cleanup it requires.

## What you will learn

- How bounded concurrency protects machine resources.
- How to define timeout scope and duration thresholds.
- How to make failure and cancellation behaviour consistent.
- Why parallel outcomes must not depend on completion order.

## Core ideas

Concurrency limits how many cases are active at once. Stagehand's default is five concurrent case contexts, with the plan able to set a limit. If there are more cases than slots, the rest wait in a queue. A fresh isolated context per case prevents one case's session state from contaminating another.

Timeouts need a clock with a clearly stated start and stop. The agreed ten-minute default measures active case execution only; queue wait, browser/context startup, and cleanup are excluded. Plan/case settings may override it. Run and case durations are recorded, and configured duration thresholds can fail execution. Plan-wide active timeout semantics with parallel cases still need a design decision; document that gap rather than guessing.

Cancellation is a request to stop work, not a magic eraser. The runner must stop scheduling queued cases, interrupt active operations where possible, close contexts, and report cancellation distinctly. A hard assertion stops its case immediately. Loops are deferred beyond MVP. Independent cases can continue under the documented run policy.

## Apply this to Stagehand

Design the scheduler around a bounded queue and explicit case states. Record start time only when case execution becomes active. Ensure cancellation and timeout signals reach waits, browser operations, and case scheduling. Keep each result tied to its stable case identity even if parallel cases finish in a different order than they started.

Separate test failures from infrastructure errors: a functional assertion mismatch or a configured accessibility failure is `failed`; cancellation is `cancelled`; a runner/browser/report infrastructure failure is `error`. Diagnostics should preserve which condition failed. JSON result status and CLI exit behaviour must follow a documented mapping. Whether a particular failure stops later cases is a policy choice and should be explicit.

## Exercise

A plan has 12 cases, a concurrency limit of 5, a 10-minute active case timeout, and an operator cancels while five cases are running and seven are queued. Draw the scheduler state before and after cancellation. Then trace a hard assertion failure in one case, including what happens to its remaining steps and unrelated cases.

## You are ready when

- Waiting for a free slot does not consume a case's active timeout budget.
- Cancellation prevents queued cases from starting and attempts orderly cleanup.
- Case status and overall run status do not depend on which case finished first.

## Read next

- [Playwright parallelism](https://playwright.dev/docs/test-parallel)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Execution context and failure policy TE-004](../../Planning/Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md)
- [Phase 3 roadmap](../../Planning/Roadmap/Phase-3-execution-engine-and-cli/README.md)

## Reinforcement quiz

1. What does the concurrency limit control?
2. Does queue wait count toward the active case timeout?
3. What must cancellation do with queued and active cases?
4. What happens after a hard assertion fails in a case?
5. Why should result ordering not depend on completion time?

<details>
<summary>Answer key</summary>

1. The maximum number of cases executing at once.
2. No. The agreed timeout measures active case execution and excludes queue wait, startup, and cleanup.
3. Stop scheduling queued cases, interrupt active work where possible, clean up contexts, and report cancellation.
4. Stop the current case immediately; independent cases follow the run policy. Loops are deferred beyond MVP.
5. Stable identities and explicit ordering make results understandable and reproducible despite parallel completion.

</details>
