# IR-5 — Incident Monitoring

**Source:** [ITSG-33 Annex 3A, IR-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir5).

## Control definition

Track and document information-system security incidents.

## Supplemental guidance

Maintain incident records, status, and details useful for forensics, trend analysis, and handling. Inputs can include reports, responders, audit/network/physical monitoring, and user or administrator reports.

## Related controls

From the [official IR-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [IR-8](IR-8-incident-response-plan.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md), [SC-5](../SC-system-and-communications-protection/SC-5-denial-of-service-protection.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **IR-5(1):** [AU-7](../AU-audit-and-accountability/AU-7-audit-reduction-and-report-generation.md), [IR-4](IR-4-incident-handling.md).

## Plain-language metaphor

Keep a case file for each alarm: what happened, what is known, what has been done, and what remains.

## Stagehand and operator guidance

Record Stagehand-related incidents in the organisation’s approved incident system, not only in product issue trackers. Include affected deployment/version, timeline, scope, actions taken, and data sensitivity while limiting access to incident data. Correlate application, host, identity, and target-system evidence.

## Enhancements

1. **IR-5(1), automated tracking/data collection/analysis:** automate incident records and supporting collection/analysis where appropriate.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
