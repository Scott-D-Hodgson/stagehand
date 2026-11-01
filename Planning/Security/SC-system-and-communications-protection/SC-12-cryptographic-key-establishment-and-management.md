# SC-12 - Cryptographic Key Establishment and Management

**Source:** [ITSG-33 Annex 3A, SC-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc12).

## Control definition

Establish and manage keys for required cryptography under defined rules for generation, distribution, storage, access, and destruction.

**Organisation-defined parameter:** key-management requirements. **Suggestion for review:** specify approved cryptography, key owners, storage, rotation/revocation, backup/recovery, access, and destruction based on policy and data sensitivity.

## Supplemental guidance

Key management may be manual or automated with supporting procedures. Manage trust stores so only approved trust anchors are present. Key use must meet SC-13.

## Related controls

From the [official SC-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-13](SC-13-use-of-cryptography.md), [SC-17](SC-17-public-key-infrastructure-certificates.md).

## Plain-language metaphor

Like controlling who can make, copy, store, and retire the keys to a vault.

## Stagehand and operator guidance

Plans should not contain secrets or cryptographic private keys. Maintainers should avoid bespoke key management. Operators should use approved secret/key-management services, protect browser and signing keys, and manage trust stores on hosts and CI systems.

## Control enhancements

(1) preserve information availability if users lose keys; (2) use compliant/approved key technologies/processes for symmetric keys; (3) use approved methods/certificates/hardware tokens for asymmetric keys; (4) PKI certificates withdrawn into SC-12; (5) PKI certificates/hardware tokens withdrawn into SC-12.

## Assessment status

**Planned / environment-dependent; not verified.** Stagehand key management is not claimed.
