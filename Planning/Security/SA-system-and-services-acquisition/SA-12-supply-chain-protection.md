# SA-12 - Supply Chain Protection

**Source:** [ITSG-33 Annex 3A, SA-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Protect systems, components, and services from supply-chain threats using organisation-defined safeguards as part of a defence-in-depth strategy throughout design, development, manufacture, packaging, distribution, integration, operation, maintenance, and retirement.

**Organisation-defined parameters:** safeguards. **Suggestion for review:** require dependency provenance and integrity checks, supplier security requirements, and a documented risk response for critical dependencies; tailor to deployment risk and procurement rules.

## Supplemental guidance

Identify and reduce vulnerabilities across lifecycle stages. Procurement can require suppliers to prevent unauthorized changes and protect components before delivery. Safeguards may include secure development environments, personnel vetting, tamper-evident shipping, protected assessment evidence, and requirements for service providers.

## Plain-language metaphor

Like tracing every ingredient and handler in a food supply chain, so substitutions or contamination can be found and addressed.

## Stagehand and operator guidance

Maintainers should inventory direct/transitive dependencies, lock versions, review provenance and advisories, protect build/release workflows, and preserve evidence. Operators should obtain Stagehand from trusted sources, verify signatures/hashes when provided, and assess CI, registry, browser, and hosting suppliers.

## Control enhancements

(1) tailored acquisition strategies/tools/methods; (2) supplier review before contract; (3) trusted shipping/warehousing withdrawn into (1); (4) supplier diversity withdrawn into (13); (5) safeguards limiting harm if targeted; (6) minimizing procurement time withdrawn into (1); (7) assessment before selection, acceptance, or update; (8) all-source supplier intelligence analysis; (9) OPSEC for supply-chain information; (10) validate received components are genuine and unaltered; (11) analyse/test supply-chain elements, processes, and actors; (12) inter-organisational agreements for notification; (13) safeguards for adequate supply of critical components; (14) unique identification and traceability; (15) process to remediate weaknesses found in supply-chain assessments. Hardware/procurement-specific elements may be outside a software-only deployment; assess the actual service chain.

## Assessment status

**Planned / not verified.** No dependency provenance or supplier assurance evidence is asserted here.
