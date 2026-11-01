# CP-7 — Alternate Processing Site

**Source:** [ITSG-33 Annex 3A, CP-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp7).

## Control definition

Establish an alternate processing site and agreements to resume defined essential operations within defined recovery objectives; ensure equipment/supplies are available or can be delivered in time; and provide safeguards equivalent to the primary site.

**Organisation-defined parameters to review:** operations to resume, recovery period/objectives, required resources, and site safeguards.

## Supplemental guidance

Alternate processing sites are geographically distinct and provide processing capacity if the primary site is unavailable. Agreements cover access, physical/environmental controls, and personnel transfer in line with continuity plans.

## In plain language

If the main workshop is unusable, have a prepared second workshop with the tools and protections needed to keep essential work running.

## Related controls

From the [official CP-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](CP-2-contingency-plan.md), [CP-6](CP-6-alternate-storage-site.md), [CP-8](CP-8-telecommunications-services.md), [CP-9](CP-9-information-system-backup.md), [CP-10](CP-10-information-system-recovery-and-reconstitution.md), [MA-6](../MA-maintenance/MA-6-timely-maintenance.md).
- **CP-7(1):** [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md).
- **CP-7(2):** [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md).
- **CP-7(4):** [CM-2](../CM-configuration-management/CM-2-baseline-configuration.md), [CM-6](../CM-configuration-management/CM-6-configuration-settings.md).

## Stagehand initial assessment

Where Stagehand supports essential work, operators should define whether an alternate runner, browser service, or execution environment is needed, and test that it has equivalent identity, network, logging, and data protections. Keep software and configuration baselines consistent. This may be outside Stagehand’s responsibility in local-only deployments.

## Control enhancements

1. **CP-7(1), separation from primary:** choose an alternate site separated against relevant shared threats.
2. **CP-7(2), accessibility:** plan for access problems during area-wide disruption.
3. **CP-7(3), priority of service:** obtain provider priority consistent with availability/recovery needs.
4. **CP-7(4), preparation for use:** prepare configurations, supplies, and logistics in advance.
5. **CP-7(5), equivalent safeguards:** withdrawn and incorporated into CP-7 base control.
6. **CP-7(6), inability to return:** plan for situations that prevent return to the primary site.
