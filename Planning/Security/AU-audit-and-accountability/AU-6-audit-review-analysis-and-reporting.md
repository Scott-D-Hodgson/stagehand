# AU-6 — Audit Review, Analysis, and Reporting

**Source:** [ITSG-33 Annex 3A, AU-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au6).

## Control definition

Review and analyse audit records at an organisation-defined frequency for defined inappropriate or unusual activity, and report findings to designated roles.

**Organisation-defined parameters to review:** review frequency, activity patterns, and reporting recipients. **Suggested starting point for review:** automated alerting for high-risk events with routine human review at a cadence set by the organisation’s risk and staffing model; immediate escalation of credible incidents.

## Supplemental guidance

Review may cover information security events from accounts, remote and wireless access, devices, configuration, maintenance, facilities, network boundaries, and other sources. Findings should reach incident response, service desk, or security teams as appropriate. Where the system owner cannot review records, an authorized independent organisation may do so.

## In plain language

Keeping receipts is not enough; someone has to look for suspicious patterns and tell the people who can respond.

## Related controls

From the [official AU-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [AU-7](AU-7-audit-reduction-and-report-generation.md), [AU-16](AU-16-cross-organizational-auditing.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-10](../CM-configuration-management/CM-10-software-usage-restrictions.md), [CM-11](../CM-configuration-management/CM-11-user-installed-software.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md), [IR-5](../IR-incident-response/IR-5-incident-monitoring.md), [IR-6](../IR-incident-response/IR-6-incident-reporting.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md), [PE-14](../PE-physical-and-environmental-protection/PE-14-temperature-and-humidity-controls.md), [PE-16](../PE-physical-and-environmental-protection/PE-16-delivery-and-removal.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SC-18](../SC-system-and-communications-protection/SC-18-mobile-code.md), [SC-19](../SC-system-and-communications-protection/SC-19-voice-over-internet-protocol.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **AU-6(1):** [AU-12](AU-12-audit-generation.md).
- **AU-6(3):** [AU-12](AU-12-audit-generation.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md).
- **AU-6(4):** [AU-2](AU-2-auditable-events.md), [AU-12](AU-12-audit-generation.md).
- **AU-6(5):** [AU-12](AU-12-audit-generation.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **AU-6(8):** [AU-3](AU-3-content-of-audit-records.md), [AU-9](AU-9-protection-of-audit-information.md), [AU-11](AU-11-audit-record-retention.md), [AU-12](AU-12-audit-generation.md).
- **AU-6(9):** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md).

## Stagehand initial assessment

Stagehand product-level logs alone will not provide a complete view of a deployment. Operators should combine them with identity, endpoint, browser, network, and target-service events. Review for unusual task volume, unexpected destinations, repeated authorization failures, unusual privilege use, and access outside approved windows. Define privacy-respecting thresholds and escalation routes; verify correlation and alert quality during deployment assessment.

## Control enhancements

1. **AU-6(1), process integration:** automate integration of audit review with investigation and response processes.
2. **AU-6(2), automated security alerts:** withdrawn and incorporated into SI-4.
3. **AU-6(3), correlate audit repositories:** correlate records across repositories for organisation-wide awareness.
4. **AU-6(4), central review and analysis:** centrally review/analyse records from multiple system components.
5. **AU-6(5), integration with scanning and monitoring:** combine audit analysis with vulnerability scanning, performance, system monitoring, or other defined data sources.
