# SC-32 - Information System Partitioning

**Source:** [ITSG-33 Annex 3A, SC-32](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc32).

## Control definition

Partition the system into assigned components residing in separate physical domains/environments under defined conditions for physical separation.

**Organisation-defined parameters:** components and separation conditions. **Suggestion for review:** separate components handling different sensitivity levels or critical functions where risk analysis supports it.

## Supplemental guidance

Partitioning is part of defence in depth. Separation can range from distinct racks to rooms or geographic locations. Managed interfaces restrict network access and information flow between partitions; security categorization can guide separation.

## Related controls

From the [official SC-32 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc32), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SC-2](SC-2-application-partitioning.md), [SC-3](SC-3-security-function-isolation.md), [SC-7](SC-7-boundary-protection.md).

## Plain-language metaphor

Like fire doors that divide a building into sections so a problem in one area does not spread everywhere.

## Stagehand and operator guidance

Operators can isolate CI runners, browser execution, artifact storage, and sensitive targets using separate networks or environments. Maintainers should document expected boundaries and required connections.

## Control enhancements

None listed.

## Assessment status

**Planned / deployment-dependent; not verified.**
