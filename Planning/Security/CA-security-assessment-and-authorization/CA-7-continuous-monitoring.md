# CA-7 — Continuous Monitoring

**Source:** [ITSG-33 Annex 3A, CA-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca7).

## Control definition

Establish and operate a continuous-monitoring strategy with defined metrics, monitoring and assessment frequencies, ongoing control assessments, status monitoring, correlation/analysis, response actions, and status reporting to designated roles at a defined frequency.

**Organisation-defined parameters to review:** metrics; monitoring and assessment cadence; report recipients and frequency; assessor independence and trend-analysis criteria in enhancements. **Suggested starting point:** monitor changes, vulnerabilities, dependency/build integrity, incidents, and control evidence continuously where technically available; review risk status monthly and after significant events, adjusting to system risk.

## Supplemental guidance

Monitoring provides ongoing awareness of threats, vulnerabilities, and control effectiveness for risk decisions and authorization maintenance. Activities should be frequent enough to support those decisions and scaled to system sensitivity. Automation and actionable, measurable, timely reporting improve usefulness.

## In plain language

Rather than inspect a bridge only on opening day, keep checking its condition, compare changes, repair problems, and tell the owner what is happening.

## Related controls

From the [official CA-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a34ca7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-2](CA-2-security-assessments.md), [CA-5](CA-5-plan-of-action-and-milestones.md), [CA-6](CA-6-security-authorization.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-4](../CM-configuration-management/CM-4-security-impact-analysis.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SA-11](../SA-system-and-services-acquisition/SA-11-developer-security-testing.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

## Stagehand initial assessment

The maintainers should establish product-level monitoring for dependency advisories, build/release integrity, vulnerability findings, and security defects. Operators must monitor their own hosts, identities, browser services, network, logs, and configuration. Define measures, owners, escalation, evidence, and reporting; do not treat CI health checks alone as continuous security monitoring.

## Control enhancements

1. **CA-7(1), independent assessment:** use assessors with organisation-defined independence for ongoing control monitoring.
2. **CA-7(2), types of assessments:** withdrawn and incorporated into CA-2.
3. **CA-7(3), trend analyses:** analyse empirical trends to decide whether controls, monitoring frequency, or methods should change.

## Current repository context

Version pins, PR CI, and unit tests exist. They are not continuous security monitoring. Automated upstream axe tag/release discovery remains a proposed maintenance item, and no monitoring coverage or incident escalation service has been established by those tests.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.
