# SI-2 - Flaw Remediation

**Source:** [ITSG-33 Annex 3A, SI-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si2).

## Control definition

Identify, report, and correct system flaws; test relevant software/firmware updates for effectiveness and side effects before installation; install security-relevant updates within a defined period; and integrate remediation into configuration management.

**Organisation-defined parameter:** update timeframe. **Suggestion for review:** set risk/severity-based deadlines, for example critical 7 days and high 30 days, while documenting emergency change handling and test expectations.

## Supplemental guidance

Flaws can be found from advisories, scans, assessments, monitoring, incidents, or errors. Track fixes through change management and use authoritative vulnerability information; consider update source/signature and operational impact.

## Related controls

From the [official SI-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-8](../CM-configuration-management/CM-8-information-system-component-inventory.md), [MA-2](../MA-maintenance/MA-2-controlled-maintenance.md), [IR-4](../IR-incident-response/IR-4-incident-handling.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md), [SA-11](../SA-system-and-services-acquisition/SA-11-developer-security-testing.md), [SI-11](SI-11-error-handling.md).
- **SI-2(2):** [CM-6](../CM-configuration-management/CM-6-configuration-settings.md), [SI-4](SI-4-information-system-monitoring.md).

## Plain-language metaphor

Like logging a defect, checking the replacement part, installing it quickly, and recording the repair.

## Stagehand and operator guidance

Maintainers should track dependency and product flaws, test patches, and publish updates. Operators patch the host OS, browser, CI image, and Stagehand release under change controls; subscribe to relevant advisories.

## Control enhancements

(1) centrally manage remediation; (2) automate status checks at defined intervals; (3) measure remediation time and set benchmarks; (4) automated patch-management tools withdrawn into SI-2; (5) automatically install selected updates to defined components; (6) remove previous software/firmware versions after updates. Balance rapid patching with testing and availability.

## Assessment status

**Planned / not verified.** No patch process or SLA evidence asserted.
