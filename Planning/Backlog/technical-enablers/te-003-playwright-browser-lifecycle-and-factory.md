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

The initial `runner-core` slice starts one Chromium process per run, creates an isolated context and page per case, applies the agreed browser defaults and case viewport/time-zone overrides, coordinates shutdown with in-flight case setup and concurrent close calls, exposes unique locator resolution on each case session, runs ordered wait lists with bounded locator/state waits and fixed delays, navigates to absolute HTTP/HTTPS URLs, and performs direct clicks with a bounded locator/actionability timeout. Navigation defaults to `domcontentloaded` and a 30-second timeout, with supported wait and timeout overrides. The initial step dispatcher runs validated `navigate` and `click` steps in sequence, including click `before`/`after` waits, and wraps failures with case ID and zero-based step index. Other action handlers, assertion execution, result records, and case/run outcome aggregation remain outstanding. Refine this enabler into smaller tasks if implementation reveals independent workstreams.
