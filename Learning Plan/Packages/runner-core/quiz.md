# `runner-core` course skill check

1. Why can cases override viewport but not headless mode?
2. What happens when a locator matches two elements?
3. Where do `before` and `after` waits run around an interaction?
4. How do `type` and `fill` differ?
5. Can one `assertValue` step return two soft failures?
6. What information does `StepExecutionError` preserve?
7. Why does a later missing variable prevent an earlier case step from running through `executeCase`?
8. Does `completed` accessibility scanning mean the page passed?
9. What is the difference between mapping and collecting accessibility findings?
10. Do 134 passing mocked-browser tests prove actual Chromium/axe assessment behaviour?
11. Practical task: trace a click step with after-waits and enabled scanning from dispatch to the next step.

## Answer key

1. Viewport belongs to an isolated context; headless mode is chosen when the shared browser process launches.
2. Resolution fails immediately because Stagehand requires one unique target.
3. Before waits finish first, then the interaction runs, then after waits finish.
4. `type` enters characters sequentially; `fill` sets the field value directly.
5. Yes: a soft value mismatch and an associated-label failure can share one step index.
6. Case ID, zero-based step index, action, and original cause.
7. The complete detached case is prepared before any step is dispatched.
8. No. It only means axe analysis resolved; violations and incomplete observations may remain.
9. Mapping transforms one trusted raw result without state; collection accumulates mapped findings for a caller-owned case history.
10. No. The suite uses doubles; successful real-browser assessments remain deferred.
11. A strong answer traces before waits, click, after waits, awaited scan/mapping/collection, and only then the next step, including failure points.
