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

The initial `runner-core` slice starts one Chromium process per run, creates an isolated context and page per case, applies the agreed browser defaults and case viewport/time-zone overrides, coordinates shutdown with in-flight case setup and concurrent close calls, exposes unique locator resolution on each case session, runs ordered waits, navigates to absolute HTTP/HTTPS URLs, and performs direct clicks, sequential typing, direct field filling, option selection by value or visible label, and exact locale-aware text and HTML assertions with bounded locator/action timeouts. Navigation defaults to `domcontentloaded` and a 30-second timeout, with supported wait and timeout overrides. The step dispatcher runs validated `navigate`, `click`, `type`, `fill`, `selectOption`, `assertText`, and `assertHtml` steps in sequence; interaction steps run their `before`/`after` waits, and failures carry case ID and zero-based step index. The expanded runner-core suite passed all 62 tests in the dev container, including focused `assertHtml` tests. Other assertion handlers, result records, and case/run outcome aggregation remain outstanding. Refine this enabler into smaller tasks if implementation reveals independent workstreams.
