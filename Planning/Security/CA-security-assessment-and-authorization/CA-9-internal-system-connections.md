# CA-9 — Internal System Connections

**Source:** [ITSG-33 Annex 3A, CA-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca9).

## Control definition

Authorize defined components or component classes to connect within the system and document each connection’s interfaces, security requirements, and information exchanged.

**Organisation-defined parameters to review:** authorized components/classes and connection details.

## Supplemental guidance

Internal connections include separate components such as workstations, mobile devices, printers, sensors, or servers. Organisations may authorize classes that share a baseline rather than approve each instance individually.

## In plain language

Even inside one building, decide which rooms and machines may connect and what may pass between them.

## Related controls

From the [official CA-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md), [CA-7](CA-7-continuous-monitoring.md), [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [IA-3](../IA-identification-and-authentication/IA-3-device-identification-and-authentication.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **CA-9(1):** [CM-6](../CM-configuration-management/CM-6-configuration-settings.md).

## Stagehand initial assessment

Document connections among the Stagehand UI/editor, runner, browser process, local files, orchestration service, and target applications. Restrict local control interfaces to intended components and users. Operators should inventory supporting devices/services and confirm their baselines before joining them to the deployment.

## Control enhancements

1. **CA-9(1), security compliance checks:** check component compliance, such as baseline configuration, before establishing an internal connection.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
