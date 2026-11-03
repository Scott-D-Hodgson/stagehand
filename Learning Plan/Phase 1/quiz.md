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
