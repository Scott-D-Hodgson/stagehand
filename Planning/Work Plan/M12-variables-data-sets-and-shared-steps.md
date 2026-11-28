# M12 — Variables, data sets, and shared steps

**Status:** In progress; estimate proposed
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

The current M12.1 work provides plan-variable defaults, dedicated Variable
pages, and localized literal values for Text, Number, and Boolean variables.
Existing matching references in Cases and shared Steps are updated on an
unambiguous Plan-variable rename; removal is blocked while matches remain.
Narrower definitions conservatively block an ambiguous rename. The web tests,
type-check, and build passed in the development container for this protection
slice. Navigate, Type, Fill, and Select option Steps now author Plan-variable
references, and Variable pages list matching Case Steps. Navigate accepts Text
and environment variables and stores its HTTP or HTTPS protocol separately
from the address; Boolean and Number variables cannot be used there. Step cloning now requires
confirmation and copies complete Step data. The current web suite passed 88
tests, type-check, and build; schema, runner-core, and plan-engine checks also
passed for the Navigate contract update, and the owner reported that all tests
look good. Other supported
Step fields and milestone-wide browser, recovery, conflict, and round-trip
evidence remain open. The Assert Text default expectation now supports a
Plan-variable reference with a locale-aware Case-card preview; assertion
locale overrides remain literal in the editor. The development-container web
suite passed 88 tests, type-check, and build for this slice; the owner accepted
the card presentation. Variable authoring for Assert HTML, Assert Value,
associated labels, and individual assertion locale overrides remains open.

1. **Variables and protected references:** author plan-level variable
   definitions, their default localized literal values, and default
   environment-variable references. Make supported Step fields able to select
   those variables. Case- and Step-level variable-definition authoring follows
   in a later M12 slice.
2. **Data sets:** author named data sets and the default selection.
3. **Shared steps and dependency feedback:** author one-level shared groups and
   references, then present their validation and dependency feedback.
4. **Integration evidence:** verify the completed M12 surface through recovery,
   portable ZIP export/import, and both interface languages.

## Decisions made

- Renaming a referenced variable updates each supported reference
  automatically.
- Removing a referenced variable is blocked until the author resolves its
  references; the editor identifies the affected references in the removal
  flow.
- The first protected-value UI authors an environment-variable name for a
  variable's default value only. Localized protected values are deferred until
  a concrete authoring need is identified.

## Open decisions and exclusions

Decide the data-set presentation and shared-step editor presentation before
their respective slices. Loops, nested reuse, execution previews, and
secret-value storage are outside scope.

Estimates use the assumptions in the [Phase 2 overview](Phase-2-visual-authoring.md); re-estimate before starting. Tasks remain unverified until completion evidence is recorded.
