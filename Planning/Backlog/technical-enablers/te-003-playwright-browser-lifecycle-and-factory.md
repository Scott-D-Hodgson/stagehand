# TE-003 — Playwright browser lifecycle and factory

**Status:** In Progress
**Priority:** Must  
**Related stories:** ATR-003, ATR-008, ATR-013

## Objective

Implement Playwright browser selection, context settings, action handlers, lifecycle, and cleanup within the runner architecture. No separate adapter package is required while Playwright is the only supported browser automation library.

## Acceptance criteria

- The implementation is documented and version-controlled.
- Relevant unit/integration checks verify the intended behaviour.
- Dependent stories can use the capability through a documented contract.
- Failure modes and security implications are addressed where relevant.

## Notes

The initial `runner-core` slice starts one Chromium process per run, creates an isolated context and page per case, applies the agreed browser defaults and case viewport/time-zone overrides, coordinates shutdown with in-flight case setup and concurrent close calls, exposes unique locator resolution on each case session, runs ordered waits, navigates to absolute HTTP/HTTPS URLs, and performs direct clicks, sequential typing, direct field filling, option selection by value or visible label, and exact locale-aware text, HTML, and input-value assertions with bounded locator/action timeouts. Navigation defaults to `domcontentloaded` and a 30-second timeout, with supported wait and timeout overrides. The step dispatcher runs validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, `assertHtml`, and `assertValue` steps in sequence; interaction steps run their `before`/`after` waits, and failures carry case ID and zero-based step index. The runner-core build and all 81 tests passed locally on Windows with the pinned Node.js/npm versions. Tests mock Playwright; dev-container, real-browser, and current CI verification of the `assertValue` slice remain outstanding. Axe scanning, result records, and case/run outcome aggregation remain outstanding. Refine this enabler into smaller tasks if implementation reveals independent workstreams.

Runner-core also exports a pure accessibility settings resolver and accepts run/case accessibility settings, exposing each case's effective snapshot as `session.accessibility`. Default/override semantics and copied arrays are verified by seven new tests; the expanded build and all 88 tests passed locally on Windows. Settings resolution does not run axe or apply M6 outcome policy.
