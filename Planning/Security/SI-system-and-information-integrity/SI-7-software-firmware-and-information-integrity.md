# SI-7 - Software, Firmware, and Information Integrity

**Source:** [ITSG-33 Annex 3A, SI-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si7).

## Control definition

Use integrity-verification tools to detect unauthorized changes to assigned software, firmware, and information.

**Organisation-defined parameter:** items to verify. **Suggestion for review:** include release artifacts, dependency manifests, configuration, and security-relevant plan/report data; verify signed hashes or trusted signatures where suitable.

## Supplemental guidance

Changes can be accidental or malicious. Integrity mechanisms such as checksums, hashes, or signatures can monitor systems and hosted applications; metadata/security attributes may also need integrity protection.

## Related controls

From the [official SI-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md), [SI-3](SI-3-malicious-code-protection.md).
- **SI-7(3):** [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [SI-2](SI-2-flaw-remediation.md), [SI-8](SI-8-spam-protection.md).
- **SI-7(6):** [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **SI-7(7):** [IR-4](../IR-incident-response/IR-4-incident-handling.md), [IR-5](../IR-incident-response/IR-5-incident-monitoring.md), [SI-4](SI-4-information-system-monitoring.md).
- **SI-7(8):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md).
- **SI-7(14):** [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md).

## Plain-language metaphor

Like comparing a package’s seal and contents against a trusted master copy to see if anything changed.

## Stagehand and operator guidance

Maintainers should protect source/build/release integrity and provide trusted provenance for releases. Operators should verify downloads and secure configuration/artifact storage; hardware/boot integrity remains platform responsibility.

## Control enhancements

(1) perform checks at startup, transitions, events, or intervals; (2) automatically notify assigned roles of integrity discrepancies; (3) centrally manage integrity tools; (4) tamper-evident packaging withdrawn into SA-12; (5) automatically shut down/restart/apply safeguards on violations; (6) cryptographically detect unauthorized changes; (7) integrate security-relevant change detection with incident response; (8) audit potential violations and take selected actions; (9) verify boot-process integrity; (10) protect boot firmware; (11) run user-installed software in confined limited-privilege environments; (12) verify user-installed software before execution; (13) allow binaries from limited-warranty/no-source providers only in confined environments with explicit approval; (14) prohibit such binaries except compelling approved exceptions; (15) cryptographically authenticate software/firmware before installation; (16) limit unsupervised process execution to a defined time. Enhancements 9-10 are host/firmware-specific; applicability depends on the system boundary.

## Current repository context

The loader sha256-v1 fingerprint represents exact plan/case source contents. Result-model validates its shape but does not calculate or authenticate it, and full result production is not wired. No digital signing, trusted artifact attestation, tamper-proof log, or malware integrity check is implied.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No signed build or integrity-check evidence is asserted.
