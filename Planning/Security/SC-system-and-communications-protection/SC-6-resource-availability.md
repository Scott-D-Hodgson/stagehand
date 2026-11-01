# SC-6 - Resource Availability

**Source:** [ITSG-33 Annex 3A, SC-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc6).

## Control definition

Protect resource availability by allocating assigned resources through priority, quotas, or defined safeguards.

**Organisation-defined parameter:** resources and allocation method. **Suggestion for review:** define CPU, memory, storage, and concurrency limits for shared runners; choose quotas and priorities based on service criticality.

## Supplemental guidance

Priority prevents lower-priority work from delaying important processing; quotas limit consumption. The control does not apply to components with only a single user/role.

## Related controls

From the [official SC-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language metaphor

Like setting time and supply limits at a shared workshop so one project cannot use everything.

## Stagehand and operator guidance

Maintainers should consider bounded plan execution and artifact sizes if the runner is shared. Operators should set CI job quotas, container limits, disk quotas, and concurrency policies; a dedicated single-user local setup may be outside this control’s stated scope.

## Control enhancements

None listed.

## Current repository context

The collector deduplicates findings, but raw automatic scan history accumulates for the session lifetime without pruning. No overall scan-history cap, DOM-evidence size limit, or case/run resource quota is implemented. Operator quotas and trusted synthetic test content remain important.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.** Resource limits are platform configuration, not currently evidenced here.
