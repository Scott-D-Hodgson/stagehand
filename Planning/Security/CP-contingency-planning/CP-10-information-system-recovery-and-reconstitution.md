# CP-10 — Information System Recovery and Reconstitution

**Source:** [ITSG-33 Annex 3A, CP-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Recover and reconstitute the system to a known state following disruption, compromise, or failure.

## Supplemental guidance

Recovery restores business functions; reconstitution returns systems to full operation afterward. Activities should reflect mission priorities and defined recovery objectives, disable temporary recovery capabilities when no longer needed, assess restored security, resume monitoring, consider reauthorization, and prepare for future disruptions. Use automated mechanisms and manual procedures as appropriate.

## In plain language

First get essential work running safely again; then rebuild the normal service from a trusted recipe and check that its safeguards are back.

## Stagehand initial assessment

Define trusted-source recovery of the application, runner image, browser, configuration, and plans. After suspected compromise, rotate credentials, invalidate browser sessions, validate downloaded artifacts, restore logs/monitoring, and obtain required approvals before resuming automation. Operators must test recovery and avoid restoring compromised state as if it were clean.

## Control enhancements

1. **CP-10(1), contingency-plan testing:** withdrawn and incorporated into CP-4.
2. **CP-10(2), transaction recovery:** implement rollback/journaling for transaction-based systems where applicable.
3. **CP-10(3), compensating security controls:** withdrawn/addressed through tailoring procedures.
4. **CP-10(4), restore within time period:** restore components within defined periods from configuration-controlled, integrity-protected known-good information.
5. **CP-10(5), failover capability:** withdrawn and incorporated into SI-13.
6. **CP-10(6), component protection:** protect backup and restoration hardware, firmware, and software.
