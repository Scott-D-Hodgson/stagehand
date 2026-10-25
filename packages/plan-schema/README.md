# Plan schema

This package publishes the initial versioned JSON Schema definitions for Stagehand plans and case files. The schemas use JSON Schema Draft 2020-12; each document's integer `schemaVersion` is Stagehand's own contract version.

Import the schemas from the package's single public entry point:

```js
import { planSchemaV1, caseSchemaV1 } from "@stagehand/plan-schema";
```

Build the package with `npm run build --workspace @stagehand/plan-schema` before importing it; the build emits JavaScript and TypeScript declarations under the ignored `dist/` folder.

See the [plan example](examples/checkout-plan.json) and its [referenced case](examples/cases/sign-in.json).

Plan defaults are inherited by cases. A case may override supported browser and accessibility settings, and explicit CLI settings will take precedence when execution is implemented. Locale is run-scoped: a case cannot change it within a run. Browser time zone is a separate setting. Variables are represented as JSON objects, with value interpretation and external secret references to be defined with data handling.

The current schemas cover the document envelopes and the agreed initial settings. A case's `steps` must currently be an array of objects, but the schema does not validate their fields or action names; even a schema-conforming case is not necessarily ready to execute. The schemas do not resolve case-file paths, check canonical filesystem containment, validate duplicate case IDs or references, or interpret variable values. Those behaviours belong to runtime validation and later implementation milestones.
