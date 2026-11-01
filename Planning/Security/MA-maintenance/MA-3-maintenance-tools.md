# MA-3 — Maintenance Tools

**Source:** [ITSG-33 Annex 3A, MA-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma3).

## Control definition

Approve, control, and monitor system maintenance tools.

## Supplemental guidance

Diagnostic/repair tools can introduce malicious code intentionally or accidentally. The control concerns tools used specifically for maintenance, not ordinary components that happen to support system operation.

## Related controls

From the [official MA-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [MA-2](MA-2-controlled-maintenance.md), [MA-5](MA-5-maintenance-personnel.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md).
- **MA-3(1):** [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **MA-3(2):** [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md).
- **MA-3(4):** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-5](../AC-access-control/AC-5-separation-of-duties.md), [AC-6](../AC-access-control/AC-6-least-privilege.md).

## Plain-language metaphor

Inspect a repairer’s toolbox before it enters the workshop; tools can carry contamination as well as fix machines.

## Stagehand and operator guidance

Use approved diagnostic binaries, browser tooling, and package sources. Verify provenance and integrity of maintenance media; restrict tool access; prevent removal of devices containing organisational data without sanitization or explicit approval. Operators should supervise third-party troubleshooting access.

## Enhancements

1. **MA-3(1), inspect tools:** inspect tools brought into facilities for unauthorized changes or malware.
2. **MA-3(2), inspect media:** scan media containing diagnostic/test programs before use.
3. **MA-3(3), prevent unauthorized removal:** verify equipment contains no organisation data, sanitize/destroy it, retain it, or obtain explicit exemption before removal.
4. **MA-3(4), restricted tool use:** limit maintenance-tool use to authorized personnel.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
