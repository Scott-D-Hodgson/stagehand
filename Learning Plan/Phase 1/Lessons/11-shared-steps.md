# Lesson 11: Shared steps

> “How can cases reuse behaviour without creating an invisible maze of nested calls?” — Sharon “Shared-step Sherpa” Shaw, Developer

The accepted MVP direction is one-level shared groups with stable IDs. A plan can declare `sharedStepGroups`, and a case can use a `callSharedSteps` marker. Validation rejects duplicate IDs, unknown calls, group-to-group calls, and private variable definitions inside group steps. Expansion replaces a marker with detached group steps and retains the call-site and inner-step identity. Preparation resolves those copied steps with the calling case's variables and selected data set. Runner-core then dispatches the prepared steps in order. A group has no private parameters or defaults.

Think of a shared group as a reusable scene inserted into the caller's script, not a separate program. Diagnostics retain both the call site and inner-step identity for preparation errors, hard step errors, and soft assertion failures. Result aggregation and serialization of that identity are later M6 work.

## Try it

Sketch one case calling a sign-in group. Mark the caller context and the identity needed if the group's second step fails.

## You are ready when

- You can explain the one-level restriction.
- You can distinguish shared steps from loops, which are deferred beyond MVP.
- You can explain how the caller and inner-step identity survive expansion and dispatch.

