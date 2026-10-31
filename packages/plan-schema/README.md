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
does not determine whether steps can run.

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
Node-side loader must resolve the original plan reference for its containment
check and read the target it checked; it must not rely on the normalized match
key for filesystem safety.

After matching and parsing the referenced files in plan order, validate the
complete bundle:

```ts
import { validatePlanBundle } from "@stagehand/plan-schema";

const result = validatePlanBundle(plan, parsedCases);
if (!result.valid) {
  for (const issue of result.issues) {
    console.error(issue.path, issue.keyword, issue.message);
  }
}
```

`validatePlanBundle` checks the plan, requires one parsed case per plan
reference, validates each case schema, and checks case IDs are unique within
the plan. Supply parsed cases in the same order as `plan.cases`. Case-file
schema issue paths use `/caseFiles/{index}/...`, where the index maps back to
the corresponding plan reference. This function does not perform path
matching, file loading, JSON parsing, or canonical filesystem containment.

Run the package checks with `npm test --workspace @stagehand/plan-schema`. This builds the package and runs Node's built-in test runner against the public package entry point. The build emits JavaScript and TypeScript declarations under the ignored `dist/` folder.

See the [plan example](examples/checkout-plan.json), its [referenced case](examples/cases/sign-in.json), and the [action and assertion example](examples/cases/action-contract.json).

Plan defaults are inherited by cases. A case may override its viewport, time zone, and accessibility settings, and explicit CLI settings will take precedence when execution is implemented. Headless mode is run-wide because it is selected when Chromium launches; locale is also run-scoped. Browser time zone is a separate setting. Variables are represented as JSON objects, with value interpretation and external secret references to be defined with data handling.

The initial browser type is `chromium`, representing Playwright-managed Chromium. Other browser types are rejected by the plan and case schemas until support is added. The agreed defaults are headless mode, a 1280 by 720 CSS-pixel viewport, the `UTC` time zone, and the run-wide `en-CA` locale. Headless mode and locale cannot be overridden by a case. Accessibility scanning and failing on violations are both disabled by default; plan settings can be overridden by case settings. The schemas publish these defaults as annotations but do not insert them into validated input. Applying effective defaults belongs to runner/editor consumers.

The case schema validates the initial actions (`navigate`, `click`, `type`, `fill`, `selectOption`) and assertions (`assertText`, `assertHtml`, `assertValue`), their required fields, locator shape, bounded wait-list item shape, timeout/delay values, and absolute HTTP/HTTPS navigation URLs. Relative navigation URLs are not supported because there is no `baseURL` setting; adding relative URL support is deferred for future consideration. Runtime checks parse navigation URLs and require a host, and canonicalize expected-value locale keys while rejecting invalid or duplicate-equivalent keys. Validation does not execute actions, determine whether a locator matches a page, apply retries, or guarantee that the plan is ready to run. The matcher does not read or parse case files or enforce canonical filesystem containment. `validatePlanBundle` checks parsed case schemas and duplicate case IDs, but not variable values or execution readiness. The Node-side `plan-engine` package handles loading and filesystem containment; remaining execution checks belong to later implementation milestones.

Third-party licence information for Ajv and its dependencies is recorded in the repository's [third-party notices](../../THIRD-PARTY-NOTICES.md). The transitive dependency `fast-uri` uses BSD-3-Clause; its licence has been reviewed and accepted for use in Stagehand.
