# SA-20 - Customized Development of Critical Components

**Source:** [ITSG-33 Annex 3A, SA-20](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa20).

## Control definition

Re-implement or custom develop assigned critical system components.

**Organisation-defined parameter:** critical components. **Suggestion for review:** use only after risk analysis identifies components whose threats cannot be adequately mitigated with available controls and where higher assurance is required.

## Supplemental guidance

Organisations may choose custom development when a component cannot be trusted because of specific threats/vulnerabilities and no viable safeguards adequately reduce risk. If it is not feasible, consider compensating protections such as enhanced auditing and restricted access to source/system utilities.

## Related controls

From the [official SA-20 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa20), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [SA-8](SA-8-security-engineering-principles.md), [SA-14](SA-14-criticality-analysis.md).

## Plain-language metaphor

Like commissioning a custom-made lock when an off-the-shelf lock cannot meet the required threat level.

## Stagehand and operator guidance

This is a risk-driven acquisition/development decision, not a default Stagehand feature. Maintainers should avoid claiming bespoke high-assurance components absent evidence. Operators should document the rationale and approval if custom replacement or compensating safeguards are needed.

## Control enhancements

None listed.

## Assessment status

**Planned / risk-dependent.** No critical-component determination is asserted.
