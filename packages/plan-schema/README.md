# Plan schema

This package publishes the initial versioned JSON Schema definitions and runtime schema validators for Stagehand plans and case files. The schemas use JSON Schema Draft 2020-12; each document's integer `schemaVersion` is Stagehand's own contract version.

Import the schemas from the package's single public entry point:

```js
import { planSchemaV1, caseSchemaV1 } from "@stagehand/plan-schema";
```

Validate unknown input with the package's public helpers. Invalid input returns
an issue list instead of throwing:

```ts
import { validatePlan } from "@stagehand/plan-schema";

const result = validatePlan(input);
if (!result.valid) {
  for (const issue of result.issues) {
    console.error(issue.path, issue.keyword, issue.message);
  }
}
```

Validation reports whether the input matches the corresponding JSON Schema. It
does not check duplicate identifiers across case files or whether steps can
run.

Match case references to relative file names before reading their contents:

```ts
import { matchCaseReferences } from "@stagehand/plan-schema";

const result = matchCaseReferences(plan, ["cases/sign-in.json"]);
if (!result.valid) {
  for (const issue of result.issues) {
    console.error(issue.path, issue.keyword, issue.message);
  }
}
```

The matcher compares paths case-sensitively, normalizes `.` segments and
repeated `/`, and reports duplicate references after normalization. A failed
match can still include the references that did match. It only compares the
plan's references with supplied relative file names: it does not read or parse
case files, check canonical filesystem containment or follow links. The
Node-side loader must perform those checks before reading the matched files.

Run the package checks with `npm test --workspace @stagehand/plan-schema`. This builds the package and runs Node's built-in test runner against the public package entry point. The build emits JavaScript and TypeScript declarations under the ignored `dist/` folder.

See the [plan example](examples/checkout-plan.json) and its [referenced case](examples/cases/sign-in.json).

Plan defaults are inherited by cases. A case may override supported browser and accessibility settings, and explicit CLI settings will take precedence when execution is implemented. Locale is run-scoped: a case cannot change it within a run. Browser time zone is a separate setting. Variables are represented as JSON objects, with value interpretation and external secret references to be defined with data handling.

The current schemas cover the document envelopes and the agreed initial settings. A case's `steps` must currently be an array of objects, but the schema does not validate their fields or action names; even a schema-conforming case is not necessarily ready to execute. The matcher does not read or parse case files, enforce canonical filesystem containment, validate duplicate case IDs across files, or interpret variable values. Those checks belong to later implementation milestones.

Third-party licence information for Ajv and its dependencies is recorded in the repository's [third-party notices](../../THIRD-PARTY-NOTICES.md). The transitive dependency `fast-uri` uses BSD-3-Clause; its licence has been reviewed and accepted for use in Stagehand.
