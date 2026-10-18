# SC-35 - Honeyclients

**Source:** [ITSG-33 Annex 3A, SC-35](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Include components that proactively seek malicious websites or web-based malicious code.

## Supplemental guidance

Unlike honeypots, honeyclients actively probe external sites. Isolate them (for example, with virtualization) so discovered malicious code cannot infect organisational systems.

## Plain-language metaphor

Like sending a protected scout to inspect dangerous sites and report back without bringing anything hazardous home.

## Stagehand and operator guidance

Stagehand browser automation should not be used to browse for malware unless specifically designed and isolated for that purpose. Operators should use dedicated sandboxed security-analysis tools for this activity.

## Control enhancements

None listed.

## Assessment status

**Planned / not applicable to standard Stagehand function; specialized security tooling only.**
