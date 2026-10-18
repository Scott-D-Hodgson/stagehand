# SA-19 - Component Authenticity

**Source:** [ITSG-33 Annex 3A, SA-19](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Create anti-counterfeit policy and procedures to detect/prevent counterfeit components from entering the system and report counterfeit components to selected parties.

**Organisation-defined parameters:** reporting destinations and roles. **Suggestion for review:** define an internal security/procurement contact and the appropriate supplier or external reporting channel; preserve evidence while limiting exposure.

## Supplemental guidance

Sources include manufacturers, developers, vendors, and contractors. Anti-counterfeit measures also help prevent malicious code introduction and complement tamper protection.

## Plain-language metaphor

Like checking a product’s seal and serial number to ensure it came from the genuine manufacturer.

## Stagehand and operator guidance

Maintainers should use trusted dependency/release sources and record provenance. Operators should obtain packages from approved channels and verify signatures/hashes where available. The physical anti-counterfeit process is primarily organisational/provider responsibility.

## Control enhancements

(1) train assigned roles to recognize counterfeit hardware/software/firmware; (2) configuration control over components awaiting repair and repaired items awaiting reuse; (3) dispose of components using defined methods; (4) scan for counterfeit components at a defined frequency. Physical component enhancements depend on the deployment; software provenance remains relevant.

## Assessment status

**Planned / environment-dependent; not verified.** No provenance or organisational reporting evidence is asserted.
