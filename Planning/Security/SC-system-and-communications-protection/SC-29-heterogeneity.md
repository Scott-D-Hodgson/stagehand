# SC-29 - Heterogeneity

**Source:** [ITSG-33 Annex 3A, SC-29](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc29).

## Control definition

Use a diverse set of information technologies for organisation-defined system components.

**Organisation-defined parameter:** components. **Suggestion for review:** consider diversity only for critical components where reduced common-mode failure outweighs added configuration/maintenance complexity.

## Supplemental guidance

Diversity can reduce the impact of exploits targeting one technology and some supply-chain failures, but increases management overhead and risk of configuration errors.

## Related controls

From the [official SC-29 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc29), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SA-14](../SA-system-and-services-acquisition/SA-14-criticality-analysis.md), [SC-27](SC-27-platform-independent-applications.md).

## Plain-language metaphor

Like having more than one route to a destination so one blocked road does not stop everything.

## Stagehand and operator guidance

Do not introduce variation without operational justification. Operators may use virtualization to separate untrusted workloads, while maintaining a small, managed, patched platform baseline.

## Control enhancements

(1) use virtualization to deploy diverse OSs/applications, changing them at a defined frequency; virtualization can also confine software of uncertain provenance.

## Assessment status

**Planned / risk-dependent; not verified.**
