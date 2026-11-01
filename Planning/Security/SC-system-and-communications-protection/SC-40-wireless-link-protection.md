# SC-40 - Wireless Link Protection

**Source:** [ITSG-33 Annex 3A, SC-40](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc40).

## Control definition

Protect assigned internal/external wireless links from defined signal-parameter attacks.

**Organisation-defined parameters:** links and attack types. **Suggestion for review:** identify Wi-Fi and other radio links in the deployment boundary and use the organisation's approved wireless protections.

## Supplemental guidance

Wireless signals may be visible beyond authorized users and can be exploited for intelligence, denial of service, or spoofing. Commodity telecom providers may not support all protections.

## Related controls

From the [official SC-40 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc40), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-18](../AC-access-control/AC-18-wireless-access.md), [SC-5](SC-5-denial-of-service-protection.md).
- **SC-40(1):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).
- **SC-40(2):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).
- **SC-40(3):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).
- **SC-40(4):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).

## Plain-language metaphor

Like protecting a radio conversation from jamming, impersonation, and being tracked by its signal.

## Stagehand and operator guidance

Wireless security is host/network responsibility. Operators should use managed Wi-Fi, approved encryption, and endpoint controls; do not use sensitive deployments over untrusted wireless without authorization.

## Control enhancements

(1) cryptographic protection against intentional electromagnetic interference; (2) reduce wireless-link detection potential to a defined level; (3) detect/reject deliberate signal-parameter impersonation/manipulation; (4) prevent identification of defined transmitters by signal parameters. These specialized measures require mission-specific radio expertise.

## Assessment status

**Planned / wireless-environment-dependent; not verified.**
