# M12 — Variables, data sets, and shared steps

**Status:** Planned; task breakdown and estimate proposed  
**Estimate:** 6–10 focused human person-days  
**Depends on:** [M11](M11-configuration-and-localized-assertions.md)

## Objective

Make the agreed data and reuse contracts authorable through controlled forms.

## Tasks

- [ ] Create and edit supported variable definitions, localized values, named data sets, and the default data-set selection.
- [ ] Record environment-variable names without requesting or storing actual secret values.
- [ ] Create shared step groups and references using the supported one-level reuse contract.
- [ ] Explain missing variables, invalid data sets, shared-step references, and unsupported nesting through shared validation.
- [ ] Protect dependent references during rename/removal and include the resulting edits in recovery and conflict comparison.
- [ ] Verify representative documents through shared validation and import/export in both interface languages.

## Deliverables and completion evidence

Author a synthetic data-driven plan with an environment-variable reference and shared steps, round-trip it, and demonstrate actionable invalid-reference feedback without entering secrets.

Deliver the relevant forms, synthetic examples, documentation, and verification records. Add focused automated checks for data preservation and contract integration, plus browser checks for the affected user flows. Follow the localization and presentation baseline in [ADR-006](../Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md) and recovery baseline in [ADR-005](../Backlog/decisions/ADR-005-editor-draft-recovery.md).

## Incremental delivery

Suggested PR slices: variables and protected references; data sets; shared steps and dependency feedback.

## Open decisions and exclusions

Choose reference rename/removal behaviour before implementation. Loops, nested reuse, execution previews, and secret-value storage are outside scope.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
