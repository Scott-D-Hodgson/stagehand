# CP-9 — Information System Backup

**Source:** [ITSG-33 Annex 3A, CP-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp9).

## Control definition

Back up user information, system-level information, and security-related documentation at defined frequencies aligned with recovery objectives; protect backup confidentiality, integrity, and availability at storage locations; and set retention periods for essential business information and archived backups.

**Organisation-defined parameters to review:** backup frequency by information category, retention periods, critical information to store separately, transfer time/rate, and dual-authorization scope.

## Supplemental guidance

System-level information includes system state, operating systems, applications, and licences; user-level information is other information. Integrity mechanisms may include signatures or hashes. This control addresses protection at storage locations; transit protection is handled elsewhere. Backups should reflect continuity and records requirements.

## In plain language

Make protected copies of both the work and the tools needed to use it, and periodically prove the copies are sound.

## Related controls

From the [official CP-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](CP-2-contingency-plan.md), [CP-6](CP-6-alternate-storage-site.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).
- **CP-9(1):** [CP-4](CP-4-contingency-plan-testing-and-exercises.md).
- **CP-9(2):** [CP-4](CP-4-contingency-plan-testing-and-exercises.md).
- **CP-9(3):** [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md).
- **CP-9(6):** [CP-7](CP-7-alternate-processing-site.md), [CP-10](CP-10-information-system-recovery-and-reconstitution.md).
- **CP-9(7):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [MP-2](../MP-media-protection/MP-2-media-access.md).

## Stagehand initial assessment

Operators should determine whether to back up user-owned test plans, configurations, approved reports, or security documentation. Exclude secrets, browser profiles, and session artifacts unless explicitly needed and protected. Encrypt and access-control backups, set retention/deletion policy, and test restores. Treat repository backups and cloud-service backups as separate responsibilities.

## Control enhancements

1. **CP-9(1), reliability/integrity testing:** test backups at a defined frequency.
2. **CP-9(2), restoration using sampling:** use sampled backup information to restore selected functions during contingency exercises.
3. **CP-9(3), separate storage for critical information:** store defined critical software/security information separately from the operational system.
4. **CP-9(4), protection from unauthorized modification:** withdrawn and incorporated into CP-9 base control.
5. **CP-9(5), transfer to alternate storage:** transfer backups within defined time/rate consistent with recovery objectives.
6. **CP-9(6), redundant secondary system:** maintain a non-collocated secondary system activatable without loss or disruption.
7. **CP-9(7), dual authorization:** require two qualified people for deletion/destruction of defined backup data.
