# M4 — Browser configuration, actions, and assertions

**Status:** Complete
**Original estimate:** 3–5 person-days (not actual effort)
**Depends on:** M2, M3

## Objective

Defined and implemented the initial browser lifecycle, actions, assertions, and optional accessibility assessment at the case-session boundary.

## Tasks completed

- Encoded browser defaults, locator shapes, waits, action inputs, assertion locale rules, timeout constraints, and accessibility settings in shared schemas and fixtures.
- Implemented one Chromium process per run, isolated case contexts/pages, coordinated startup/cleanup, unique locators, ordered waits, and action dispatch.
- Implemented navigation, click, sequential typing, fill, option selection, and exact text/HTML/value assertions with hard/soft behaviour and optional always-soft label checks.
- Implemented accessibility defaults/overrides, explicit scans, pure finding mapping, per-case collection, and awaited scans after eligible completed steps.
- Extended result-model accessibility evidence and documented reviewed Playwright/axe dependencies and notices.

## Decisions made

- Targeted Windows with Playwright-managed Chromium; defaulted to headless, 1280 × 720 viewport, UTC time zone, and run-wide `en-CA` locale.
- Used absolute HTTP/HTTPS navigation, a 30-second default action timeout, bounded waits, exact role/label names, and immediate ambiguity failure.
- Made assertions exact and case-sensitive, hard by default; used default expected values with locale overrides and zero-based step positions.
- Disabled accessibility scanning and failure-on-violation by default. Collected findings by exact URL/description and node HTML, retaining first-observed evidence; M6 owns outcome effects.
- Accepted the axe dependency obligations recorded in [TE-010](../Backlog/technical-enablers/te-010-axe-integration.md) and pinned dependency notices.

## Deferred work

- Real Chromium/axe assessments, frames, tags, repeated scans, and cleanup remain deferred until a project-owned test site exists; site design and location were not selected.
- Linux runner support, additional browsers, relative navigation/base URLs, richer assertions, and additional browser actions remain later work, including [ATR-042](../Backlog/epics/E02-execution-engine/stories/ATR-042.md).
- M5 later added protected-value handling and M6 supplied result adaptation/outcome policy. M4's original raw-history descriptions must not be treated as current redaction guarantees.

## Completion evidence

- At checkout `fe539f7`, agent-run verification in the existing Linux development container passed `npm ci`, seven-workspace resolution, and 209 tests: 39 plan-schema, 17 plan-engine, 22 result-model, and 131 runner-core, with no failures or skips.
- The owner confirmed passing CI on every PR through automatic-assessment PR #50; individual remote runs were not inspected by the agent.
- Public-entry tests and browser/adapter doubles cover lifecycle, actions, assertions, settings, scan cadence, mapping, collection, and failure paths. They do not establish actual Chromium/axe coverage.
- M7 subsequently recorded the expanded 297-test clean development-container verification.

## Learning plan reference

[Browser lifecycle](../../Learning%20Plan/Phase%201/Lessons/07-browser-lifecycle.md), [page interactions](../../Learning%20Plan/Phase%201/Lessons/08-page-interactions.md), and [assertions and accessibility](../../Learning%20Plan/Phase%201/Lessons/09-assertions-accessibility.md).

## Supporting detail

Detailed contracts remain in [ATR-003](../Backlog/epics/E01-plan-definition/stories/ATR-003.md), [TE-003](../Backlog/technical-enablers/te-003-playwright-browser-lifecycle-and-factory.md), [TE-010](../Backlog/technical-enablers/te-010-axe-integration.md), and the runner-core package documentation. Locators use up to three attempts with one-second gaps inside the shared timeout. Direct methods do not imply automatic collection; eligible step execution owns that cadence.
