# Lesson 9: Automation behaviour

> “How does a script know whether Stagehand passed, failed, or could not run?” — Ari “Automation Ally” Adams, Developer

Automation needs stable exit codes, machine-readable artifacts, useful standard output, and no surprise prompts. A test failure is different from invalid input or an internal tool error.

Human messages and machine results can coexist, but the authoritative structured artifact must remain unambiguous.

## Try it

Assign distinct outcomes to a passing run, failed assertion, invalid plan, and unexpected internal error.

## You are ready when

You can design non-interactive behaviour that a pipeline can interpret reliably.
