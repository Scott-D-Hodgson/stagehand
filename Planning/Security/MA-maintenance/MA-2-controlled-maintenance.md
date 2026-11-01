# MA-2 — Controlled Maintenance

**Source:** [ITSG-33 Annex 3A, MA-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma2).

## Control definition

Schedule, perform, document, and review maintenance/repair records; approve and monitor all local and remote maintenance; require designated approval before equipment leaves the facility; sanitize media before off-site service; recheck affected controls afterward; and retain defined maintenance details.

**Organisation-defined parameters:** approval roles and maintenance-record fields.

## Supplemental guidance

Applies to system components, including applications, and to in-contract, warranty, in-house, and software maintenance. Records commonly include date/time, technicians/escorts, work performed, and removed/replaced components. Consider supply-chain risks.

## Related controls

From the [official MA-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-4](../CM-configuration-management/CM-4-security-impact-analysis.md), [MA-4](MA-4-non-local-maintenance.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md), [PE-16](../PE-physical-and-environmental-protection/PE-16-delivery-and-removal.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md).
- **Unassigned enhancement guidance:** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [MA-3](MA-3-maintenance-tools.md). The source places this enhancement-guidance list before the numbered enhancements without assigning it to one.

## Plain-language metaphor

Log every repair, approve who works on the machine, wipe it before it leaves, then test the safety features when it returns.

## Stagehand and operator guidance

Track Stagehand upgrades, browser/driver updates, image rebuilds, and support actions. For hosted or off-site environments, document provider maintenance and applicable assurance. Before repair or transfer, remove or sanitize sensitive plans, credentials, profiles, and logs; afterward verify permissions, logging, and integrity.

## Enhancements

1. **MA-2(1), record content:** withdrawn and incorporated into MA-2 base control.
2. **MA-2(2), automated maintenance activities:** automate scheduling/documentation and maintain complete current records of requested, scheduled, active, and completed maintenance.
