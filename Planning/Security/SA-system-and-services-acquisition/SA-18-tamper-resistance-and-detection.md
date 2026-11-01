# SA-18 - Tamper Resistance and Detection

**Source:** [ITSG-33 Annex 3A, SA-18](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa18).

## Control definition

Implement a tamper-protection program for the system, component, or service.

## Supplemental guidance

Anti-tamper methods protect critical systems/products from modification, reverse engineering, and substitution. Strong identification plus resistance/detection helps protect items during distribution and use.

## Related controls

From the [official SA-18 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa18), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [SA-12](SA-12-supply-chain-protection.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **SA-18(1):** [SA-3](SA-3-system-development-lifecycle.md).
- **SA-18(2):** [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

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
