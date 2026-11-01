# AC-17 — Remote Access

**Source:** [ITSG-33 Annex 3A, AC-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac17).

## Control definition

Establish and document restrictions, configuration requirements, and connection guidance for each permitted type of remote access; authorize remote access before allowing it; and require off-site personnel to protect organisational information under applicable physical-security requirements.

**Organisation-defined parameters to review:** permitted remote-access types; authorized users; connection and configuration requirements; monitoring scope; approved access points; and required disconnection or disablement time.

## Supplemental guidance

Remote access reaches a system through an external network. Encryption such as a VPN can protect traffic confidentiality and integrity, but does not make the endpoint or remote connection trustworthy and can affect monitoring visibility. Safeguard the endpoint and access path as well as the network tunnel.

## In plain language

Remote access is a key to the office from outside the building. A secure tunnel is like an enclosed walkway, but it does not prove that the person or computer at the far end is safe.

## Related controls

From the [official AC-17 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac17), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](AC-2-account-management.md), [AC-3](AC-3-access-enforcement.md), [AC-18](AC-18-wireless-access.md), [AC-19](AC-19-access-control-for-mobile-devices.md), [AC-20](AC-20-use-of-external-systems.md), [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [PE-17](../PE-physical-and-environmental-protection/PE-17-alternate-work-site.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [SC-10](../SC-system-and-communications-protection/SC-10-network-disconnect.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **AC-17(1):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md).
- **AC-17(2):** [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **AC-17(3):** [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).
- **AC-17(4):** [AC-6](AC-6-least-privilege.md).
- **AC-17(6):** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md), [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [PS-6](../PS-personnel-security/PS-6-access-agreements.md).

## Stagehand initial assessment

Stagehand may be used locally or through a remote desktop, hosted browser, CI runner, or other remote arrangement. Its architecture and deployment controls are not assumed here to implement enterprise remote-access authorization. Operators should require organisation-approved remote access, MFA where available, managed and patched endpoints, least privilege, encrypted connections, and logging at the access gateway. Avoid exposing browser-control or automation ports directly to untrusted networks. Select VPN/proxy monitoring settings with security teams so encryption does not create an unmonitored path.

## Control enhancements

Enhancements address automated monitoring/control of remote access, encryption, managed access-control points, privileged remote access, protecting remote-access information, privileged-function limitations, timely disconnection, and dedicated access consoles. The catalogue also records withdrawn enhancements incorporated elsewhere. Apply the current catalogue’s enhancement status and deployment baseline; no such feature is asserted as built into Stagehand.
