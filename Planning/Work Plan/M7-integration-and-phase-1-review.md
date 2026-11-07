# M7 — Integration, verification, and Phase 1 review

**Status:** Complete
**Original estimate:** 2–3 person-days (not actual effort)
**Depends on:** M1–M6

## Objective

Closed Phase 1 by demonstrating the reusable package hand-offs, checking reproducible setup and boundaries, reconciling documentation, and explicitly handing deferred work to later phases.

## Tasks completed

- Added the synthetic plan-engine → runner-core → result-model walkthrough using public package interfaces and a mocked browser.
- Added invalid-case preflight evidence retaining source reference/schema location before browser hand-off.
- Reconciled examples, package documentation, learning guidance, configuration/data rules, and execution policy.
- Added the package-boundary audit and verified the clean-install baseline and focused CI configuration.
- Reviewed contributor/agent claims and updated roadmap/backlog status with explicit deferred ownership.

## Decisions made

- Accepted mocked integration as evidence of package hand-offs, without claiming production plan-file orchestration or actual browser coverage.
- Kept in-memory results distinct from report-file output and runtime-enforced isolation distinct from written agent guidance.
- Closed Phase 1 with explicit deferrals rather than describing later CLI/editor/reporting work as implemented.

## Deferred work

- The hand-off map below retains the backlog/phase ownership and exact implementation boundaries for remaining work.

<a id="m75-reproducible-verification-review"></a>

## Completion evidence

- The owner reported a clean development-container sequence of `npm ci`, `npm ls --workspaces --depth=0`, and `npm run test:phase1`, resolving all seven workspaces.
- All 297 checks passed with no failures or skips: 2 package-boundary, 71 plan-schema, 17 plan-engine, 26 result-model, 179 runner-core, and 2 mocked integration tests.
- The invalid-case fixture retains `/caseFiles/0/steps` and `cases/bad.json`; its Chromium launch mock remains unused.
- The boundary check verifies public entries, declared dependencies, and allowed direction for the four implemented packages. GitHub Actions has focused package, boundary, and integration jobs; plan-engine and runner-core also run on Windows.
- The [Phase 1 completion criteria](README.md#completion-criteria) are satisfied with the explicitly recorded deferrals. Individual remote workflow runs were not newly audited in this documentation cleanup.

## Learning plan reference

[Phase integration review](../../Learning%20Plan/Phase%201/Lessons/13-integration-review.md).

## Supporting detail

<a id="m76-phase-1-close-out-and-hand-off"></a>

### M7.6 Phase 1 close-out and hand-off

The completed Phase 1 foundation is reusable contracts, validated plan loading, sequential prepared-case coordination, browser actions/assertions, accessibility collection, error/outcome policy, and an in-memory result document. The table keeps the remaining work visible without treating it as an M7 failure.

| Deferred work | Owning backlog item or phase | Current boundary |
| --- | --- | --- |
| Production plan-file-to-runner orchestration, command-line arguments, direct process-environment lookup, and exit behaviour | [ATR-025](../Backlog/epics/E04-cli/stories/ATR-025.md), [ATR-017](../Backlog/epics/E02-execution-engine/stories/ATR-017.md), and [TE-008](../Backlog/technical-enablers/te-008-cli-contract.md) in Phase 3 | M7 proves the package hand-off only with a mocked test; runner APIs use caller-supplied inputs. |
| JSON report-file writing and later report formats | [ATR-021](../Backlog/epics/E03-results-and-reporting/stories/ATR-021.md) and [TE-009](../Backlog/technical-enablers/te-009-report-generators.md) in Phase 4 | `createResultDocument` returns validated data in memory; it does not write a file. |
| Parallel cases and interruption of active work | [ATR-014](../Backlog/epics/E02-execution-engine/stories/ATR-014.md) and [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) | Cases run sequentially; cancellation prevents later work from starting. |
| Real Chromium/axe assessment, including frames and cleanup | [TE-010](../Backlog/technical-enablers/te-010-axe-integration.md) | Deferred until a project-owned test site is designed and built. |
| Local editor behaviour | [Phase 2](../Roadmap/Phase-2-visual-authoring/README.md) | The web workspace remains a scaffold. |
| Loops and richer variable values | [ATR-018](../Backlog/epics/E02-execution-engine/stories/ATR-018.md) | Deferred beyond the MVP. |
