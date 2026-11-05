# Phase 1 skill check

1. Why are package boundaries useful in a monorepo?
2. What is the difference between a JSON Schema and a runtime validator?
3. Why does plan loading check referenced files before browser startup?
4. What resource boundary keeps case browser state isolated?
5. How is an assertion different from an action?
6. What happens when a variable definition is overridden at a narrower scope?
7. Why must a cleanup failure not replace the primary execution failure?
8. How does a configured accessibility finding differ from an axe scan execution error?
9. What is the M6 run-outcome precedence?
10. What does `determineCaseOutcome` deliberately not do?
11. Why does `summarizeRunOutcome` receive no-start cancellation or operational failure separately from case outcomes?
12. What does active-case timing include and exclude?
13. What does an `AbortSignal` do in the current sequential-work helper?
14. When execution and cleanup both fail, which problem is primary?
15. What must `executePlanRun` do before starting Chromium?
16. What does `createResultDocument` do before it returns a result?

## Answer key

1. They give related responsibilities a clear home and keep dependencies understandable.
2. The schema is the shared document contract; the runtime validator applies that contract to actual data.
3. Early checks produce clear errors and avoid opening a browser for a plan that cannot run.
4. A separate browser context for each case.
5. An action changes or navigates the page; an assertion checks an expected condition and records pass or failure.
6. The narrower definition replaces the whole inherited definition before its locale or default value is selected.
7. The primary failure explains why execution failed; cleanup trouble is separate secondary evidence.
8. A configured finding can fail a case while eligible steps continue; a scan execution error is an operational error and stops affected work safely.
9. `error`, then `cancelled`, then `failed`, then `passed`.
10. It does not execute a browser, aggregate run outcomes, or create result JSON.
11. No completed case exists to carry that information, but it still determines the run outcome.
12. It includes step dispatch, waits, and automatic scans; it excludes preflight, browser/session setup, queue time, and cleanup.
13. It prevents the next item from starting when cancellation was requested; it does not interrupt an item already running.
14. The original execution failure remains primary; the cleanup failure is retained as secondary context.
15. It must prepare every selected case so a preflight problem does not open a browser.
16. It redacts supplied protected values and validates the result against the result-model contract.
