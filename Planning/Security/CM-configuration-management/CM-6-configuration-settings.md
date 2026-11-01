# CM-6 — Configuration Settings

**Source:** [ITSG-33 Annex 3A, CM-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm6).

## Control definition

Establish and document secure settings for information-technology products using defined security checklists and the most restrictive mode consistent with operations; implement them; approve documented deviations for defined components and needs; and control changes to settings.

**Organisation-defined parameters to review:** approved checklists, in-scope components, and allowable operational deviations.

## Supplemental guidance

Settings that affect security or function include accounts, permissions, ports, protocols, services, and remote connections across operating systems, applications, network devices, and other products. Organisation-wide settings can be tailored into system baselines.

## In plain language

Use a secure setup guide for each tool, then record and approve any exception instead of quietly changing the settings.

## Related controls

From the [official CM-6 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm6), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [CM-2](CM-2-baseline-configuration.md), [CM-3](CM-3-configuration-change-control.md), [CM-7](CM-7-least-functionality.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **CM-6(1):** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-4](CM-4-security-impact-analysis.md).
- **CM-6(2):** [IR-4](../IR-incident-response/IR-4-incident-handling.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).

## Stagehand initial assessment

Document secure defaults for runner isolation, browser launch options, permissions, allowed destinations, storage, logging, and secret sources as implementation matures. Operators should apply approved host/browser baselines, centrally manage settings where available, and document exceptions with owner and rationale. Do not assume all deployment settings are controlled by Stagehand.

## Control enhancements

1. **CM-6(1), automated central management/application/verification:** centrally manage, apply, and verify defined component settings.
2. **CM-6(2), respond to unauthorized changes:** apply defined safeguards such as alerting or restoring settings.
3. **CM-6(3), unauthorized-change detection:** withdrawn into SI-7.
4. **CM-6(4), conformance demonstration:** withdrawn into CM-4.

## Current repository context

Runner-core resolves browser and accessibility defaults/overrides and captures independent case settings. Accessibility defaults to disabled and failOnViolation false; omitted case tags inherit, explicit lists replace, and [] clears the filter. These functional defaults do not supply host hardening, target allowlists, or secret protection.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.
