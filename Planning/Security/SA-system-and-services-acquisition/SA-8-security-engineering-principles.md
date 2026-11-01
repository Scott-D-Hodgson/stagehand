# SA-8 - Security Engineering Principles

**Source:** [ITSG-33 Annex 3A, SA-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa8).

## Control definition

Apply information-system security engineering principles during specification, design, development, implementation, and modification.

## Supplemental guidance

Apply principles especially to new systems and major upgrades; apply them to legacy changes as feasible. Examples include layered protections, sound architecture and policy, lifecycle integration, defined boundaries, developer security skills, risk-tailored controls, threat modelling, and risk-informed decisions.

## Related controls

From the [official SA-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-3](SA-3-system-development-lifecycle.md), [SA-4](SA-4-acquisition-process.md), [SA-17](SA-17-developer-security-architecture-and-design.md), [SC-2](../SC-system-and-communications-protection/SC-2-application-partitioning.md), [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md).

## Plain-language metaphor

Like building safety into the blueprint and structure instead of adding a lock after construction.

## Stagehand and operator guidance

Maintainers should threat-model plan inputs, browser control, secrets, network destinations, generated artifacts, and update/release paths. Use layered validation, least privilege, isolation, and explicit trust boundaries as design requirements. Operators should assess how their network and host architecture support those boundaries.

## Control enhancements

(1) The organisation employs licensed and certified security engineers responsible for system security solutions. Applicability is organisational and depends on the selected system risk and staffing model; Stagehand cannot establish an operator's staffing qualification.

## Assessment status

**Planned / not verified.** No design review or implementation evidence is asserted.
