# Plan engine

The plan engine owns Node-side plan loading and, later, plan interpretation. The initial implementation loads a plan JSON file and its referenced case files before execution.

Use the public package entry point:

```ts
import { loadPlanFile } from "@stagehand/plan-engine";

const result = await loadPlanFile("./plans/checkout-plan.json");
if (!result.valid) {
  for (const issue of result.issues) {
    console.error(issue.reference ?? issue.path, issue.message);
  }
}
```

The loader reads the plan, validates its schema, matches its relative case references, resolves each original reference, and reads only those case files. It checks path capitalization against on-disk names on every platform and rejects references whose spelling differs. It resolves path segments in order, following a link before interpreting a later `..`, so Windows and Linux use the same rule. It rejects a reference as soon as its resolved path leaves the plan folder. Each loaded case remains paired with its plan-reference index and path. It then uses `@stagehand/plan-schema` to validate the parsed bundle and case-ID uniqueness.

File read errors, invalid JSON, path safety issues, and schema issues are returned as a failure result instead of thrown. Case schema issue paths use `/caseFiles/{index}/...`; `reference` identifies the associated plan path. The plan and case documents are returned in the success result. The loader does not execute steps or start a browser.

Run the package build and tests with:

```sh
npm test --workspace @stagehand/plan-engine
```
