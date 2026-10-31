# TE-022 - Detect axe tag-catalogue updates and schema drift

**Status:** Proposed

**Priority:** Should

**Related stories:** [ATR-004](../epics/E01-plan-definition/stories/ATR-004.md), [ATR-019](../epics/E02-execution-engine/stories/ATR-019.md)

## Objective

Provide a repeatable way to discover upstream axe releases and tag changes, compare them with Stagehand's pinned engine and schema catalogues, and prepare reviewed updates. New tags should become visible to maintainers without silently accepting tags unsupported by the engine Stagehand actually runs.

## Context

The plan and case schemas each publish a standalone tag inventory derived from axe-core 4.14.0. Unknown tags are rejected. Keeping the inventories unchanged while upgrading the engine could reject newly supported tags or retain tags the new engine no longer recognises. Release awareness and checking the installed version are separate needs: an installed-version check alone cannot discover a newer upstream release.

The current integration and schema inventory are documented under [TE-010](te-010-axe-integration.md#accepted-scan-scope-option). The [plan-schema package guide](../../../packages/plan-schema/README.md) describes manual inventory inspection and review expectations; there is no checked-in refresh generator yet. This enabler proposes a maintenance mechanism; no monitor, alert, generator, or enforcement check is implemented by recording it.

## Acceptance criteria

- A documented trigger can discover a newer published axe engine/adapter release and surface it to a maintainer. Record the checked versions and distinguish a successful check with no changes from a failed or unavailable check.
- Compare the candidate engine's full rule-tag inventory with the inventory for Stagehand's pinned engine. Report added and removed tags, including tags associated with disabled rules; report a version change even when the tag set is unchanged.
- A repeatable check detects differences between both exported schema inventories and the engine version resolved by Stagehand's lockfile. Identify each stale schema rather than checking only whether the two schemas agree with one another.
- Provide a documented command or generation step to refresh both inventories deterministically, with engine-version provenance and an inspectable diff.
- Keep dependency/lockfile changes, tag inventories, relevant examples/tests, and licence/notices review together in the proposed update. Require normal PR review before adoption; detection must not silently change scan scope or accept candidate tags while the older engine remains pinned.
- Keep normal validation and test execution local and reproducible. Upstream checks run through an explicit maintenance trigger; plan validation must not query a network service or load the axe engine at runtime.
- Document ownership, trigger/cadence, notification destination, and failure handling once the mechanism is selected. Network failures must not be reported as an up-to-date catalogue.

## Verification

- Use synthetic old/new catalogues to demonstrate added tags, removed tags, unchanged tags across a version change, and deterministic regeneration.
- Demonstrate detection when only the plan schema is stale, only the case schema is stale, and both schemas agree but differ from the pinned engine.
- Demonstrate an unavailable upstream source without falsely reporting success or modifying dependencies/schemas.
- Demonstrate that a candidate update remains reviewable and that ordinary validation works without network access.

## Open implementation choices

- Reuse dependency-update tooling or build a dedicated release/catalogue check.
- Choose a manual, scheduled, or dependency-PR trigger, or a combination.
- Choose whether to surface updates through a job summary, issue, or draft PR; no external notification is authorised by this backlog entry.
- Decide which checks should become required in CI and when.

## Scheduling and boundaries

This is an unscheduled maintenance candidate, separate from the current M4 scan-tag schema slice. It does not block recording that slice as implemented and does not replace scanner execution tests. Preserve the agreed execution contract: omitted/empty effective tags leave axe defaults unrestricted by tags, and selected tags scope the assessment. Schemas validate the configuration, but effective settings resolution and scanning remain unimplemented.
