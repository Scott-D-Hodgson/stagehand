# AC-18 — Wireless Access

**Source:** [ITSG-33 Annex 3A, AC-18](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac18).

## Control definition

Establish usage restrictions, configuration requirements, and connection requirements for wireless access, and authorize wireless access to the information system before permitting it.

**Organisation-defined parameters to review:** authorized wireless technologies, configurations, users/devices, and connection requirements; monitoring requirements; and whether embedded wireless capabilities must be disabled when unused.

## Supplemental guidance

Wireless includes Wi-Fi, cellular, and other radio technologies. Access points and clients should be configured and monitored according to organisational policy. Encryption and authentication protect the link, but do not replace endpoint security or authorization.

## In plain language

Wi-Fi is a doorway that can be reached through the air. A strong lock helps, but the organisation still needs to decide who gets a key and watch for unauthorized doors.

## Related controls

From the [official AC-18 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac18), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](AC-2-account-management.md), [AC-3](AC-3-access-enforcement.md), [AC-17](AC-17-remote-access.md), [AC-19](AC-19-access-control-for-mobile-devices.md), [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SC-9](../SC-system-and-communications-protection/SC-9-transmission-confidentiality.md).
- **AC-18(1):** [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **AC-18(3):** [AC-19](AC-19-access-control-for-mobile-devices.md).
- **AC-18(4):** [AC-3](AC-3-access-enforcement.md), [SC-15](../SC-system-and-communications-protection/SC-15-collaborative-computing-devices.md).
- **AC-18(5):** [PE-19](../PE-physical-and-environmental-protection/PE-19-information-leakage.md).

## Stagehand initial assessment

Stagehand inherits wireless risks from the workstation, hosted runner, or remote environment on which it operates. Operators should use approved networks, secure authentication and encryption, managed endpoints, and network segmentation appropriate to the data. Disable unused wireless interfaces where policy requires it; do not assume Stagehand can detect or secure the host’s Wi-Fi configuration.

## Control enhancements

Enhancements include stronger authentication and encryption, monitoring for unauthorized wireless connections (some catalogue enhancements are withdrawn into other controls), disabling wireless when not needed, and restricting user configuration of wireless settings. Confirm the current catalogue status and organisation baseline.
