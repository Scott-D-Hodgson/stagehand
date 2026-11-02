# Lesson 3: Runtime validation

> “How does `validateResult` explain a malformed result value?” — Vera “Validation Viewer” Voss, Developer

Ajv compiles the Draft 2020-12 schema into a synchronous validator. `ajv-formats` adds checks for formats such as date-time and URI. Valid input returns `{ valid: true }`; invalid input returns structured issues with JSON Pointer paths, keywords, and messages.

Returning issues is useful because malformed result data is a reportable problem, not necessarily a programming crash. Public-entry tests import `@stagehand/result-model`, proving consumers can reach the documented API.

## Try it

Run `npm test --workspace @stagehand/result-model`. Remove a required effective accessibility tag list from a copy of the example and predict the issue path.

## You are ready when

- You can interpret an issue path and keyword.
- You know why format support must be registered explicitly.

