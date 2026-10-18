# SC-6 - Resource Availability

**Source:** [ITSG-33 Annex 3A, SC-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect resource availability by allocating assigned resources through priority, quotas, or defined safeguards.

**Organisation-defined parameter:** resources and allocation method. **Suggestion for review:** define CPU, memory, storage, and concurrency limits for shared runners; choose quotas and priorities based on service criticality.

## Supplemental guidance

Priority prevents lower-priority work from delaying important processing; quotas limit consumption. The control does not apply to components with only a single user/role.

## Plain-language metaphor

Like setting time and supply limits at a shared workshop so one project cannot use everything.

## Stagehand and operator guidance

Maintainers should consider bounded plan execution and artifact sizes if the runner is shared. Operators should set CI job quotas, container limits, disk quotas, and concurrency policies; a dedicated single-user local setup may be outside this control’s stated scope.

## Control enhancements

None listed.

## Assessment status

**Planned / deployment-dependent; not verified.** Resource limits are platform configuration, not currently evidenced here.
