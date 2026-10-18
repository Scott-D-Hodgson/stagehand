# SI-2 - Flaw Remediation

**Source:** [ITSG-33 Annex 3A, SI-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Identify, report, and correct system flaws; test relevant software/firmware updates for effectiveness and side effects before installation; install security-relevant updates within a defined period; and integrate remediation into configuration management.

**Organisation-defined parameter:** update timeframe. **Suggestion for review:** set risk/severity-based deadlines, for example critical 7 days and high 30 days, while documenting emergency change handling and test expectations.

## Supplemental guidance

Flaws can be found from advisories, scans, assessments, monitoring, incidents, or errors. Track fixes through change management and use authoritative vulnerability information; consider update source/signature and operational impact.

## Plain-language metaphor

Like logging a defect, checking the replacement part, installing it quickly, and recording the repair.

## Stagehand and operator guidance

Maintainers should track dependency and product flaws, test patches, and publish updates. Operators patch the host OS, browser, CI image, and Stagehand release under change controls; subscribe to relevant advisories.

## Control enhancements

(1) centrally manage remediation; (2) automate status checks at defined intervals; (3) measure remediation time and set benchmarks; (4) automated patch-management tools withdrawn into SI-2; (5) automatically install selected updates to defined components; (6) remove previous software/firmware versions after updates. Balance rapid patching with testing and availability.

## Assessment status

**Planned / not verified.** No patch process or SLA evidence asserted.
