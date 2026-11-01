# IA-3 — Device Identification and Authentication

**Source:** [ITSG-33 Annex 3A, IA-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia3).

## Control definition

Uniquely identify and authenticate organisation-defined devices or device types before establishing local, remote, or network connections.

**Organisation-defined parameters:** device scope, connection types, authentication strength, lease details/duration, and configuration-management process for attestation.

## Supplemental guidance

Device identity may use shared network information or stronger organisational authentication mechanisms. Limit application to devices that need it and choose strength based on system sensitivity.

## Related controls

From the [official IA-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [IA-4](IA-4-identifier-management.md), [IA-5](IA-5-authenticator-management.md).
- **IA-3(1):** [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **IA-3(3):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md).

## Plain-language metaphor

Before a machine joins the workshop network, check its own badge as well as the person carrying it.

## Stagehand and operator guidance

Stagehand does not establish trust in the host device. Operators should use managed and authenticated endpoints/runners, device certificates or equivalent network access controls when required, and quarantine noncompliant devices. Do not treat an IP address alone as strong identity. Product deployment should document which device boundary it assumes.

## Enhancements

1. **IA-3(1), cryptographic bidirectional authentication:** authenticate defined devices to each other before connection.
2. **IA-3(2), cryptographic bidirectional network authentication:** withdrawn and incorporated into IA-3(1).
3. **IA-3(3), dynamic address allocation:** standardize/audit defined DHCP lease information and durations.
4. **IA-3(4), device attestation:** manage attestation-based identity through a defined configuration-management process.
