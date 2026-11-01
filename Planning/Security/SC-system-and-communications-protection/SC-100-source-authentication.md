# SC-100 - Source Authentication

**Source:** [ITSG-33 Annex 3A, SC-100](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc100).

## Control definition

Allow a message recipient to verify the claimed source identifier in a message.

## Supplemental guidance

Source authentication prevents impersonation in non-session communications and can be implemented at protocol layers ranging from IP packets to email.

## Related controls

From the [official SC-100 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc100), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [IA-1](../IA-identification-and-authentication/IA-1-identification-and-authentication-policy-and-procedures.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md), [SC-8](SC-8-transmission-confidentiality-and-integrity.md), [SC-13](SC-13-use-of-cryptography.md).

## Plain-language metaphor

Like checking a signature on a letter to know who actually sent it.

## Stagehand and operator guidance

Maintainers should authenticate release/update sources and any non-session messages if such integrations are added. Operators should verify software provenance and authenticate automated notifications using approved mechanisms.

## Control enhancements

(1) cryptographically authenticate the claimed identifier; (2) use CMVP-certified cryptography for digital-signature generation/verification; (3) use CSE-approved cryptography/protocols for authentication. Select according to applicable requirements and SC-13.

## Assessment status

**Planned / integration-dependent; not verified.**
