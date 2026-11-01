# SC-37 - Out-of-Band Channels

**Source:** [ITSG-33 Annex 3A, SC-37](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc37).

## Control definition

Use defined out-of-band channels to physically deliver or electronically transmit defined information/components/devices to assigned people or systems.

**Organisation-defined parameters:** channels, items, recipients. **Suggestion for review:** use separately authenticated channels for recovery credentials or other high-impact secrets and record authorized recipients.

## Supplemental guidance

Out-of-band channels differ from routine operational channels, such as local access, physically separate networks, or courier delivery. They reduce shared exposure but still require protection.

## Related controls

From the [official SC-37 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc37), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-7](../CM-configuration-management/CM-7-least-functionality.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).

## Plain-language metaphor

Like sending a safe combination through a separately verified route instead of placing it in the same box as the safe.

## Stagehand and operator guidance

Do not include secrets in test plans, logs, or routine artifact transfers. Operators can deliver credentials and signing material through approved secret-management or separate authenticated channels.

## Control enhancements

(1) safeguard delivery/transmission so only assigned people or systems receive defined items.

## Assessment status

**Planned / environment-dependent; not verified.**
