# Lesson 2: Validation

> “How does Stagehand decide whether one plan or case value is valid?” — Valerie “Validation Voyager” Vaughn, Developer

`validatePlan` and `validateCase` accept an already parsed JavaScript value. They return `{ valid: true }` or `{ valid: false, issues }`; ordinary invalid input is reported as data rather than thrown as an exception.

Ajv checks the JSON Schema first. Stagehand then adds checks that are clearer in code, such as valid locale tags, supported time zones, canonical duplicate locale keys, and absolute HTTP/HTTPS navigation URLs. These are often called **semantic checks**: they check meaning that goes beyond basic JSON shape.

An issue contains a JSON Pointer path, keyword, and message. A path such as `/steps/2/url` is a precise trail to the failing value—like an aisle, shelf, and item number.

## Try it

Run `npm test --workspace @stagehand/plan-schema`. Change a copy of a navigation URL to `ftp://example.test` and predict the issue path before validating it.

## You are ready when

- You can explain schema checks versus semantic checks.
- You can use an issue path to find the failing value.

