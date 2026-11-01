# SA-12 - Supply Chain Protection

**Source:** [ITSG-33 Annex 3A, SA-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa12).

## Control definition

Protect systems, components, and services from supply-chain threats using organisation-defined safeguards as part of a defence-in-depth strategy throughout design, development, manufacture, packaging, distribution, integration, operation, maintenance, and retirement.

**Organisation-defined parameters:** safeguards. **Suggestion for review:** require dependency provenance and integrity checks, supplier security requirements, and a documented risk response for critical dependencies; tailor to deployment risk and procurement rules.

## Supplemental guidance

Identify and reduce vulnerabilities across lifecycle stages. Procurement can require suppliers to prevent unauthorized changes and protect components before delivery. Safeguards may include secure development environments, personnel vetting, tamper-evident shipping, protected assessment evidence, and requirements for service providers.

## Related controls

From the [official SA-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [PE-16](../PE-physical-and-environmental-protection/PE-16-delivery-and-removal.md), [PL-8](../PL-planning/PL-8-information-security-architecture.md), [SA-3](SA-3-system-development-lifecycle.md), [SA-4](SA-4-acquisition-process.md), [SA-8](SA-8-security-engineering-principles.md), [SA-10](SA-10-developer-configuration-management.md), [SA-14](SA-14-criticality-analysis.md), [SA-15](SA-15-development-process-standards-and-tools.md), [SA-18](SA-18-tamper-resistance-and-detection.md), [SA-19](SA-19-component-authenticity.md), [SC-29](../SC-system-and-communications-protection/SC-29-heterogeneity.md), [SC-30](../SC-system-and-communications-protection/SC-30-concealment-and-misdirection.md), [SC-38](../SC-system-and-communications-protection/SC-38-operations-security.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **SA-12(1):** [SA-19](SA-19-component-authenticity.md).
- **SA-12(7):** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [SA-11](SA-11-developer-security-testing.md).
- **SA-12(8):** [SA-15](SA-15-development-process-standards-and-tools.md).
- **SA-12(9):** [PE-21 (unresolved source reference)](../README.md#pe-21-source-discrepancy).
- **SA-12(11):** [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).

## Plain-language metaphor

Like tracing every ingredient and handler in a food supply chain, so substitutions or contamination can be found and addressed.

## Stagehand and operator guidance

Maintainers should inventory direct/transitive dependencies, lock versions, review provenance and advisories, protect build/release workflows, and preserve evidence. Operators should obtain Stagehand from trusted sources, verify signatures/hashes when provided, and assess CI, registry, browser, and hosting suppliers.

## Control enhancements

(1) tailored acquisition strategies/tools/methods; (2) supplier review before contract; (3) trusted shipping/warehousing withdrawn into (1); (4) supplier diversity withdrawn into (13); (5) safeguards limiting harm if targeted; (6) minimizing procurement time withdrawn into (1); (7) assessment before selection, acceptance, or update; (8) all-source supplier intelligence analysis; (9) OPSEC for supply-chain information; (10) validate received components are genuine and unaltered; (11) analyse/test supply-chain elements, processes, and actors; (12) inter-organisational agreements for notification; (13) safeguards for adequate supply of critical components; (14) unique identification and traceability; (15) process to remediate weaknesses found in supply-chain assessments. Hardware/procurement-specific elements may be outside a software-only deployment; assess the actual service chain.

## Current repository context

The pinned dependency tree and third-party notices now include unchanged MPL-2.0 axe dependencies. No SBOM generator, signed release pipeline, supplier evaluation, or reproducible-release assurance is established. Upstream axe tag-update detection remains proposed; catalogue agreement with the installed engine is not release awareness.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No dependency provenance or supplier assurance evidence is asserted here.
