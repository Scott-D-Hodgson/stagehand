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

The package keeps [`src/index.ts`](src/index.ts) as its single public entry point. Its implementation is grouped by responsibility: [`src/validation/`](src/validation/) contains schema and semantic validation, [`src/references/`](src/references/) contains case-reference matching, and [`src/variables/`](src/variables/) contains variable resolution and case preparation. [`src/json.ts`](src/json.ts) holds the small JSON-object and JSON Pointer helpers shared across those areas. These internal modules are not additional package entry points; consumers should continue importing from `@stagehand/plan-schema`.

See the [plan example](examples/checkout-plan.json), its [referenced case](examples/cases/sign-in.json), and the [action and assertion example](examples/cases/action-contract.json).

Plan defaults are inherited by cases. A case may override its viewport, time zone, and accessibility settings, and explicit CLI settings will take precedence when execution is implemented. Headless mode is run-wide because it is selected when Chromium launches; locale is also run-scoped. Browser time zone is a separate setting. A plan, case, or case step may contain named, non-empty, case-sensitive variable definitions. Each definition has a required text, number, or boolean `default` value and optional locale values of the same type. A case step may use a whole-field `{ "var": "name" }` reference for `navigate.url`, `type.text`, `fill.value`, `selectOption.value` or `label`, and assertion expected/associated-label values. The public `resolveVariable` helper resolves an ordinary scalar definition from step, case, or plan scope, then selects its canonical locale value or default. `prepareCaseStep` creates a detached step with those supported references replaced and scalars converted to text for their text destinations. `prepareCase` prepares every step, stops at the first preparation error, and validates the completed detached case. None of these helpers reads environment values or starts a browser.

The initial browser type is `chromium`, representing Playwright-managed Chromium. Other browser types are rejected by the plan and case schemas until support is added. The agreed defaults are headless mode, a 1280 by 720 CSS-pixel viewport, the `UTC` time zone, and the run-wide `en-CA` locale. Headless mode and locale cannot be overridden by a case. Accessibility scanning and failing on violations are both disabled by default; plan settings can be overridden by case settings. The schemas publish these defaults as annotations but do not insert them into validated input. Applying effective defaults belongs to runner/editor consumers.

The schemas accept optional `defaults.accessibility.tags` on plans and `settings.accessibility.tags` on cases. Values are arrays of unique, case-sensitive tag strings from the pinned axe-core 4.14.0 catalogue; unknown tags, duplicates, wrong types, whitespace changes, and incorrectly cased tags are rejected. Validation leaves the input unchanged and does not enable scanning or apply settings inheritance.

| Case tag value | Agreed effective scope for future execution |
| --- | --- |
| Omitted, including an omitted accessibility/settings object | Inherit the plan list. If the plan also omits tags, use axe defaults without tag restriction. |
| `[]` | Replace the plan list with no tag restriction, using axe defaults. |
| Non-empty list | Replace the whole plan list; assess rules matching any selected tag. |

At plan scope, omitted tags or `[]` mean axe defaults without a tag filter. This does not force-enable experimental/disabled rules. Tag configuration is independent of `enabled` and `failOnViolation`, and different from the rule `tags` on findings. Exact CLI flags and scanner application remain future work under [TE-010](../../Planning/Backlog/technical-enablers/te-010-axe-integration.md#accepted-scan-scope-option).

The [checkout plan](examples/checkout-plan.json) selects `wcag2a` and `wcag2aa`. Its sign-in case omits tags (inheritance), while the [action example](examples/cases/action-contract.json) explicitly supplies `[]` (clearing). Both cases still disable scanning. The two standalone schemas each contain the same `$defs.axeTag` inventory, collected from axe-core 4.14.0 `getRules()`, including tags on disabled rules. When upgrading the pinned engine, refresh both inventories and review the accepted tag set. Plan-schema does not load axe or Playwright at runtime.

The focused `plan-schema` package suite has 56 passing tests in the development container. Plan-engine's dependent build/check previously passed with 14 tests passing and 3 symlink tests skipped because that Windows environment could not create their links. The current internal restructuring was verified through the unchanged public package entry point; it does not add plan behaviour.

For manual inspection after installing the workspace dependencies, run this from the repository root using the installed engine:

```sh
node --input-type=module -e "import axe from 'axe-core'; console.log(axe.version); console.log(JSON.stringify([...new Set(axe.getRules().flatMap(rule => rule.tags))].sort(), null, 2));"
```

Review that version and sorted inventory against both schemas' `$defs.axeTag.enum` and their version comments. This command inspects the installed engine; it does not discover newer releases or regenerate files. Existing tests check that the two schema inventories agree, while their agreement with all 147 installed-engine tags was checked separately for this slice. That one-off comparison is not a persistent drift-monitoring check.

An upstream tag-update notification and catalogue-synchronisation mechanism is proposed under [TE-022](../../Planning/Backlog/technical-enablers/te-022-axe-tag-catalogue-update-detection.md). Until implemented, engine upgrades still require the manual inventory review/refresh described above.

The case schema validates the initial actions (`navigate`, `click`, `type`, `fill`, `selectOption`) and assertions (`assertText`, `assertHtml`, `assertValue`), their required fields, locator shape, bounded wait-list item shape, timeout/delay values, variable-definition and reference shapes, and absolute HTTP/HTTPS navigation URLs. A reference is permitted only in the agreed action and assertion fields; locators, waits, settings, and other fields remain literal. Relative literal navigation URLs are not supported because there is no `baseURL` setting; adding relative URL support is deferred for future consideration. Runtime checks parse literal navigation URLs and require a host, and canonicalize expected-value and variable locale keys while rejecting invalid or duplicate-equivalent keys. Validation does not execute actions, resolve variables, determine whether a locator matches a page, apply retries, or guarantee that the plan is ready to run. The matcher does not read or parse case files or enforce canonical filesystem containment. `validatePlanBundle` checks parsed case schemas and duplicate case IDs, but not variable resolution or execution readiness. The Node-side `plan-engine` package handles loading and filesystem containment; remaining execution checks belong to later implementation milestones.

Third-party licence information for Ajv and its dependencies is recorded in the repository's [third-party notices](../../THIRD-PARTY-NOTICES.md). The transitive dependency `fast-uri` uses BSD-3-Clause; its licence has been reviewed and accepted for use in Stagehand.
