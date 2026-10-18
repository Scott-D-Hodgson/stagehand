# AU-6 — Audit Review, Analysis, and Reporting

**Source:** [ITSG-33 Annex 3A, AU-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Review and analyse audit records at an organisation-defined frequency for defined inappropriate or unusual activity, and report findings to designated roles.

**Organisation-defined parameters to review:** review frequency, activity patterns, and reporting recipients. **Suggested starting point for review:** automated alerting for high-risk events with routine human review at a cadence set by the organisation’s risk and staffing model; immediate escalation of credible incidents.

## Supplemental guidance

Review may cover information security events from accounts, remote and wireless access, devices, configuration, maintenance, facilities, network boundaries, and other sources. Findings should reach incident response, service desk, or security teams as appropriate. Where the system owner cannot review records, an authorized independent organisation may do so.

## In plain language

Keeping receipts is not enough; someone has to look for suspicious patterns and tell the people who can respond.

## Stagehand initial assessment

Stagehand product-level logs alone will not provide a complete view of a deployment. Operators should combine them with identity, endpoint, browser, network, and target-service events. Review for unusual task volume, unexpected destinations, repeated authorization failures, unusual privilege use, and access outside approved windows. Define privacy-respecting thresholds and escalation routes; verify correlation and alert quality during deployment assessment.

## Control enhancements

1. **AU-6(1), process integration:** automate integration of audit review with investigation and response processes.
2. **AU-6(2), automated security alerts:** withdrawn and incorporated into SI-4.
3. **AU-6(3), correlate audit repositories:** correlate records across repositories for organisation-wide awareness.
4. **AU-6(4), central review and analysis:** centrally review/analyse records from multiple system components.
5. **AU-6(5), integration with scanning and monitoring:** combine audit analysis with vulnerability scanning, performance, system monitoring, or other defined data sources.
