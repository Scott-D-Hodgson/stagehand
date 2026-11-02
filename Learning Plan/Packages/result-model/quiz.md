# `result-model` course skill check

1. Which artifact is the normative runtime result contract?
2. What different jobs do TypeScript and JSON Schema perform?
3. What does `validateResult` return for malformed input?
4. Does a passing validation prove that case counts match outcomes?
5. Who calculates `sha256-v1`?
6. Why are effective accessibility tags separate from finding tags?
7. Practical task: make one synthetic result invalid, predict its issue path, and confirm it through the public import.

## Answer key

1. The result v1 JSON Schema.
2. TypeScript checks implementation code at compile time; JSON Schema checks actual runtime values.
3. `{ valid: false, issues }` with path, keyword, and message details.
4. No. Cross-field aggregation and status rules belong to M6 execution policy.
5. `plan-engine`; this package only validates the fingerprint's shape.
6. Effective tags record requested assessment scope even if no findings exist; finding tags describe one reported rule.
7. A strong answer uses a schema-owned rule, predicts a precise JSON Pointer path, and avoids adding an M6 policy rule to the validator.
