# Lesson 11: Shared steps

> “How can cases reuse behaviour without creating an invisible maze of nested calls?” — Sharon “Shared-step Sherpa” Shaw, Developer

The accepted MVP direction is one-level shared groups with stable IDs. A plan can now declare `sharedStepGroups`, and a case can use a `callSharedSteps` marker. Validation rejects duplicate IDs, unknown calls, group-to-group calls, and private variable definitions inside group steps. Pure expansion replaces a marker with detached group steps and retains the call-site and inner-step identity. Preparation resolves those copied steps with the calling case's variables and selected data set. A group has no private parameters or defaults; runner execution remains later work.

Think of a shared group as a reusable scene inserted into the caller's script, not a separate program. Diagnostics must preserve both the call site and inner-step identity. This capability remains planned, not implemented.

## Try it

Sketch one case calling a sign-in group. Mark the caller context and the identity needed if the group's second step fails.

## You are ready when

- You can explain the one-level restriction.
- You can distinguish shared steps from loops, which are deferred beyond MVP.
- You distinguish validated shared-step calls from future expansion and execution.

