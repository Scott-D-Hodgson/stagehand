# SI-6 - Security Functional Verification

**Source:** [ITSG-33 Annex 3A, SI-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Verify assigned security functions at selected transitions, privileged user commands, or intervals; notify assigned roles when tests fail; and shut down, restart, or take another defined action when anomalies occur.

**Organisation-defined parameters:** functions, verification schedule/trigger, recipients, and anomaly action. **Suggestion for review:** verify essential access, input-validation, and integrity safeguards at startup and release gates; notify maintainers/security and fail safely if checks fail.

## Supplemental guidance

Transitions include startup, restart, shutdown, and abort. Notifications can be system alerts, console messages, or hardware indicators.

## Plain-language metaphor

Like testing the alarm and emergency lights before opening a building and telling the caretaker if a test fails.

## Stagehand and operator guidance

Maintainers should define security-relevant checks and failure behaviour as those functions are implemented. Operators should monitor results and decide whether jobs may proceed after failures.

## Control enhancements

(1) failed-test notifications withdrawn into SI-6; (2) automated management of distributed security testing; (3) report verification results to assigned roles.

## Assessment status

**Planned / not verified.** No security-functional checks are evidenced here.
