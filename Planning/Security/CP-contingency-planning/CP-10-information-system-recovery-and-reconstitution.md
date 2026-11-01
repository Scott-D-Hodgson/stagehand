# CP-10 — Information System Recovery and Reconstitution

**Source:** [ITSG-33 Annex 3A, CP-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp10).

## Control definition

Recover and reconstitute the system to a known state following disruption, compromise, or failure.

## Supplemental guidance

Recovery restores business functions; reconstitution returns systems to full operation afterward. Activities should reflect mission priorities and defined recovery objectives, disable temporary recovery capabilities when no longer needed, assess restored security, resume monitoring, consider reauthorization, and prepare for future disruptions. Use automated mechanisms and manual procedures as appropriate.

## In plain language

First get essential work running safely again; then rebuild the normal service from a trusted recipe and check that its safeguards are back.

## Related controls

From the [official CP-10 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp10), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-6](../CA-security-assessment-and-authorization/CA-6-security-authorization.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CP-2](CP-2-contingency-plan.md), [CP-4](CP-4-contingency-plan-testing-and-exercises.md), [CP-6](CP-6-alternate-storage-site.md), [CP-7](CP-7-alternate-processing-site.md), [CP-9](CP-9-information-system-backup.md), [SC-24](../SC-system-and-communications-protection/SC-24-fail-in-known-state.md).
- **CP-10(4):** [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md).
- **CP-10(6):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md).

## Stagehand initial assessment

Define trusted-source recovery of the application, runner image, browser, configuration, and plans. After suspected compromise, rotate credentials, invalidate browser sessions, validate downloaded artifacts, restore logs/monitoring, and obtain required approvals before resuming automation. Operators must test recovery and avoid restoring compromised state as if it were clean.

## Control enhancements

1. **CP-10(1), contingency-plan testing:** withdrawn and incorporated into CP-4.
2. **CP-10(2), transaction recovery:** implement rollback/journaling for transaction-based systems where applicable.
3. **CP-10(3), compensating security controls:** withdrawn/addressed through tailoring procedures.
4. **CP-10(4), restore within time period:** restore components within defined periods from configuration-controlled, integrity-protected known-good information.
5. **CP-10(5), failover capability:** withdrawn and incorporated into SI-13.
6. **CP-10(6), component protection:** protect backup and restoration hardware, firmware, and software.
