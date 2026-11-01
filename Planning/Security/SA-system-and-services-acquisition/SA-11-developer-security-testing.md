# SA-11 - Developer Security Testing

**Source:** [ITSG-33 Annex 3A, SA-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa11).

## Control definition

Require developers to create and execute a security assessment plan; perform selected unit, integration, system, or regression testing at defined depth and coverage; provide evidence; maintain a verifiable flaw-remediation process; and correct identified flaws.

**Organisation-defined parameters:** test type, depth, coverage. **Suggestion for review:** define risk-based test coverage for untrusted plan parsing, browser automation boundaries, secret handling, artifact output, and release/update paths; document evidence and remediation decisions.

## Supplemental guidance

Developmental security evaluation occurs after design throughout the lifecycle. Changes and component interconnections can affect security. Custom software may need static, dynamic, binary analysis, and code review. Assessment plans should describe activities, rigor, coverage, artifacts, and protection of sensitive evidence.

## Related controls

From the [official SA-11 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa11), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-2](../CA-security-assessment-and-authorization/CA-2-security-assessments.md), [CM-4](../CM-configuration-management/CM-4-security-impact-analysis.md), [SA-3](SA-3-system-development-lifecycle.md), [SA-4](SA-4-acquisition-process.md), [SA-5](SA-5-information-system-documentation.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md).
- **SA-11(2):** [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **SA-11(3):** [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md), [SA-12](SA-12-supply-chain-protection.md).

## Plain-language metaphor

Like testing a bridge under realistic loads, recording the results, and repairing any weakness before opening it.

## Stagehand and operator guidance

Maintainers should establish a security assessment plan and retain scan/review evidence and flaw disposition. Operators can supplement product evidence with deployment configuration review and authorized testing of the integrated environment. Do not perform intrusive testing against targets without authorization.

## Control enhancements

(1) static code analysis with documented results; (2) threat and vulnerability analysis of the as-built system; (3) independent verification of the assessment plan/evidence using defined independence criteria; (4) manual review of defined code using defined methods; (5) penetration testing at defined breadth/depth and constraints; (6) attack-surface reviews. These are distinct assessment activities; identify which are selected and retain corresponding evidence.

## Current repository context

The existing 209-test dev-container suite validates contracts, loading, and runner logic using browser/adapter doubles. It is not penetration testing or a security test programme. Actual Chromium/axe tests are deferred pending a project test site, and axe itself checks accessibility rather than security.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** Functional unit-test evidence is recorded below; no independent security assessment is asserted.
