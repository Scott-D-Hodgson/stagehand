# IR-4 — Incident Handling

**Source:** [ITSG-33 Annex 3A, IR-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir4).

## Control definition

Operate incident handling covering preparation, detection/analysis, containment, eradication, and recovery; coordinate it with contingency planning; and apply lessons learned to procedures, training, and exercises.

## Supplemental guidance

Incident handling depends on system and business capabilities and should be considered during system design. Information may come from audit, network, physical monitoring, user reports, and supply-chain events. Effective handling coordinates security, business, legal, HR, operations, procurement, and other roles.

## Related controls

From the [official IR-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [CP-4](../CP-contingency-planning/CP-4-contingency-plan-testing-and-exercises.md), [IR-2](IR-2-incident-response-training.md), [IR-3](IR-3-incident-response-testing-and-exercises.md), [IR-8](IR-8-incident-response-plan.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md), [SC-5](../SC-system-and-communications-protection/SC-5-denial-of-service-protection.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **IR-4(2):** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [AC-16](../AC-access-control/AC-16-security-attributes.md), [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-4](../CM-configuration-management/CM-4-security-impact-analysis.md).
- **IR-4(9):** [CP-10](../CP-contingency-planning/CP-10-information-system-recovery-and-reconstitution.md).

## Plain-language metaphor

Treat an incident like a leak: prepare supplies, find the source, contain it, clean it up, restore service, and improve the plumbing.

## Stagehand and operator guidance

For Stagehand-related incidents, operators should halt affected tasks, isolate the runner, preserve approved logs, revoke sessions/credentials, identify affected plans/targets/artifacts, and recover from trusted sources. Coordinate with target-service owners and providers. Ensure response actions do not spread sensitive artifacts.

## Enhancements

1. **IR-4(1), automated incident handling:** use automated mechanisms to support handling, such as incident-management systems.
2. **IR-4(2), dynamic reconfiguration:** reconfigure defined components rapidly to contain attacks or isolate systems.
3. **IR-4(3), continuity of operations:** define incidents and actions that preserve essential work.
4. **IR-4(4), information correlation:** combine incident details and responses for organisation-wide awareness.
5. **IR-4(5), automatic disabling:** automatically disable the system on defined security violations.
6. **IR-4(6), insider-threat capability:** provide specific insider-threat incident handling.
7. **IR-4(7), insider-threat coordination:** coordinate handling across defined organisational elements.
8. **IR-4(8), external coordination:** correlate/share defined incident information with external organisations.
9. **IR-4(9), dynamic response:** deploy defined capabilities rapidly in response to incidents.
10. **IR-4(10), supply-chain coordination:** coordinate incidents with organisations involved in the supply chain.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
