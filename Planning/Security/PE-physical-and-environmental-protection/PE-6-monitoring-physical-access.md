# PE-6 — Monitoring Physical Access

**Source:** [ITSG-33 Annex 3A, PE-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe6).

## Control definition

Monitor facility access to detect/respond to physical incidents; review access logs at defined intervals and after defined events; coordinate investigation results with incident response.

**Organisation-defined parameters:** log-review cadence and triggering events.

## Supplemental guidance

Investigate suspicious patterns such as unusual hours, repeated access to unfamiliar areas, long dwell times, or out-of-order entries. Coordinate physical and cyber incident handling.

## Related controls

From the [official PE-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [IR-8](../IR-incident-response/IR-8-incident-response-plan.md).
- **PE-6(2):** [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **PE-6(4):** [PS-2](../PS-personnel-security/PS-2-position-categorization.md), [PS-3](../PS-personnel-security/PS-3-personnel-screening.md).

## Plain-language metaphor

Review the building’s entry records for unusual patterns and bring suspicious activity to the response team.

## Stagehand and operator guidance

Application logging does not show who entered a server room or accessed an unattended workstation. Facility owners should review badge/visitor logs and coordinate incidents affecting Stagehand systems with cyber responders.

## Enhancements

1. **PE-6(1), alarms/surveillance equipment:** monitor physical alarms and surveillance systems.
2. **PE-6(2), automated recognition/response:** automatically detect defined intrusion types and trigger defined responses.
3. **PE-6(3), video surveillance:** record defined operational areas and retain footage for a defined period; consider privacy/legal requirements.
4. **PE-6(4), monitoring system areas:** monitor component-concentration spaces in addition to general facility access.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
