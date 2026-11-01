# AC-19 — Access Control for Mobile Devices

**Source:** [ITSG-33 Annex 3A, AC-19](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac19).

## Control definition

Establish usage restrictions, configuration requirements, and connection requirements for organisation-controlled mobile devices, and authorize their connection to the information system.

**Organisation-defined parameters to review:** mobile-device types and permitted uses; required configuration and connection controls; and any additional restrictions for classified or sensitive environments.

## Supplemental guidance

Mobile devices include portable computing devices with storage or network access. Their mobility increases loss, theft, and exposure risks. Apply appropriate device management, authentication, encryption, patching, and remote-response measures. The control’s scope is organisation-controlled devices; other controls address external or personally owned systems.

## In plain language

A mobile device is a work key that can leave the building. Keep it locked, track its condition, and decide what it may open before it travels.

## Related controls

From the [official AC-19 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac19), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](AC-3-access-enforcement.md), [AC-7](AC-7-unsuccessful-login-attempts.md), [AC-18](AC-18-wireless-access.md), [AC-20](AC-20-use-of-external-systems.md), [CA-9](../CA-security-assessment-and-authorization/CA-9-internal-system-connections.md), [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SC-43](../SC-system-and-communications-protection/SC-43-usage-restrictions.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **AC-19(4):** [CA-6](../CA-security-assessment-and-authorization/CA-6-security-authorization.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md).
- **AC-19(5):** [MP-5](../MP-media-protection/MP-5-media-transport.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md), [SC-28](../SC-system-and-communications-protection/SC-28-protection-of-information-at-rest.md).

## Stagehand initial assessment

Where Stagehand runs on or controls a mobile device, the host organisation remains responsible for device management and approval. Use managed devices, full-disk encryption, screen locks, supported OS/browser versions, and approved remote-wipe procedures. Avoid storing credentials, screenshots, or sensitive automation artifacts on unmanaged devices. Assess mobile-browser and remote-control usage separately; Stagehand does not replace mobile-device management.

## Control enhancements

Enhancements include restrictions in classified environments and encryption of information on mobile devices or containers; some earlier enhancements are withdrawn and incorporated into MP-7. Consult the authoritative catalogue for enhancement status and select controls according to the device and information sensitivity.
