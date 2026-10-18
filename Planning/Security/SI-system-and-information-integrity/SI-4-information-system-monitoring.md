# SI-4 - Information System Monitoring

**Source:** [ITSG-33 Annex 3A, SI-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Monitor for attacks/indicators and unauthorized local, network, or remote connections; identify unauthorized use; place monitoring at strategic and ad hoc points; protect monitoring data; increase monitoring when risk rises; obtain legal review as required; and distribute monitoring information to assigned roles.

**Organisation-defined parameters:** objectives, methods, monitoring placement, increased-risk response, legal review process, data shared, recipients, and frequency. **Suggestion for review:** define minimum telemetry, protect logs, set alert recipients, and ensure privacy/legal approval before monitoring people or content.

## Supplemental guidance

Monitoring can be internal or at system boundaries, using IDS/IPS, malware protection, scanning, audit, or network tools. Monitoring supports continuous monitoring and incident response; collected detail should match objectives and system capabilities.

## Plain-language metaphor

Like cameras and alarms at entrances and inside critical rooms, with protected recordings and a plan for who responds.

## Stagehand and operator guidance

Maintainers should define privacy-conscious product telemetry (if any) and prevent secrets from entering diagnostics. Operators own host, network, CI, and identity monitoring; protect logs and set a higher monitoring posture during credible threats.

## Control enhancements

(1) system-wide integrated IDS; (2) automated near-real-time event analysis; (3) integrate detections with access/flow controls for response; (4) monitor inbound/outbound traffic; (5) alert assigned roles on defined compromise indicators; (6) non-privileged-user restrictions withdrawn into AC-6(10); (7) alert response personnel and take least-disruptive termination action; (8) monitoring-information protection withdrawn into SI-4; (9) test monitoring tools at defined intervals; (10) provide selected encrypted-traffic visibility to monitoring tools; (11) analyse traffic anomalies; (12) automate alerts for unusual/security-relevant activities; (13) profile traffic/events to tune false positives/negatives; (14) wireless intrusion detection; (15) monitor wireless-to-wireline traffic; (16) correlate monitoring data; (17) integrate physical, cyber, and supply-chain awareness; (18) analyse for covert exfiltration; (19) additional monitoring of identified higher-risk individuals under law/policy; (20) additional privileged-user monitoring; (21) additional monitoring during defined probation; (22) detect unauthorized network services and audit/alert; (23) host-based monitoring; (24) discover, collect, distribute, and use indicators of compromise. Many enhancements are organisational monitoring capabilities, not Stagehand features.

## Assessment status

**Planned / deployment-dependent; not verified.** No logging/monitoring deployment is assessed.
