# Lesson 4: Source fingerprints

> “How does Stagehand create a repeatable identity for the exact loaded source files?” — Finn “Fingerprint Finder” Foster, Developer

The loader calculates a `sha256-v1` fingerprint from raw bytes. It hashes the plan first with the fixed label `plan`, then each referenced case in plan order with its normalized relative path as the label. Length prefixes separate every label and content field unambiguously.

A fingerprint is like a tamper-evident seal, not a human title. Reformatting JSON or changing line endings changes the bytes and therefore the digest, even when parsing produces the same object. Machine-specific absolute paths are excluded so the same source tree can produce the same fingerprint elsewhere.

The result is `{ algorithm: "sha256-v1", digest }`. `result-model` describes that shape; `plan-engine` calculates it.

## Try it

Load the same source twice, then add harmless whitespace. Predict which digests match and explain why.

## You are ready when

- You can state the record order and labels.
- You can explain raw-byte sensitivity and the purpose of length prefixes.

