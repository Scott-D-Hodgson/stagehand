# PE-3 — Physical Access Control

**Source:** [ITSG-33 Annex 3A, PE-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe3).

## Control definition

Enforce access approvals at defined facility entry/exit points; keep access logs; safeguard publicly accessible areas; escort/monitor visitors under defined circumstances; secure physical keys/devices; inventory them periodically; and change keys/combinations on a defined schedule or after compromise/personnel changes.

**Organisation-defined parameters:** access points, controls, public-area safeguards, visitor escort conditions, device inventory cadence, and key-change frequency.

## Supplemental guidance

Use guards, card readers, locks, or combinations as appropriate while maintaining life-safety requirements. Logs can be manual, automated, or both. Public areas may require additional protection around devices.

## Related controls

From the [official PE-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [PE-2](PE-2-physical-access-authorizations.md), [PE-4](PE-4-access-control-for-transmission-medium.md), [PE-5](PE-5-access-control-for-output-devices.md), [PS-3](../PS-personnel-security/PS-3-personnel-screening.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md).
- **PE-3(1):** [PS-2](../PS-personnel-security/PS-2-position-categorization.md).
- **PE-3(2):** [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).
- **PE-3(3):** [CP-6](../CP-contingency-planning/CP-6-alternate-storage-site.md), [CP-7](../CP-contingency-planning/CP-7-alternate-processing-site.md).
- **PE-3(5):** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md).
- **PE-3(6):** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md).

## Plain-language metaphor

Use staffed or locked entrances, keep a sign-in record, and do not leave spare keys lying around.

## Stagehand and operator guidance

Local users should prevent unauthorized people from viewing automation sessions or accessing unattended endpoints. Hosting operators should control data-centre rooms, server areas, media stores, and physical access logs. Validate vendor controls where inherited.

## Enhancements

1. **PE-3(1), system-area access:** add controls for spaces containing system components.
2. **PE-3(2), boundary checks:** conduct security checks for unauthorized removal/exfiltration at defined facility/system boundaries.
3. **PE-3(3), continuous guards/alarms/monitoring:** monitor every physical access point continuously.
4. **PE-3(4), lockable casings:** protect defined components in lockable enclosures.
5. **PE-3(5), tamper protection:** detect or prevent tampering with defined hardware.
6. **PE-3(6), facility penetration testing:** conduct defined unannounced tests of physical-access safeguards.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
