# Stagehand example journeys

These short journeys make the intended user experience concrete across the editor, plan files, runner, and reports. They are planning examples, not extra requirements beyond the linked stories. Use synthetic data and an authorized disposable application. Building or supplying a local demo application is deferred; the journeys do not assume that fixture exists yet.

## Journey 1 — Author and prepare a localized test

**User:** A non-technical tester using the Vue editor.

1. Open the statically hosted editor in current stable desktop Chrome or Edge on Windows, then upload/import a plan and its referenced case JSON files. Download/export the files after editing. An already-open editor can continue offline.
2. Use forms to set browser culture, plan/case configuration, variables, a reusable shared step, and named input values.
3. Provide expected assertion values for two cultures so the case can check the value appropriate to the session culture.
4. See validation feedback, correct any issues, and export the user-owned files.

**Good outcome:** The tester can prepare and validate the plan without hand-editing JSON or uploading files to a Stagehand service.

## Journey 2 — Run the plan and inspect raw results

**User:** The developer dogfooding the runner, or a test operator.

1. Run the exported plan on the supported Windows/Playwright-managed Chromium baseline against an authorized, disposable application.
2. Let independent cases run with the configured concurrency (five isolated Playwright contexts in one shared browser instance by default), then inspect run and case durations and outcomes in the raw JSON result.
3. If an action or assertion fails, inspect the step diagnostic in the JSON result.
4. Repeat with the other culture and confirm that the localized expected value matches the session configuration.

**Good outcome:** The operator can identify which case passed or failed, how long it took, what failed, and where to find diagnostics without a Stagehand-managed report viewer.

## Journey 3 — Handle a missing secret safely

**User:** A test operator preparing a run that references an environment variable.

1. Start a plan while a required environment variable is absent.
2. Receive a clear error naming the missing variable without exposing a value.
3. Confirm that no browser was started; provide the variable through the operator's environment and retry.

**Good outcome:** Configuration problems are caught before browser launch, and secret values remain outside plan files and reports.

## Future polish

A Vue-based report viewer is a later candidate, intended as a local-first way to browse run summaries, case/step details, diagnostics, and any later screenshot artifacts. The MVP emits raw JSON; report conversion and the viewer are later work.
