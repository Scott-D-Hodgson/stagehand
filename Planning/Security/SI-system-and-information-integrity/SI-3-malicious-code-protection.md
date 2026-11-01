# SI-3 - Malicious Code Protection

**Source:** [ITSG-33 Annex 3A, SI-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si3).

## Control definition

Use malicious-code defenses at system entry/exit points; update them as releases become available under configuration policy; scan periodically and in real time at selected endpoints/network points; take defined actions on detections; and address false positives and availability impacts.

**Organisation-defined parameters:** scan frequency/location, detection response, and false-positive process. **Suggestion for review:** scan downloads and release artifacts, alert security staff, quarantine suspicious files, and provide an authorized restoration process.

## Supplemental guidance

Threats can arrive through web, email, attachments, removable media, compressed/hidden files, and vulnerabilities. Endpoint, proxy, firewall, and reputation/signature mechanisms help, but custom malicious logic may evade traditional tools; secure development and monitoring remain necessary.

## Related controls

From the [official SI-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SA-13](../SA-system-and-services-acquisition/SA-13-trustworthiness.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SC-26](../SC-system-and-communications-protection/SC-26-honeypots.md), [SC-44](../SC-system-and-communications-protection/SC-44-detonation-chambers.md), [SI-2](SI-2-flaw-remediation.md), [SI-4](SI-4-information-system-monitoring.md), [SI-7](SI-7-software-firmware-and-information-integrity.md).
- **SI-3(1):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [SI-8](SI-8-spam-protection.md).
- **SI-3(2):** [SI-8](SI-8-spam-protection.md).
- **SI-3(4):** [AC-6](../AC-access-control/AC-6-least-privilege.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md).
- **SI-3(6):** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **SI-3(8):** [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md).
- **SI-3(9):** [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md), [SC-23](../SC-system-and-communications-protection/SC-23-session-authenticity.md).

## Plain-language metaphor

Like checking packages at every entrance and keeping inspection rules current, while knowing that a clever fake may evade one kind of scanner.

## Stagehand and operator guidance

Maintainers should scan dependencies and artifacts with approved tools and avoid executing untrusted plans outside isolation. Operators should enable host, browser, and network malware protection; keep definitions updated; and avoid disabling controls to run automation.

## Control enhancements

(1) centrally manage defenses; (2) automatically update them; (3) non-privileged users withdrawn into AC-6(10); (4) updates only when directed by privileged users; (5) portable-storage protections withdrawn into MP-7; (6) test with a benign non-spreading case and verify detection/reporting; (7) non-signature detection; (8) detect unauthorized OS commands and warn/audit/prevent; (9) authenticate remote commands; (10) analyse malware behaviour and use findings in incident response/flaw remediation.

## Assessment status

**Planned / deployment-dependent; not verified.** No malware-control evidence asserted.
