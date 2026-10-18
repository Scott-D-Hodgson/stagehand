# SC-17 - Public Key Infrastructure Certificates

**Source:** [ITSG-33 Annex 3A, SC-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Issue public-key certificates under an organisation-defined certificate policy or obtain them from an approved service provider.

**Organisation-defined parameter:** certificate policy. **Suggestion for review:** document approved issuers, certificate purposes, renewal/revocation procedures, and trust anchors appropriate to the deployment.

## Supplemental guidance

Manage trust stores so only approved trust anchors are trusted. This applies to externally visible certificates and certificates used for internal system operations.

## Plain-language metaphor

Like accepting identification only from authorities on a trusted list and checking that it has not expired or been revoked.

## Stagehand and operator guidance

Stagehand does not issue certificates. Operators should use approved certificates for hosted editors, APIs, and internal endpoints, and maintain trusted certificate stores on hosts and CI agents. Avoid bypassing certificate validation in automation.

## Control enhancements

None listed.

## Assessment status

**Planned / environment-dependent; not verified.**
