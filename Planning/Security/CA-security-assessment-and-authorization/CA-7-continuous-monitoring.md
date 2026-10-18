# CA-7 — Continuous Monitoring

**Source:** [ITSG-33 Annex 3A, CA-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish and operate a continuous-monitoring strategy with defined metrics, monitoring and assessment frequencies, ongoing control assessments, status monitoring, correlation/analysis, response actions, and status reporting to designated roles at a defined frequency.

**Organisation-defined parameters to review:** metrics; monitoring and assessment cadence; report recipients and frequency; assessor independence and trend-analysis criteria in enhancements. **Suggested starting point:** monitor changes, vulnerabilities, dependency/build integrity, incidents, and control evidence continuously where technically available; review risk status monthly and after significant events, adjusting to system risk.

## Supplemental guidance

Monitoring provides ongoing awareness of threats, vulnerabilities, and control effectiveness for risk decisions and authorization maintenance. Activities should be frequent enough to support those decisions and scaled to system sensitivity. Automation and actionable, measurable, timely reporting improve usefulness.

## In plain language

Rather than inspect a bridge only on opening day, keep checking its condition, compare changes, repair problems, and tell the owner what is happening.

## Stagehand initial assessment

The maintainers should establish product-level monitoring for dependency advisories, build/release integrity, vulnerability findings, and security defects. Operators must monitor their own hosts, identities, browser services, network, logs, and configuration. Define measures, owners, escalation, evidence, and reporting; do not treat CI health checks alone as continuous security monitoring.

## Control enhancements

1. **CA-7(1), independent assessment:** use assessors with organisation-defined independence for ongoing control monitoring.
2. **CA-7(2), types of assessments:** withdrawn and incorporated into CA-2.
3. **CA-7(3), trend analyses:** analyse empirical trends to decide whether controls, monitoring frequency, or methods should change.
