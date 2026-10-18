# CM-7 — Least Functionality

**Source:** [ITSG-33 Annex 3A, CM-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Configure the system to provide only essential capabilities and prohibit or restrict organisation-defined functions, ports, protocols, and services.

**Organisation-defined parameters to review:** prohibited/restricted functions, ports, protocols, services; review frequency; software allow/deny lists and update schedule.

## Supplemental guidance

Unused capabilities increase exposure. Review services and ports, disable unnecessary functions, and use host/network protections to detect or prevent prohibited activity. Limiting each component to needed functions can reduce risk.

## In plain language

Remove tools and doors the job does not need; fewer ways in mean fewer ways to misuse the system.

## Stagehand initial assessment

Limit runner/browser capabilities to the required automation functions. Avoid unnecessary browser extensions, remote debugging exposure, filesystem access, network egress, and host services. Provide documented safe defaults and allow operators to restrict destinations and permissions. Operators should enforce approved software execution and network policy at the host or network boundary.

## Control enhancements

1. **CM-7(1), periodic review:** periodically identify and disable unnecessary or insecure functions, ports, protocols, and services.
2. **CM-7(2), prevent program execution:** enforce defined software-use policies or approved execution rules.
3. **CM-7(3), registration compliance:** meet defined registration requirements for system functions/services.
4. **CM-7(4), unauthorized software/blacklisting:** block defined unauthorized programs under allow-all/deny-by-exception and update the list at a defined cadence.
5. **CM-7(5), authorized software/whitelisting:** allow only defined authorized programs under deny-all/permit-by-exception and maintain the list. The catalogue identifies this as the stronger restriction approach.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

