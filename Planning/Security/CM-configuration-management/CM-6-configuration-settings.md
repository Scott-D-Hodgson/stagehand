# CM-6 — Configuration Settings

**Source:** [ITSG-33 Annex 3A, CM-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish and document secure settings for information-technology products using defined security checklists and the most restrictive mode consistent with operations; implement them; approve documented deviations for defined components and needs; and control changes to settings.

**Organisation-defined parameters to review:** approved checklists, in-scope components, and allowable operational deviations.

## Supplemental guidance

Settings that affect security or function include accounts, permissions, ports, protocols, services, and remote connections across operating systems, applications, network devices, and other products. Organisation-wide settings can be tailored into system baselines.

## In plain language

Use a secure setup guide for each tool, then record and approve any exception instead of quietly changing the settings.

## Stagehand initial assessment

Document secure defaults for runner isolation, browser launch options, permissions, allowed destinations, storage, logging, and secret sources as implementation matures. Operators should apply approved host/browser baselines, centrally manage settings where available, and document exceptions with owner and rationale. Do not assume all deployment settings are controlled by Stagehand.

## Control enhancements

1. **CM-6(1), automated central management/application/verification:** centrally manage, apply, and verify defined component settings.
2. **CM-6(2), respond to unauthorized changes:** apply defined safeguards such as alerting or restoring settings.
3. **CM-6(3), unauthorized-change detection:** withdrawn into SI-7.
4. **CM-6(4), conformance demonstration:** withdrawn into CM-4.
