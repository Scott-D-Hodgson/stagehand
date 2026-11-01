# AC-25 — Reference Monitor

**Source:** [ITSG-33 Annex 3A, AC-25](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac25).

## Control definition

Implement a reference monitor that is tamper-resistant, invoked for every access, and sufficiently small and analyzable to support assurance that it correctly enforces the defined access-control policy.

**Organisation-defined parameter to review:** access-control policy enforced by the monitor.

## Supplemental guidance

A reference monitor is a security mechanism between subjects (users or processes) and objects (data or resources). It must not be bypassable, must mediate all relevant access, and must be amenable to analysis. Modern systems may realize these properties across multiple cooperating components rather than one standalone module.

## In plain language

It is a checkpoint every person must pass before entering a room. The checkpoint must not be easy to bypass, and it must consistently apply the posted rules.

## Related controls

From the [official AC-25 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac25), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](AC-3-access-enforcement.md), [AC-16](AC-16-security-attributes.md), [SC-3](../SC-system-and-communications-protection/SC-3-security-function-isolation.md), [SC-39](../SC-system-and-communications-protection/SC-39-process-isolation.md).

## Stagehand initial assessment

Stagehand is not asserted to implement a complete reference monitor. It should rely on and preserve the enforcement provided by the OS, browser, identity provider, and target services, while avoiding privileged bypass paths. Operators should test authorization at service boundaries, constrain browser and filesystem permissions, and ensure all automation actions pass through approved controls. Treat UI-only restrictions as insufficient where the underlying service can be reached directly.

## Control enhancements

No enhancements are listed for this control in the Annex 3A catalogue.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
