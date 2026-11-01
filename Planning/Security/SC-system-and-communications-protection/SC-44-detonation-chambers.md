# SC-44 - Detonation Chambers

**Source:** [ITSG-33 Annex 3A, SC-44](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc44).

## Control definition

Employ a detonation-chamber capability within an assigned system, component, or location.

**Organisation-defined parameter:** scope/location. **Suggestion for review:** place suspicious document, application, or URL execution in a dedicated isolated analysis environment, never a production runner.

## Supplemental guidance

A detonation chamber is an isolated dynamic execution environment for inspecting suspicious attachments, applications, or URL requests for malicious code. Unlike a deception environment, it is intended to identify malware quickly and prevent propagation.

## Related controls

From the [official SC-44 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc44), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-7](SC-7-boundary-protection.md), [SC-25](SC-25-thin-nodes.md), [SC-26](SC-26-honeypots.md), [SC-30](SC-30-concealment-and-misdirection.md).

## Plain-language metaphor

Like opening a suspicious package inside a sealed test chamber instead of the office.

## Stagehand and operator guidance

Stagehand’s browser runner should not be treated as a detonation chamber unless purpose-built and independently isolated for malware analysis. Operators should use dedicated sandbox tooling and network controls.

## Control enhancements

None listed.

## Assessment status

**Planned / not applicable to standard Stagehand; specialized environment-dependent.**
