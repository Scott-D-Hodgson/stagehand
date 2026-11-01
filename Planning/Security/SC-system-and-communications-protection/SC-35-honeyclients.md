# SC-35 - Honeyclients

**Source:** [ITSG-33 Annex 3A, SC-35](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc35).

## Control definition

Include components that proactively seek malicious websites or web-based malicious code.

## Supplemental guidance

Unlike honeypots, honeyclients actively probe external sites. Isolate them (for example, with virtualization) so discovered malicious code cannot infect organisational systems.

## Related controls

From the [official SC-35 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc35), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-26](SC-26-honeypots.md), [SC-44](SC-44-detonation-chambers.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

## Plain-language metaphor

Like sending a protected scout to inspect dangerous sites and report back without bringing anything hazardous home.

## Stagehand and operator guidance

Stagehand browser automation should not be used to browse for malware unless specifically designed and isolated for that purpose. Operators should use dedicated sandboxed security-analysis tools for this activity.

## Control enhancements

None listed.

## Assessment status

**Planned / not applicable to standard Stagehand function; specialized security tooling only.**
