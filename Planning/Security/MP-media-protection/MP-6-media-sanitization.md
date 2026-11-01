# MP-6 — Media Sanitization

**Source:** [ITSG-33 Annex 3A, MP-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a310mp6).

## Control definition

Sanitize or destroy media before disposal, release from organisational control, or reuse, according to applicable sensitivity and standards.

**Organisation-defined parameter:** sanitization methods by media type/sensitivity.

## Supplemental guidance

Sanitization removes information so it cannot be recovered using applicable techniques. Select methods based on media technology, sensitivity, and reuse/disposal plans, and retain evidence where required.

## Related controls

From the [official MP-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a310mp6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [MA-2](../MA-maintenance/MA-2-controlled-maintenance.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md), [SC-4](../SC-system-and-communications-protection/SC-4-information-in-shared-resources.md).
- **MP-6(1):** [SI-12](../SI-system-and-information-integrity/SI-12-information-output-handling-and-retention.md).
- **MP-6(3):** [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md).
- **MP-6(7):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [MP-2](MP-2-media-access.md).

## Plain-language metaphor

Before giving away a whiteboard, erase it thoroughly; for sensitive writing, use a method that leaves no recoverable marks.

## Stagehand and operator guidance

Clear temporary plans, browser profiles, caches, traces, screenshots, and runner disks when no longer needed. Operators should use approved secure deletion, cryptographic erase, or destruction methods and account for cloud snapshots/backups. Deleting a visible file may not sanitize underlying storage.

## Enhancements

No enhancements are listed for MP-6 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
