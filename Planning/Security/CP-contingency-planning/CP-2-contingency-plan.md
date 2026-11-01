# CP-2 — Contingency Plan

**Source:** [ITSG-33 Annex 3A, CP-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp2).

## Control definition

Create a system contingency plan identifying essential functions, recovery objectives/priorities/metrics, responsible roles and contacts, continuity during disruption/compromise/failure, and secure full restoration. Obtain approval; distribute it to designated personnel; coordinate with incident response; review on a defined schedule; update for changes and lessons; communicate changes; and protect the plan against unauthorized disclosure or alteration.

**Organisation-defined parameters to review:** approvers, recipients, review cadence, and recovery time/point objectives for enhancements 3–4. **Suggested values for review:** approve through the system owner and business-continuity authority; review annually and after exercises/incidents; set recovery objectives from a business-impact analysis.

## Supplemental guidance

Contingency planning supports organisational continuity and includes restoration plus alternative business processes. It should consider development through operations and address availability, integrity, and confidentiality incidents. Options include graceful degradation, shutdown, manual fallback, alternate flows, and restricted operating modes. Coordinate with incident handling.

## In plain language

It is the emergency plan for a shop: know what work matters most, who does what, how to keep essential work going, and how to restore safely.

## Related controls

From the [official CP-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-14](../AC-access-control/AC-14-permitted-actions-without-identification-or-authentication.md), [CP-6](CP-6-alternate-storage-site.md), [CP-7](CP-7-alternate-processing-site.md), [CP-8](CP-8-telecommunications-services.md), [CP-9](CP-9-information-system-backup.md), [CP-10](CP-10-information-system-recovery-and-reconstitution.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [IR-8](../IR-incident-response/IR-8-incident-response-plan.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md).
- **CP-2(3):** [PE-12](../PE-physical-and-environmental-protection/PE-12-emergency-lighting.md).
- **CP-2(4):** [PE-12](../PE-physical-and-environmental-protection/PE-12-emergency-lighting.md).
- **CP-2(5):** [PE-12](../PE-physical-and-environmental-protection/PE-12-emergency-lighting.md).
- **CP-2(6):** [PE-12](../PE-physical-and-environmental-protection/PE-12-emergency-lighting.md).
- **CP-2(7):** [SA-9](../SA-system-and-services-acquisition/SA-9-external-information-system-services.md).
- **CP-2(8):** [SA-14](../SA-system-and-services-acquisition/SA-14-criticality-analysis.md), [SA-15](../SA-system-and-services-acquisition/SA-15-development-process-standards-and-tools.md).

## Stagehand initial assessment

Operators should define how to preserve or safely stop automation, recover plans/configuration and approved artifacts, rotate credentials after compromise, and restore a known-good runner/browser environment. Include dependency outages, compromised automation, unavailable target systems, and accidental data exposure. Protect plan copies because they can reveal system details or contain sensitive workflow information.

## Control enhancements

1. **CP-2(1), coordinate with related plans:** coordinate with business continuity, disaster recovery, incident response, crisis communications, and other responsible planning teams.
2. **CP-2(2), capacity planning:** ensure compute, telecom, and environmental capacity exists for contingency operations.
3. **CP-2(3), resume essential functions:** plan to resume essential functions within an organisation-defined time.
4. **CP-2(4), resume all functions:** plan to restore all missions/functions within an organisation-defined time.
5. **CP-2(5), continue essential functions:** sustain essential operations with little/no interruption until full restoration.
6. **CP-2(6), alternate site:** transfer essential operations to alternate processing/storage sites with little/no interruption until restoration.
7. **CP-2(7), external service providers:** coordinate contingency plans with providers on which the organisation depends.
8. **CP-2(8), identify critical assets:** identify technical and operational assets essential to business functions.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
