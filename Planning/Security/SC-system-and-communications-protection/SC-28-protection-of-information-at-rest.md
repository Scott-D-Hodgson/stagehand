# SC-28 - Protection of Information at Rest

**Source:** [ITSG-33 Annex 3A, SC-28](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc28).

## Control definition

Protect the confidentiality and/or integrity, as selected, of assigned information while stored on system storage components.

**Organisation-defined parameters:** information and selected protection property. **Suggestion for review:** include plans, credentials, browser profiles, logs, screenshots, traces, and reports; select confidentiality/integrity safeguards based on categorization.

## Supplemental guidance

Covers user and system information at rest. Protection may use cryptography, file-share scanning, write-once storage, or secure offline storage where online protection is insufficient. Align key management with SC-12.

## Related controls

From the [official SC-28 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc28), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [SC-8](SC-8-transmission-confidentiality-and-integrity.md), [SC-13](SC-13-use-of-cryptography.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **SC-28(1):** [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [SC-12](SC-12-cryptographic-key-establishment-and-management.md).

## Plain-language metaphor

Like locking documents in a cabinet and using a seal to reveal if someone changed them.

## Stagehand and operator guidance

Maintainers should minimize persistent secrets and provide safe storage guidance. Operators should use full-disk or file-level encryption, restrict artifact access/retention, secure browser profiles, and manage encryption keys under policy.

## Control enhancements

(1) cryptographically prevent unauthorized disclosure/modification of defined information on defined components; (2) remove defined information from online storage and keep it in a secure offline location. Select based on data sensitivity and deployment need.

## Assessment status

**Planned / deployment-dependent; not verified.**
