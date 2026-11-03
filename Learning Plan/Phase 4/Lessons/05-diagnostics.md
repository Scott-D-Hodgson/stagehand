# Lesson 5: Diagnostics

> “When a run goes wrong, what clues help us find the cause without exposing secrets?” — Diana “Diagnostic Decoder” Drake, Developer

[← Previous: azure pipelines](04-azure-pipelines.md) · [Phase outline](../README.md) · [Next: security →](06-security.md)


Diagnostics include clear errors, stable identifiers, timings, and carefully selected evidence. They should help answer where and why something failed without dumping every internal detail.

Redaction must happen before diagnostics are retained or printed. Extra detail is not useful if it leaks a protected value.

## Try it

Rewrite a vague “step failed” message using a case ID, step ID, action, and safe cause.

## You are ready when

You can improve troubleshooting while keeping output bounded, structured, and redacted.

[← Previous: azure pipelines](04-azure-pipelines.md) · [Phase outline](../README.md) · [Next: security →](06-security.md)
