# Lesson 5: Cancellation

> “How can a person stop a run without leaving browsers and files half-finished?” — Cal “Cancellation Coordinator” Cruz, Developer

Cancellation is a requested, controlled stop—not a process crash. New work should stop, active work should receive the signal, and cleanup should still complete.

The result must distinguish cancellation from a test assertion failure so people and automation understand why the run ended.

## Try it

List the actions taken after cancellation arrives while two cases are active and three are waiting.

## You are ready when

You can explain how cancellation travels through the runner and still permits cleanup and honest reporting.
