# M7 — Integration, verification, and Phase 1 review

**Estimate:** 2–3 person-days  
**Depends on:** M1–M6

## Tasks

- [x] Walk through one complete synthetic plan from JSON file to validated execution instructions and representative result data. The root-level `test:phase1-integration` command loads a plan/case through plan-engine, passes the loaded case to runner-core with a mocked browser, and validates the resulting in-memory document through result-model. The owner reported that it passed in the development container.
- [x] Confirm an invalid referenced case reports an actionable source path/reference before browser hand-off. The `test:phase1-integration` invalid-case fixture retains `/caseFiles/0/steps` and `cases/bad.json`; its Chromium launch mock remains unused. The owner reported that it passed in the development container.
- [x] Check that current plan/case/result examples, package documentation, Phase 1 lessons, action/configuration rules, data/reuse semantics, and error policies agree. Corrected stale statements about automatic scans and pre-browser run preparation; plan-file-to-runner orchestration, CLI integration, report-file writing, and real Chromium/axe coverage remain deferred.
- [ ] Validate the plan/result fixtures and documentation using the repository's available checks.
- [x] Review package boundaries and confirm contracts are owned in suitable packages with no circular dependency. The root-level `test:package-boundaries` check confirms the implemented packages have one root entry point, imports use that public entry point, declared dependencies match source imports, and dependency direction follows [TE-002](../Backlog/technical-enablers/te-002-reusable-node.js-typescript-package-structure.md).
- [ ] Verify a fresh contributor setup using the documented path and confirm CI covers the agreed baseline.
- [ ] Review agent/contributor instructions against actual runtime behaviour and remove unsupported security claims.
- [ ] Resolve or explicitly record deferred decisions, owners, and the phase/story where each will be revisited.
- [ ] Update the roadmap and backlog links/status notes to point to the completed contracts and supporting evidence.

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
