# SC-32 - Information System Partitioning

**Source:** [ITSG-33 Annex 3A, SC-32](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Partition the system into assigned components residing in separate physical domains/environments under defined conditions for physical separation.

**Organisation-defined parameters:** components and separation conditions. **Suggestion for review:** separate components handling different sensitivity levels or critical functions where risk analysis supports it.

## Supplemental guidance

Partitioning is part of defence in depth. Separation can range from distinct racks to rooms or geographic locations. Managed interfaces restrict network access and information flow between partitions; security categorization can guide separation.

## Plain-language metaphor

Like fire doors that divide a building into sections so a problem in one area does not spread everywhere.

## Stagehand and operator guidance

Operators can isolate CI runners, browser execution, artifact storage, and sensitive targets using separate networks or environments. Maintainers should document expected boundaries and required connections.

## Control enhancements

None listed.

## Assessment status

**Planned / deployment-dependent; not verified.**
