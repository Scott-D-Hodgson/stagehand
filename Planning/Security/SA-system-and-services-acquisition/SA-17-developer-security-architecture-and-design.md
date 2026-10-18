# SA-17 - Developer Security Architecture and Design

**Source:** [ITSG-33 Annex 3A, SA-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Require the developer to provide a design specification and security architecture that aligns with the organisation’s architecture, accurately describes required security functions and control allocation across physical/logical components, and explains how security mechanisms work together.

## Supplemental guidance

Primarily aimed at external developers, though it can apply to internal development. It helps organisations ensure outsourced systems fit enterprise and security architecture; PL-8 is more directed at internal architecture development.

## Plain-language metaphor

Like receiving both the building blueprint and a clear map of how its locks, alarms, and access points work together.

## Stagehand and operator guidance

Maintainers should document component boundaries, data flows, trust assumptions, and how planned safeguards compose. Operators should compare that design with local identity, network, browser, and data-handling architecture before deployment.

## Control enhancements

(1) formal policy model and proof of internal consistency/sufficiency; (2) identify security-relevant components and justify completeness; (3) formal top-level specification and correspondence evidence; (4) informal descriptive specification and correspondence demonstration; (5) conceptually simple protection mechanisms with deliberate internal structure; (6) structure components to facilitate testing; (7) structure components to support least-privilege access. The formal-model/correspondence enhancements are high-assurance methods and should be selected based on risk and system requirements.

## Assessment status

**Planned / not verified.** No approved Stagehand security architecture is asserted.

## Organisation-defined parameter suggestions

SA-17(1) may require organisation-defined policy elements; other enhancements select formal/informal methods and scope. **Suggestion for review:** start with the security-relevant interfaces and required safeguards identified in the system plan; require formal proof only where assurance needs and feasible methods justify it.
