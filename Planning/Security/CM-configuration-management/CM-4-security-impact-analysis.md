# CM-4 — Security Impact Analysis

**Source:** [ITSG-33 Annex 3A, CM-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm4).

## Control definition

Analyse proposed system changes for potential security impact before implementing them.

## Supplemental guidance

Qualified personnel with security responsibilities should assess how a change affects controls and risk. Analysis may review security plans and design records and determine whether new safeguards are needed. Scale effort to system sensitivity.

## In plain language

Before renovating a house, check how the work could affect wiring, exits, and structural supports—not just the room being changed.

## Related controls

From the [official CM-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-3](CM-3-configuration-change-control.md), [CM-9](CM-9-configuration-management-plan.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md).
- **CM-4(1):** [SA-11](../SA-system-and-services-acquisition/SA-11-developer-security-testing.md), [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).
- **CM-4(2):** [SA-11](../SA-system-and-services-acquisition/SA-11-developer-security-testing.md).

## Stagehand initial assessment

Review changes to browser permissions, task-plan actions, network destinations, credential handling, logging, dependencies, release/update mechanisms, and data artifacts for security impacts. Include deployment changes such as remote hosting or persistent browser profiles. Record findings and required mitigations before operational release.

## Control enhancements

1. **CM-4(1), separate test environments:** analyse changes in a logically or physically isolated test environment before operations, preventing test activity or data from crossing boundaries.
2. **CM-4(2), verification of security functions:** after changes, verify security functions remain correctly implemented and produce required outcomes.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
