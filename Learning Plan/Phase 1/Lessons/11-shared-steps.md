# Lesson 11: Shared steps

> “How can cases reuse behaviour without creating an invisible maze of nested calls?” — Sharon “Shared-step Sherpa” Shaw, Developer

The accepted MVP direction is one-level shared groups with stable IDs. A group uses the calling case's variable context and has no private parameters or defaults. Shared groups cannot call other shared groups.

Think of a shared group as a reusable scene inserted into the caller's script, not a separate program. Diagnostics must preserve both the call site and inner-step identity. This capability remains planned, not implemented.

## Try it

Sketch one case calling a sign-in group. Mark the caller context and the identity needed if the group's second step fails.

## You are ready when

- You can explain the one-level restriction.
- You can distinguish shared steps from loops, which are deferred beyond MVP.

