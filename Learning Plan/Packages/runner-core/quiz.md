# `runner-core` course skill check

1. Why can cases override viewport but not headless mode?
2. What happens when a locator matches two elements?
3. Where do `before` and `after` waits run around an interaction?
4. How do `type` and `fill` differ?
5. Can one `assertValue` step return two soft failures?
6. What additional location information is retained when an expanded shared step fails?
7. Why does a later missing variable or an unknown selected data set prevent an earlier case step from running through `executeCase`?
8. Does `completed` accessibility scanning mean the page passed?
9. What is the difference between mapping and collecting accessibility findings?
10. Do 137 passing mocked-browser tests prove actual Chromium/axe assessment behaviour?
11. How does `executeCase` receive a protected environment value, and which evidence does it redact for that call?
12. What does `prepareRunForExecution` do, and what deliberately does it not do?
13. Practical task: trace a click step with after-waits and enabled scanning from dispatch to the next step.

## Answer key

1. Viewport belongs to an isolated context; headless mode is chosen when the shared browser process launches.
2. Resolution fails immediately because Stagehand requires one unique target.
3. Before waits finish first, then the interaction runs, then after waits finish.
4. `type` enters characters sequentially; `fill` sets the field value directly.
5. Yes: a soft value mismatch and an associated-label failure can share one step index.
6. `StepExecutionError` retains the case ID, zero-based expanded-step index, action, original cause, calling case-step index, shared-group ID, and inner-step index. Soft assertion failures retain the same shared-step location information.
7. The complete detached case is prepared before any step is dispatched.
8. No. It only means axe analysis resolved; violations and incomplete observations may remain.
9. Mapping transforms one trusted raw result without state; collection accumulates mapped findings for a caller-owned case history.
10. No. The suite uses doubles; successful real-browser assessments remain deferred.
11. The caller supplies an environment map; `executeCase` does not read `process.env`. It redacts returned soft failures and retained automatic accessibility findings and scan history. A direct scan can redact when its caller explicitly supplies protected values.
12. It prepares a caller-supplied list of cases using fixed inputs and returns detached prepared steps. It does not launch a browser, execute a step, read `process.env`, or provide full plan orchestration.
13. A strong answer traces before waits, click, after waits, awaited scan/mapping/collection, and only then the next step, including failure points.
