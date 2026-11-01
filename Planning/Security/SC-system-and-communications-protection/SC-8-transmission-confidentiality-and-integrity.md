# SC-8 - Transmission Confidentiality and Integrity

**Source:** [ITSG-33 Annex 3A, SC-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc8).

## Control definition

Protect the confidentiality and/or integrity of information transmitted by the system, as selected by the organisation.

## Supplemental guidance

Applies to internal and external networks and all components capable of transmitting information. Paths beyond controlled physical boundaries can be intercepted or modified. Protection can be physical or logical/cryptographic; if commercial transmission services cannot provide sufficient assurance, apply compensating safeguards or explicitly accept risk.

## Related controls

From the [official SC-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-17](../AC-access-control/AC-17-remote-access.md), [PE-4](../PE-physical-and-environmental-protection/PE-4-access-control-for-transmission-medium.md).
- **SC-8(1):** [SC-13](SC-13-use-of-cryptography.md).
- **SC-8(2):** [AU-10](../AU-audit-and-accountability/AU-10-non-repudiation.md).
- **SC-8(3):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).
- **SC-8(4):** [SC-12](SC-12-cryptographic-key-establishment-and-management.md), [SC-13](SC-13-use-of-cryptography.md).

## Plain-language metaphor

Like sealing a letter and using a tamper-evident envelope while it travels.

## Stagehand and operator guidance

Maintainers should use secure transport for any Stagehand-managed network traffic and avoid logging secrets. Operators should require TLS for editor hosting, CI, artifact transfer, and target endpoints; protect local networks and proxies. Actual transmission protection depends on the deployment stack.

## Control enhancements

(1) cryptographic or alternative physical protection to prevent disclosure/detect changes; (2) maintain selected confidentiality/integrity during preparation and reception; (3) cryptographically protect message headers/routing metadata unless alternate physical safeguards apply; (4) conceal or randomize communication patterns unless alternate physical safeguards apply. Cryptographic requirements must align with SC-13.

## Current repository context

Navigation intentionally permits both HTTP and HTTPS URLs. Operators requiring encrypted transport must enforce approved HTTPS targets and appropriate network/browser configuration; Stagehand does not promise HTTPS-only navigation or a product-controlled encrypted channel.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.** No implementation or transport configuration evidence is asserted.

## Organisation-defined parameter suggestions

The selected protection property, information, and alternative physical safeguards vary by deployment. **Suggestion for review:** protect confidentiality and integrity for sensitive data crossing untrusted networks with approved cryptography; document any exception and its compensating safeguards.
