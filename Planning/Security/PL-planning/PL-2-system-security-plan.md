# PL-2 — System Security Plan

**Source:** [ITSG-33 Annex 3A, PL-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a312pl2).

## Control definition

Create a security plan aligned with enterprise architecture that defines system boundary and mission context, categorization/rationale, operating environment and connections, security requirements/overlays, planned or implemented controls and tailoring rationale, and obtains authorizing approval before implementation. Distribute it to defined roles, review/update it for defined cadence and material changes, and protect it from unauthorized disclosure or modification.

**Organisation-defined parameters:** recipients and review cadence. **Suggestion for review:** review annually and after boundary, hosting, data, or major control changes; restrict access because plans reveal architecture and weaknesses.

## Supplemental guidance

Plans connect requirements to controls and explain at a high level how controls satisfy them. They specify parameter choices sufficiently to support design and risk decisions. A plan can be a collection of referenced documents rather than one file; detailed contingency/incident procedures can be referenced.

## Related controls

From the [official PL-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a312pl2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [AC-14](../AC-access-control/AC-14-permitted-actions-without-identification-or-authentication.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-20](../AC-access-control/AC-20-use-of-external-systems.md), [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-3](../CA-security-assessment-and-authorization/CA-3-information-system-connections.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-9](../CM-configuration-management/CM-9-configuration-management-plan.md), [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [IR-8](../IR-incident-response/IR-8-incident-response-plan.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [MA-5](../MA-maintenance/MA-5-maintenance-personnel.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [PL-7](PL-7-security-concepts-of-operation.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-17](../SA-system-and-services-acquisition/SA-17-developer-security-architecture-and-design.md).
- **PL-2(3):** [CP-4](../CP-contingency-planning/CP-4-contingency-plan-testing-and-exercises.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md).

## Plain-language metaphor

It is the system’s security blueprint: what is inside the fence, what protections are planned, and who approved the design.

## Stagehand and operator guidance

The adopting organisation should define whether Stagehand, browser, runner, host, identity, network, and target systems are in one authorization boundary or multiple. Document data flows, external dependencies, control ownership, parameter decisions, and rationale. Protect the plan. This repository’s assessment is not a security plan for an operational system.

## Enhancements

1. **PL-2(1), concept of operations:** withdrawn and incorporated into PL-7.
2. **PL-2(2), functional architecture:** withdrawn and incorporated into PL-8.
3. **PL-2(3), coordinate with other organisational entities:** plan/coordinate assessments, maintenance, patching, tests, and other security activities before performing them.
