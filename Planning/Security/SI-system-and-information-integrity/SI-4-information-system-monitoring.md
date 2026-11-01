# SI-4 - Information System Monitoring

**Source:** [ITSG-33 Annex 3A, SI-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si4).

## Control definition

Monitor for attacks/indicators and unauthorized local, network, or remote connections; identify unauthorized use; place monitoring at strategic and ad hoc points; protect monitoring data; increase monitoring when risk rises; obtain legal review as required; and distribute monitoring information to assigned roles.

**Organisation-defined parameters:** objectives, methods, monitoring placement, increased-risk response, legal review process, data shared, recipients, and frequency. **Suggestion for review:** define minimum telemetry, protect logs, set alert recipients, and ensure privacy/legal approval before monitoring people or content.

## Supplemental guidance

Monitoring can be internal or at system boundaries, using IDS/IPS, malware protection, scanning, audit, or network tools. Monitoring supports continuous monitoring and incident response; collected detail should match objectives and system capabilities.

## Related controls

From the [official SI-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [AC-8](../AC-access-control/AC-8-system-use-notification.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [AU-7](../AU-audit-and-accountability/AU-7-audit-reduction-and-report-generation.md), [AU-9](../AU-audit-and-accountability/AU-9-protection-of-audit-information.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SC-26](../SC-system-and-communications-protection/SC-26-honeypots.md), [SC-35](../SC-system-and-communications-protection/SC-35-honeyclients.md), [SI-3](SI-3-malicious-code-protection.md), [SI-7](SI-7-software-firmware-and-information-integrity.md).
- **SI-4(5):** [AU-5](../AU-audit-and-accountability/AU-5-response-to-audit-processing-failures.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md).
- **SI-4(9):** [CP-9](../CP-contingency-planning/CP-9-information-system-backup.md).
- **SI-4(12):** [AC-18](../AC-access-control/AC-18-wireless-access.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md).
- **SI-4(14):** [AC-18](../AC-access-control/AC-18-wireless-access.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md).
- **SI-4(15):** [AC-18](../AC-access-control/AC-18-wireless-access.md).
- **SI-4(16):** [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md).
- **SI-4(17):** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md).
- **SI-4(22):** [AC-6](../AC-access-control/AC-6-least-privilege.md), [CM-7](../CM-configuration-management/CM-7-least-functionality.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-9](../SA-system-and-services-acquisition/SA-9-external-information-system-services.md).

## Plain-language metaphor

Like cameras and alarms at entrances and inside critical rooms, with protected recordings and a plan for who responds.

## Stagehand and operator guidance

Maintainers should define privacy-conscious product telemetry (if any) and prevent secrets from entering diagnostics. Operators own host, network, CI, and identity monitoring; protect logs and set a higher monitoring posture during credible threats.

## Control enhancements

(1) system-wide integrated IDS; (2) automated near-real-time event analysis; (3) integrate detections with access/flow controls for response; (4) monitor inbound/outbound traffic; (5) alert assigned roles on defined compromise indicators; (6) non-privileged-user restrictions withdrawn into AC-6(10); (7) alert response personnel and take least-disruptive termination action; (8) monitoring-information protection withdrawn into SI-4; (9) test monitoring tools at defined intervals; (10) provide selected encrypted-traffic visibility to monitoring tools; (11) analyse traffic anomalies; (12) automate alerts for unusual/security-relevant activities; (13) profile traffic/events to tune false positives/negatives; (14) wireless intrusion detection; (15) monitor wireless-to-wireline traffic; (16) correlate monitoring data; (17) integrate physical, cyber, and supply-chain awareness; (18) analyse for covert exfiltration; (19) additional monitoring of identified higher-risk individuals under law/policy; (20) additional privileged-user monitoring; (21) additional monitoring during defined probation; (22) detect unauthorized network services and audit/alert; (23) host-based monitoring; (24) discover, collect, distribute, and use indicators of compromise. Many enhancements are organisational monitoring capabilities, not Stagehand features.

## Assessment status

**Planned / deployment-dependent; not verified.** No logging/monitoring deployment is assessed.
