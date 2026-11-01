# SC-17 - Public Key Infrastructure Certificates

**Source:** [ITSG-33 Annex 3A, SC-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc17).

## Control definition

Issue public-key certificates under an organisation-defined certificate policy or obtain them from an approved service provider.

**Organisation-defined parameter:** certificate policy. **Suggestion for review:** document approved issuers, certificate purposes, renewal/revocation procedures, and trust anchors appropriate to the deployment.

## Supplemental guidance

Manage trust stores so only approved trust anchors are trusted. This applies to externally visible certificates and certificates used for internal system operations.

## Related controls

From the [official SC-17 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc17), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-12](SC-12-cryptographic-key-establishment-and-management.md).

## Plain-language metaphor

Like accepting identification only from authorities on a trusted list and checking that it has not expired or been revoked.

## Stagehand and operator guidance

Stagehand does not issue certificates. Operators should use approved certificates for hosted editors, APIs, and internal endpoints, and maintain trusted certificate stores on hosts and CI agents. Avoid bypassing certificate validation in automation.

## Control enhancements

None listed.

## Assessment status

**Planned / environment-dependent; not verified.**
