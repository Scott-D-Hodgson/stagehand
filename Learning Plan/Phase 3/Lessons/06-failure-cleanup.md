# Lesson 6: Failure and cleanup

> “If a test fails and cleanup also fails, which problem do we report?” — Frank “Failure Foreman” Frost, Developer

The failure that caused execution to stop is the **primary failure**. Cleanup problems are secondary evidence. They matter, but must not erase the original cause.

Cleanup should be safe to attempt even after partial setup. Think of closing a workshop after an accident: preserve the incident report, then record any trouble locking up.

## Try it

Write an outcome for an assertion failure followed by a browser-close failure. Identify primary and secondary evidence.

## You are ready when

You can preserve the real cause while still recording cleanup problems.
