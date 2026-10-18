# SA-11 - Developer Security Testing

**Source:** [ITSG-33 Annex 3A, SA-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Require developers to create and execute a security assessment plan; perform selected unit, integration, system, or regression testing at defined depth and coverage; provide evidence; maintain a verifiable flaw-remediation process; and correct identified flaws.

**Organisation-defined parameters:** test type, depth, coverage. **Suggestion for review:** define risk-based test coverage for untrusted plan parsing, browser automation boundaries, secret handling, artifact output, and release/update paths; document evidence and remediation decisions.

## Supplemental guidance

Developmental security evaluation occurs after design throughout the lifecycle. Changes and component interconnections can affect security. Custom software may need static, dynamic, binary analysis, and code review. Assessment plans should describe activities, rigor, coverage, artifacts, and protection of sensitive evidence.

## Plain-language metaphor

Like testing a bridge under realistic loads, recording the results, and repairing any weakness before opening it.

## Stagehand and operator guidance

Maintainers should establish a security assessment plan and retain scan/review evidence and flaw disposition. Operators can supplement product evidence with deployment configuration review and authorized testing of the integrated environment. Do not perform intrusive testing against targets without authorization.

## Control enhancements

(1) static code analysis with documented results; (2) threat and vulnerability analysis of the as-built system; (3) independent verification of the assessment plan/evidence using defined independence criteria; (4) manual review of defined code using defined methods; (5) penetration testing at defined breadth/depth and constraints; (6) attack-surface reviews. These are distinct assessment activities; identify which are selected and retain corresponding evidence.

## Assessment status

**Planned / not verified.** No test results or independent assessment evidence is asserted.
