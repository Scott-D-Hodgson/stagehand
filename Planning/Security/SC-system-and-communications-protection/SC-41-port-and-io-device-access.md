# SC-41 - Port and I/O Device Access

**Source:** [ITSG-33 Annex 3A, SC-41](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc41).

## Control definition

Physically disable or remove assigned connection ports or input/output devices on assigned systems/components.

**Organisation-defined parameters:** ports/devices and components. **Suggestion for review:** identify removable-media and unused I/O risks; disable ports physically or through managed controls where removal is impractical.

## Supplemental guidance

Examples include USB/FireWire ports and CD/DVD drives. Disabling them can reduce data exfiltration and introduction of malicious code.

## Related controls

From the [official SC-41 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc41), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language metaphor

Like sealing unused doors and mail slots to reduce ways in or out.

## Stagehand and operator guidance

Stagehand cannot control physical ports. Operators should use endpoint management and physical safeguards on runner hosts handling sensitive information, consistent with operational needs.

## Control enhancements

None listed.

## Assessment status

**Planned / endpoint-dependent; not verified.**
