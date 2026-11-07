# M7 — Integration, verification, and Phase 1 review

**Estimate:** 2–3 person-days  
**Depends on:** M1–M6
**Status:** Complete

## Tasks

- [x] Walk through one complete synthetic plan from JSON file to validated execution instructions and representative result data. The root-level `test:phase1-integration` command loads a plan/case through plan-engine, passes the loaded case to runner-core with a mocked browser, and validates the resulting in-memory document through result-model. The owner reported that it passed in the development container.
- [x] Confirm an invalid referenced case reports an actionable source path/reference before browser hand-off. The `test:phase1-integration` invalid-case fixture retains `/caseFiles/0/steps` and `cases/bad.json`; its Chromium launch mock remains unused. The owner reported that it passed in the development container.
- [x] Check that current plan/case/result examples, package documentation, Phase 1 lessons, action/configuration rules, data/reuse semantics, and error policies agree. Corrected stale statements about automatic scans and pre-browser run preparation; plan-file-to-runner orchestration, CLI integration, report-file writing, and real Chromium/axe coverage remain deferred.
- [x] Validate the plan/result fixtures and documentation using the repository's available checks. The owner reported that the clean development-container verification passed with 297 tests: 2 package-boundary, 71 plan-schema, 17 plan-engine, 26 result-model, 179 runner-core, and 2 mocked integration tests. There were no failures or skips.
- [x] Review package boundaries and confirm contracts are owned in suitable packages with no circular dependency. The root-level `test:package-boundaries` check confirms the implemented packages have one root entry point, imports use that public entry point, declared dependencies match source imports, and dependency direction follows [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).
- [x] Verify a fresh contributor setup using the documented path and confirm CI covers the agreed baseline. The owner reported a clean development-container install and 297 passing checks; GitHub Actions has focused package, boundary, and mocked integration jobs.
- [x] Review agent/contributor instructions against actual runtime behaviour and remove unsupported security claims. Updated contributor, repository-map, backlog, and security-review language distinguishes implemented in-memory results and test doubles from deferred CLI, reports, and real-browser evidence.
- [x] Resolve or explicitly record deferred decisions, owners, and the phase/story where each will be revisited. The M7.6 map below links each remaining item to its owning backlog item or roadmap phase.
- [x] Update the roadmap and backlog links/status notes to point to the completed contracts and supporting evidence.

## Completion evidence

- An end-to-end walkthrough has no ambiguous contract handoffs.
- Baseline setup and contract checks pass in the supported environment.
- Phase 1 completion criteria in the [work plan overview](README.md#completion-criteria) are met or each exception is explicitly deferred with a rationale.
- A reviewer can trace each Phase 1 roadmap bullet to its contract, decision, example, and verification evidence.

## M7.1 synthetic package walkthrough

Run `npm run test:phase1-integration` from the repository root. The test deliberately uses each package's public interface:

```text
plan file -> plan-engine -> runner-core -> result-model
```

It proves the current package hand-offs with a mocked browser. It does not add plan-file-to-runner production orchestration, a CLI, report-file writing, or real Chromium/axe coverage.

## M7.2 preflight and source-location walkthrough

The companion invalid-case fixture shows the negative path. Plan-engine returns the case-schema location and original reference before the test passes anything to runner-core. Its browser-launch mock remains unused. This demonstrates the current package boundary; it does not claim that an unimplemented production orchestrator accepts a plan file directly.

## M7.3 contract and example concordance

The current examples use the v1 `version` property, `dataSets.default`, `sharedSteps`, supported action names, and result-model effective accessibility settings. The review confirmed that package and Phase 1 documentation distinguish direct scans from automatic eligible-step scans, and current caller-supplied run preparation from the still-deferred plan-file-to-runner path.

## M7.4 package-boundary audit

Run `npm run test:package-boundaries` from the repository root. The check covers the implemented packages: plan-schema, plan-engine, result-model, and runner-core. It verifies their single public root entry point and rejects an undeclared Stagehand dependency, a dependency in the wrong direction, or an import of another package's internal files. The owner reported that it passed in the development container. It does not redesign package responsibilities or add a shared orchestration package.

## M7.5 reproducible verification review

After a clean `npm ci`, run `npm ls --workspaces --depth=0` and `npm run test:phase1` from the repository root. The latter runs the package-boundary check, the four implemented package suites, and the mocked cross-package walkthrough. The owner reported that this clean development-container sequence passed: all seven workspaces resolved, and all 297 tests passed with no failures or skips. GitHub Actions runs those checks in focused jobs; plan-engine and runner-core also run on Windows. These checks use Playwright and axe doubles where browser behaviour is involved. They do not install Chromium or establish real-browser/axe coverage, which remains deferred until a project-owned test site exists.

## M7.6 Phase 1 close-out and hand-off

The completed Phase 1 foundation is reusable contracts, validated plan loading, sequential prepared-case coordination, browser actions/assertions, accessibility collection, error/outcome policy, and an in-memory result document. The table keeps the remaining work visible without treating it as an M7 failure.

| Deferred work | Owning backlog item or phase | Current boundary |
| --- | --- | --- |
| Production plan-file-to-runner orchestration, command-line arguments, direct process-environment lookup, and exit behaviour | [ATR-025](../Backlog/epics/E04-cli/stories/ATR-025.md), [ATR-017](../Backlog/epics/E02-execution-engine/stories/ATR-017.md), and [TE-008](../Backlog/technical-enablers/te-008-cli-contract.md) in Phase 3 | M7 proves the package hand-off only with a mocked test; runner APIs use caller-supplied inputs. |
| JSON report-file writing and later report formats | [ATR-021](../Backlog/epics/E03-results-and-reporting/stories/ATR-021.md) and [TE-009](../Backlog/technical-enablers/te-009-report-generators.md) in Phase 4 | `createResultDocument` returns validated data in memory; it does not write a file. |
| Parallel cases and interruption of active work | [ATR-014](../Backlog/epics/E02-execution-engine/stories/ATR-014.md) and [TE-004](../Backlog/technical-enablers/te-004-execution-context-and-failure-policy.md) | Cases run sequentially; cancellation prevents later work from starting. |
| Real Chromium/axe assessment, including frames and cleanup | [TE-010](../Backlog/technical-enablers/te-010-axe-integration.md) | Deferred until a project-owned test site is designed and built. |
| Local editor behaviour | [Phase 2](../Roadmap/Phase-2-visual-authoring/README.md) | The web workspace remains a scaffold. |
| Loops and richer variable values | [ATR-018](../Backlog/epics/E02-execution-engine/stories/ATR-018.md) | Deferred beyond the MVP. |
