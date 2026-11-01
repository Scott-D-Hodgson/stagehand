# SA-4 - Acquisition Process

**Source:** [ITSG-33 Annex 3A, SA-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa4).

## Control definition

For system/component/service acquisitions, include applicable security functional, strength, assurance, and documentation requirements; protection requirements for security documentation; development and operating-environment descriptions; and acceptance criteria. Include security documentation and development/evaluation requirements in contracts based on risk and applicable requirements.

## Supplemental guidance

Components include identifiable hardware, software, and firmware. Security strength concerns correctness, completeness, and resistance to attack/tampering. Assurance includes development practices and evidence that required functionality is implemented. Requirements should be tailored and documented; administrator/user documentation should support secure operation.

## Related controls

From the [official SA-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [PL-2](../PL-planning/PL-2-system-security-plan.md), [PS-7](../PS-personnel-security/PS-7-third-party-personnel-security.md), [SA-3](SA-3-system-development-lifecycle.md), [SA-5](SA-5-information-system-documentation.md), [SA-8](SA-8-security-engineering-principles.md), [SA-11](SA-11-developer-security-testing.md), [SA-12](SA-12-supply-chain-protection.md).
- **SA-4(1):** [SA-5](SA-5-information-system-documentation.md).
- **SA-4(2):** [SA-5](SA-5-information-system-documentation.md).
- **SA-4(3):** [SA-12](SA-12-supply-chain-protection.md).
- **SA-4(5):** [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md).
- **SA-4(6):** [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md), [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **SA-4(7):** [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **SA-4(8):** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md).
- **SA-4(9):** [CM-7](../CM-configuration-management/CM-7-least-functionality.md), [SA-9](SA-9-external-information-system-services.md).

## Plain-language metaphor

Like putting safety specifications, inspection criteria, and the operating manual into the purchase agreement before buying equipment.

## Stagehand and operator guidance

Maintainers should make security and assurance expectations available for any future contracted components/services. Operators procuring hosting, CI, or support should specify controls, evidence, documentation protection, environment, and acceptance conditions in agreements appropriate to risk.

## Control enhancements

(1) require description of security-control functional properties; (2) require design/implementation information at defined detail; (3) require evidence of state-of-practice lifecycle and engineering methods; (4) withdrawn into CM-8(9); (5) require secure configurations at delivery and as reinstall/upgrade defaults; (6) for classified data, use evaluated/approved GOTS/COTS security products; (7) use CSE-approved protection profiles where available, otherwise require FIPS-validated cryptography for products relying on crypto, per source; (8) require a continuous-monitoring plan at defined detail; (9) identify intended functions, ports, protocols, and services early in development. Enhancements 6-7 are conditional on classified-information use and applicable policy.

## Assessment status

**Planned / not verified.** No Stagehand acquisition contract or acceptance evidence is assessed.

## Organisation-defined parameter suggestions

SA-4 enhancements assign design/implementation detail, development methods, security configurations, monitoring-plan detail, and intended functions/ports/protocols/services. **Suggestion for review:** include documented interfaces, high-level design, security-relevant configuration defaults, a monitoring plan, and an explicit list of required network services; tailor source-code disclosure and assurance depth to risk and contract.
