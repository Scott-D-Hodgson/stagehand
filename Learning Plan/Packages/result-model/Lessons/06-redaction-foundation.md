# Lesson 6: Redaction foundation

> “How can Stagehand hide a protected value without changing the useful shape of its evidence?” — Rowan “Redaction Ranger” Reed, Developer

`redactEvidence(evidence, protectedValues)` makes a separate copy of JSON-like evidence and replaces each supplied, non-empty protected value with `[REDACTED]`. It works through nested strings, so it can cover diagnostic messages, assertion details, URLs, markup, selectors, summaries, tags, related nodes, and supplied raw scan records.

Think of it as a careful editor making a photocopy for sharing: the editor blacks out a known value but leaves the rest of the page readable. It does not guess which values are secret, read environment variables, or change the original evidence.

This is only a foundation. Runner-core still exposes raw scan history, so protected values are not yet safe to use in execution. A later M5 slice will supply effective protected values to this helper and prevent unredacted retained output.

## Try it

Use a synthetic value such as `not-a-real-password` in a nested HTML string and a URL. Predict the two redacted strings without changing the original object.

## You are ready when

- You can explain why empty strings are not redacted.
- You can state why a detached redacted copy is safer for evidence sharing.
- You can distinguish this helper from protected-value environment lookup and runner integration.
