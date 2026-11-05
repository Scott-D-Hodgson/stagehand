# `result-model` course skill check

1. Which artifact is the normative runtime result contract?
2. What different jobs do TypeScript and JSON Schema perform?
3. What does `validateResult` return for malformed input?
4. Does a passing validation prove that case counts match outcomes?
5. Who calculates `sha256-v1`?
6. Why are effective accessibility tags separate from finding tags?
7. What does `redactEvidence` do, and what does it deliberately not do yet?
8. Practical task: make one synthetic result invalid, predict its issue path, and confirm it through the public import.
9. Which two public functions check a result and make a safe evidence copy?

## Answer key

1. The result v1 JSON Schema.
2. TypeScript checks implementation code at compile time; JSON Schema checks actual runtime values.
3. `{ valid: false, issues }` with path, keyword, and message details.
4. No. Cross-field aggregation and status rules belong to M6 execution policy.
5. `plan-engine`; this package only validates the fingerprint's shape.
6. Effective tags record requested assessment scope even if no findings exist; finding tags describe one reported rule.
7. It returns a detached JSON-like copy with supplied non-empty protected literals replaced in nested strings. It does not identify secrets, read environment variables, or protect existing runner histories until a later integration slice uses it.
8. A strong answer uses a schema-owned rule, predicts a precise JSON Pointer path, and avoids adding an M6 policy rule to the validator.
9. `validateResult` checks a result; `redactEvidence` makes a detached redacted evidence copy.
