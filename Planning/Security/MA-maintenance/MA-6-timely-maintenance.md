# MA-6 — Timely Maintenance

**Source:** [ITSG-33 Annex 3A, MA-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma6).

## Control definition

Obtain maintenance support or spare parts for defined components within a defined time after failure.

**Organisation-defined parameters:** critical components and response time. **Suggestion for review:** derive support targets from business impact and recovery objectives rather than using a universal deadline.

## Supplemental guidance

Identify components whose outage increases risk to operations, assets, people, or other organisations, and establish contracts or other support arrangements to meet the needed response.

## Related controls

From the [official MA-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md), [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [CP-7](../CP-contingency-planning/CP-7-alternate-processing-site.md), [SA-14](../SA-system-and-services-acquisition/SA-14-criticality-analysis.md), [SA-15](../SA-system-and-services-acquisition/SA-15-development-process-standards-and-tools.md).

## Plain-language metaphor

Keep a repair plan and spare parts for the machine whose failure would stop the most important work.

## Stagehand and operator guidance

Identify critical dependencies such as runner hosting, browser binaries, identity services, and target integrations. Operators should define support SLAs, patch windows, rollback paths, and replacement images. Maintainers should publish a vulnerability/update response process proportionate to severity.

## Enhancements

1. **MA-6(1), preventive maintenance:** service defined components at set intervals to prevent failures.
2. **MA-6(2), predictive maintenance:** use defined condition monitoring and scheduled maintenance based on observed trends.
3. **MA-6(3), automated predictive maintenance:** transfer condition data to a computerized maintenance-management system.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
