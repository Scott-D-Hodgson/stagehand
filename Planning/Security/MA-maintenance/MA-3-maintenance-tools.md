# MA-3 — Maintenance Tools

**Source:** [ITSG-33 Annex 3A, MA-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Approve, control, and monitor system maintenance tools.

## Supplemental guidance

Diagnostic/repair tools can introduce malicious code intentionally or accidentally. The control concerns tools used specifically for maintenance, not ordinary components that happen to support system operation.

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

