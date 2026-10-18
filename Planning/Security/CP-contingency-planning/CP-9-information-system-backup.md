# CP-9 — Information System Backup

**Source:** [ITSG-33 Annex 3A, CP-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Back up user information, system-level information, and security-related documentation at defined frequencies aligned with recovery objectives; protect backup confidentiality, integrity, and availability at storage locations; and set retention periods for essential business information and archived backups.

**Organisation-defined parameters to review:** backup frequency by information category, retention periods, critical information to store separately, transfer time/rate, and dual-authorization scope.

## Supplemental guidance

System-level information includes system state, operating systems, applications, and licences; user-level information is other information. Integrity mechanisms may include signatures or hashes. This control addresses protection at storage locations; transit protection is handled elsewhere. Backups should reflect continuity and records requirements.

## In plain language

Make protected copies of both the work and the tools needed to use it, and periodically prove the copies are sound.

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
