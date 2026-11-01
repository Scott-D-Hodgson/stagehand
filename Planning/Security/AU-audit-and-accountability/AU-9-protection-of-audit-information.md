# AU-9 — Protection of Audit Information

**Source:** [ITSG-33 Annex 3A, AU-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au9).

## Control definition

Protect audit information and audit tools from unauthorized access, alteration, or deletion.

**Organisation-defined parameters to review:** subset of privileged users for audit management and read-only access; information subject to dual authorization.

## Supplemental guidance

Audit information includes records, settings, and reports needed to audit system activity. This control addresses technical protection; physical and media controls provide complementary safeguards. Separate audit privileges from general administrative privileges where feasible.

## In plain language

The referee’s notebook must be protected from anyone who could change the score after the game.

## Related controls

From the [official AU-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [PE-2](../PE-physical-and-environmental-protection/PE-2-physical-access-authorizations.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md).
- **AU-9(1):** [AU-4](AU-4-audit-storage-capacity.md), [AU-5](AU-5-response-to-audit-processing-failures.md).
- **AU-9(2):** [AU-4](AU-4-audit-storage-capacity.md), [AU-5](AU-5-response-to-audit-processing-failures.md), [AU-11](AU-11-audit-record-retention.md).
- **AU-9(3):** [AU-10](AU-10-non-repudiation.md), [SC-12](../SC-system-and-communications-protection/SC-12-cryptographic-key-establishment-and-management.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **AU-9(4):** [AC-5](../AC-access-control/AC-5-separation-of-duties.md).
- **AU-9(5):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [MP-2](../MP-media-protection/MP-2-media-access.md).

## Stagehand initial assessment

Operators should restrict log access, separate audit administration from ordinary application administration, encrypt data in transit and at rest where supported, and forward records to a separately controlled repository. Protect configuration and collection tools too. Ensure retention/deletion is governed by policy; do not claim product logs are tamper-proof without evidence.

## Control enhancements

1. **AU-9(1), hardware write-once media:** store audit trails on hardware-enforced write-once media.
2. **AU-9(2), separate-system backup:** back up records to a physically different system/component at a defined frequency.
3. **AU-9(3), cryptographic protection:** use cryptography to protect integrity of audit information and tools.
4. **AU-9(4), subset of privileged users:** limit audit-management access to an organisation-defined privileged subset.
5. **AU-9(5), dual authorization:** require two authorized people for defined movement or deletion actions.
6. **AU-9(6), read-only access:** limit specified privileged users to read-only audit access.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
