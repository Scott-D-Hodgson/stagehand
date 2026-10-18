# SI-7 - Software, Firmware, and Information Integrity

**Source:** [ITSG-33 Annex 3A, SI-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Use integrity-verification tools to detect unauthorized changes to assigned software, firmware, and information.

**Organisation-defined parameter:** items to verify. **Suggestion for review:** include release artifacts, dependency manifests, configuration, and security-relevant plan/report data; verify signed hashes or trusted signatures where suitable.

## Supplemental guidance

Changes can be accidental or malicious. Integrity mechanisms such as checksums, hashes, or signatures can monitor systems and hosted applications; metadata/security attributes may also need integrity protection.

## Plain-language metaphor

Like comparing a package’s seal and contents against a trusted master copy to see if anything changed.

## Stagehand and operator guidance

Maintainers should protect source/build/release integrity and provide trusted provenance for releases. Operators should verify downloads and secure configuration/artifact storage; hardware/boot integrity remains platform responsibility.

## Control enhancements

(1) perform checks at startup, transitions, events, or intervals; (2) automatically notify assigned roles of integrity discrepancies; (3) centrally manage integrity tools; (4) tamper-evident packaging withdrawn into SA-12; (5) automatically shut down/restart/apply safeguards on violations; (6) cryptographically detect unauthorized changes; (7) integrate security-relevant change detection with incident response; (8) audit potential violations and take selected actions; (9) verify boot-process integrity; (10) protect boot firmware; (11) run user-installed software in confined limited-privilege environments; (12) verify user-installed software before execution; (13) allow binaries from limited-warranty/no-source providers only in confined environments with explicit approval; (14) prohibit such binaries except compelling approved exceptions; (15) cryptographically authenticate software/firmware before installation; (16) limit unsupervised process execution to a defined time. Enhancements 9-10 are host/firmware-specific; applicability depends on the system boundary.

## Assessment status

**Planned / not verified.** No signed build or integrity-check evidence is asserted.
