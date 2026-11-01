# SA-17 - Developer Security Architecture and Design

**Source:** [ITSG-33 Annex 3A, SA-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa17).

## Control definition

Require the developer to provide a design specification and security architecture that aligns with the organisation’s architecture, accurately describes required security functions and control allocation across physical/logical components, and explains how security mechanisms work together.

## Supplemental guidance

Primarily aimed at external developers, though it can apply to internal development. It helps organisations ensure outsourced systems fit enterprise and security architecture; PL-8 is more directed at internal architecture development.

## Related controls

From the [official SA-17 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa17), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [PL-8](../PL-planning/PL-8-information-security-architecture.md), [SA-3](SA-3-system-development-lifecycle.md), [SA-8](SA-8-security-engineering-principles.md).
- **SA-17(2):** [SA-5](SA-5-information-system-documentation.md).
- **SA-17(3):** [SA-5](SA-5-information-system-documentation.md).
- **SA-17(4):** [SA-5](SA-5-information-system-documentation.md).
- **SA-17(5):** [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md).
- **SA-17(6):** [SA-11](SA-11-developer-security-testing.md).
- **SA-17(7):** [AC-5](../AC-access-control/AC-5-separation-of-duties.md), [AC-6](../AC-access-control/AC-6-least-privilege.md).

## Plain-language metaphor

Like receiving both the building blueprint and a clear map of how its locks, alarms, and access points work together.

## Stagehand and operator guidance

Maintainers should document component boundaries, data flows, trust assumptions, and how planned safeguards compose. Operators should compare that design with local identity, network, browser, and data-handling architecture before deployment.

## Control enhancements

(1) formal policy model and proof of internal consistency/sufficiency; (2) identify security-relevant components and justify completeness; (3) formal top-level specification and correspondence evidence; (4) informal descriptive specification and correspondence demonstration; (5) conceptually simple protection mechanisms with deliberate internal structure; (6) structure components to facilitate testing; (7) structure components to support least-privilege access. The formal-model/correspondence enhancements are high-assurance methods and should be selected based on risk and system requirements.

## Current repository context

Package boundaries distinguish shared validation, Node-only plan-file loading, result shape validation, and browser execution. The CLI/editor remain scaffolds; there is no implemented editor-to-runner service or hosted multi-tenant architecture. These boundaries require deployment-specific security review rather than implying an approved security architecture.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No approved Stagehand security architecture is asserted.

## Organisation-defined parameter suggestions

SA-17(1) may require organisation-defined policy elements; other enhancements select formal/informal methods and scope. **Suggestion for review:** start with the security-relevant interfaces and required safeguards identified in the system plan; require formal proof only where assurance needs and feasible methods justify it.
