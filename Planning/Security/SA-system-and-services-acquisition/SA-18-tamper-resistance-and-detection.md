# SA-18 - Tamper Resistance and Detection

**Source:** [ITSG-33 Annex 3A, SA-18](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Implement a tamper-protection program for the system, component, or service.

## Supplemental guidance

Anti-tamper methods protect critical systems/products from modification, reverse engineering, and substitution. Strong identification plus resistance/detection helps protect items during distribution and use.

## Plain-language metaphor

Like tamper-evident seals that show whether a package has been opened or changed.

## Stagehand and operator guidance

Maintainers should protect source and release integrity and provide verifiable release artifacts when designed. Operators should verify downloaded packages and protect hosts and deployment files from unauthorized modification. Software-only deployments have limited ability to deter reverse engineering.

## Control enhancements

(1) use anti-tamper techniques across multiple lifecycle phases; (2) inspect defined systems/components/devices randomly, periodically, or when indicators warrant to detect physical or logical tampering. Apply the second enhancement to relevant devices and environments.

## Assessment status

**Planned / not verified.** No tamper-protection program evidence is asserted.

## Organisation-defined parameter suggestions

SA-18(2) assigns which components/devices to inspect, frequency, and indicators. **Suggestion for review:** inspect portable or exposed devices after travel to high-risk locations and periodically according to the operator’s risk policy; record findings and response.
