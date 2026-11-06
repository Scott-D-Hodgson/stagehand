# M7 — Integration, verification, and Phase 1 review

**Estimate:** 2–3 person-days  
**Depends on:** M1–M6

## Tasks

- [x] Walk through one complete synthetic plan from JSON file to validated execution instructions and representative result data. The root-level `test:phase1-integration` command loads a plan/case through plan-engine, passes the loaded case to runner-core with a mocked browser, and validates the resulting in-memory document through result-model. The owner reported that it passed in the development container.
- [ ] Confirm plan and referenced-case validation completes before browser launch and reports actionable source locations.
- [ ] Check that schema, examples, action/configuration rules, data/reuse semantics, and error policies agree.
- [ ] Validate the plan/result fixtures and documentation using the repository's available checks.
- [ ] Review package boundaries and confirm contracts are owned in suitable packages with no circular dependency.
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
