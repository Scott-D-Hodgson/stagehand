# SC-20 - Secure Name/Address Resolution Service (Authoritative Source)

**Source:** [ITSG-33 Annex 3A, SC-20](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc20).

## Control definition

Authoritative resolution services provide origin-authentication and integrity evidence with responses to external queries and indicate child-zone security status so a supported chain of trust can be verified.

## Supplemental guidance

DNS and DNSSEC signatures/keys are examples. Other name-to-address technologies need equivalent means to assure response authenticity and integrity.

## Related controls

From the [official SC-20 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc20), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-10](../AU-audit-and-accountability/AU-10-non-repudiation.md), [SC-8](SC-8-transmission-confidentiality-and-integrity.md), [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md), [SC-21](SC-21-secure-name-address-resolution-service-recursive-or-caching-resolver.md), [SC-22](SC-22-architecture-and-provisioning-for-name-address-resolution-service.md).

## Plain-language metaphor

Like a directory that not only gives an address but proves the entry came from the legitimate directory office.

## Stagehand and operator guidance

Stagehand consumes hostnames through its runtime/network environment; operators own authoritative DNS and DNSSEC. Use managed, secured DNS and avoid hard-coded or unverified resolution workarounds.

## Control enhancements

(1) child subspaces withdrawn and incorporated into SC-20; (2) provide origin and integrity protection artifacts for internal name/address queries.

## Assessment status

**Planned / network-service-dependent; not verified.**
