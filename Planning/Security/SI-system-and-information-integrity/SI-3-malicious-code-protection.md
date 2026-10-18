# SI-3 - Malicious Code Protection

**Source:** [ITSG-33 Annex 3A, SI-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Use malicious-code defenses at system entry/exit points; update them as releases become available under configuration policy; scan periodically and in real time at selected endpoints/network points; take defined actions on detections; and address false positives and availability impacts.

**Organisation-defined parameters:** scan frequency/location, detection response, and false-positive process. **Suggestion for review:** scan downloads and release artifacts, alert security staff, quarantine suspicious files, and provide an authorized restoration process.

## Supplemental guidance

Threats can arrive through web, email, attachments, removable media, compressed/hidden files, and vulnerabilities. Endpoint, proxy, firewall, and reputation/signature mechanisms help, but custom malicious logic may evade traditional tools; secure development and monitoring remain necessary.

## Plain-language metaphor

Like checking packages at every entrance and keeping inspection rules current, while knowing that a clever fake may evade one kind of scanner.

## Stagehand and operator guidance

Maintainers should scan dependencies and artifacts with approved tools and avoid executing untrusted plans outside isolation. Operators should enable host, browser, and network malware protection; keep definitions updated; and avoid disabling controls to run automation.

## Control enhancements

(1) centrally manage defenses; (2) automatically update them; (3) non-privileged users withdrawn into AC-6(10); (4) updates only when directed by privileged users; (5) portable-storage protections withdrawn into MP-7; (6) test with a benign non-spreading case and verify detection/reporting; (7) non-signature detection; (8) detect unauthorized OS commands and warn/audit/prevent; (9) authenticate remote commands; (10) analyse malware behaviour and use findings in incident response/flaw remediation.

## Assessment status

**Planned / deployment-dependent; not verified.** No malware-control evidence asserted.
