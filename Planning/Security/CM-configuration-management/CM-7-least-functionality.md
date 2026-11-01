# CM-7 — Least Functionality

**Source:** [ITSG-33 Annex 3A, CM-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm7).

## Control definition

Configure the system to provide only essential capabilities and prohibit or restrict organisation-defined functions, ports, protocols, and services.

**Organisation-defined parameters to review:** prohibited/restricted functions, ports, protocols, services; review frequency; software allow/deny lists and update schedule.

## Supplemental guidance

Unused capabilities increase exposure. Review services and ports, disable unnecessary functions, and use host/network protections to detect or prevent prohibited activity. Limiting each component to needed functions can reduce risk.

## In plain language

Remove tools and doors the job does not need; fewer ways in mean fewer ways to misuse the system.

## Related controls

From the [official CM-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-6](../AC-access-control/AC-6-least-privilege.md), [CM-2](CM-2-baseline-configuration.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md).
- **CM-7(1):** [AC-18](../AC-access-control/AC-18-wireless-access.md), [CM-7](CM-7-least-functionality.md), [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md).
- **CM-7(2):** [CM-8](CM-8-information-system-component-inventory.md).
- **CM-7(4):** [CM-6](CM-6-configuration-settings.md), [CM-8](CM-8-information-system-component-inventory.md).
- **CM-7(5):** [CM-2](CM-2-baseline-configuration.md), [CM-6](CM-6-configuration-settings.md), [CM-8](CM-8-information-system-component-inventory.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md), [SC-34](../SC-system-and-communications-protection/SC-34-non-modifiable-executable-programs.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).

## Stagehand initial assessment

Limit runner/browser capabilities to the required automation functions. Avoid unnecessary browser extensions, remote debugging exposure, filesystem access, network egress, and host services. Provide documented safe defaults and allow operators to restrict destinations and permissions. Operators should enforce approved software execution and network policy at the host or network boundary.

## Control enhancements

1. **CM-7(1), periodic review:** periodically identify and disable unnecessary or insecure functions, ports, protocols, and services.
2. **CM-7(2), prevent program execution:** enforce defined software-use policies or approved execution rules.
3. **CM-7(3), registration compliance:** meet defined registration requirements for system functions/services.
4. **CM-7(4), unauthorized software/blacklisting:** block defined unauthorized programs under allow-all/deny-by-exception and update the list at a defined cadence.
5. **CM-7(5), authorized software/whitelisting:** allow only defined authorized programs under deny-all/permit-by-exception and maintain the list. The catalogue identifies this as the stronger restriction approach.

## Current repository context

Step dispatch supports a fixed action vocabulary and caller-validated steps, without arbitrary plan JavaScript. This does not constrain JavaScript served by target pages or enforce network egress. Loops and run-level concurrency policy remain later work. Configurable target allowlists are not an implemented product option.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
