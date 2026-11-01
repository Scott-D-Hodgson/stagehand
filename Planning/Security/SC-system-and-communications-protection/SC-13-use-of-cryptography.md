# SC-13 - Use of Cryptography

**Source:** [ITSG-33 Annex 3A, SC-13](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc13).

## Control definition

Implement organisation-defined cryptographic uses and the required type of cryptography for each use, consistent with applicable requirements.

**Organisation-defined parameter:** cryptographic uses and cryptography type for each use. **Suggestion for review:** create a use-to-standard mapping only where cryptography is required by policy or another selected control; have the security authority approve it.

## Supplemental guidance

Cryptography can protect information, provide signatures, enforce separation, or support random/hash generation. This control itself does not require organisations to use cryptography; when required elsewhere, document the use and type. Catalogue examples include FIPS-validated and CSE-approved cryptography.

## Related controls

From the [official SC-13 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc13), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-7](../AC-access-control/AC-7-unsuccessful-login-attempts.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [AU-9](../AU-audit-and-accountability/AU-9-protection-of-audit-information.md), [AU-10](../AU-audit-and-accountability/AU-10-non-repudiation.md), [CM-11](../CM-configuration-management/CM-11-user-installed-software.md), [CP-9](../CP-contingency-planning/CP-9-information-system-backup.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [IA-7](../IA-identification-and-authentication/IA-7-cryptographic-module-authentication.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SC-8](SC-8-transmission-confidentiality-and-integrity.md), [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-28](SC-28-protection-of-information-at-rest.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).

## Plain-language metaphor

Like choosing the right kind of lock for each purpose instead of assuming one lock fits every door.

## Stagehand and operator guidance

Use platform/standard cryptographic libraries and services; do not invent algorithms. Operators determine required cryptography for stored plans, reports, transmissions, and classified/protected data under current policy. Select applicable government requirements for the deployment; this record does not certify any implementation.

## Control enhancements

Enhancements (1)-(9) in this Annex are withdrawn and incorporated into SC-13: FIPS-validated cryptography, NSA-approved cryptography, separation for persons lacking formal approvals, digital signatures, transmission protections for Protected A/B/C, protection at rest, and COMSEC equipment. They are not separate active enhancements here.

## Assessment status

**Planned / deployment-dependent; not verified.** No cryptographic implementation is evaluated.
