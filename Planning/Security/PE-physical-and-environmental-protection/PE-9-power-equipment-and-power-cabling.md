# PE-9 — Power Equipment and Power Cabling

**Source:** [ITSG-33 Annex 3A, PE-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe9).

## Control definition

Protect system power equipment and cabling from damage or destruction.

## Supplemental guidance

Protection may differ by location and include external generators/cables, internal wiring, data-centre UPS, or power systems for self-contained platforms.

## Related controls

From the [official PE-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [PE-4](PE-4-access-control-for-transmission-medium.md).

## Plain-language metaphor

Protect the power cord and backup source so the machine does not go dark when something hits the electrical supply.

## Stagehand and operator guidance

Local device power resilience is an endpoint responsibility; hosted systems inherit facility controls from the provider. Operators should review power resilience against service availability objectives.

## Enhancements

1. **PE-9(1), redundant cabling:** use physically separated redundant power paths at an organisation-defined distance.
2. **PE-9(2), automatic voltage controls:** protect defined critical components with automatic voltage regulation.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
