# PL-8 — Information Security Architecture

**Source:** [ITSG-33 Annex 3A, PL-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a312pl8).

## Control definition

Develop a system security architecture describing the protection philosophy/requirements, integration with enterprise architecture, and assumptions/dependencies on external services; review/update it at a defined cadence; and reflect planned changes in the security plan, CONOPS, and procurement.

**Organisation-defined parameter:** review frequency. **Suggestion for review:** annually and whenever a major dependency, trust boundary, or data flow changes.

## Supplemental guidance

Architecture describes placement of safeguards, interfaces and exchanged information, roles/privileges, information types, restoration priorities, and external dependencies. Coordinate with privacy officials. PL-8 is organisation-focused; SA-17 complements it for external development.

## Related controls

From the [official PL-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a312pl8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [PL-2](PL-2-system-security-plan.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-17](../SA-system-and-services-acquisition/SA-17-developer-security-architecture-and-design.md).
- **PL-8(1):** [SC-29](../SC-system-and-communications-protection/SC-29-heterogeneity.md), [SC-36](../SC-system-and-communications-protection/SC-36-distributed-processing-and-storage.md).
- **PL-8(2):** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md).

## Plain-language metaphor

This is the security map showing where the gates, guards, and trust boundaries sit and how they work together.

## Stagehand and operator guidance

Document editor/runner/browser separation, local files, credential flow, network egress, targets, reporting, and external providers. Organisations should integrate the deployment into enterprise architecture and review the privacy/security assumptions.

## Enhancements

1. **PL-8(1), defence-in-depth:** allocate safeguards across defined layers and ensure they reinforce one another.
2. **PL-8(2), supplier diversity:** obtain defined safeguards at different architecture locations/layers from different suppliers, where risk warrants.
