# SI-17 - Fail-Safe Procedures

**Source:** [ITSG-33 Annex 3A, SI-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si17).

## Control definition

Implement defined fail-safe procedures for defined failure conditions.

**Organisation-defined parameters:** failure conditions and procedures. **Suggestion for review:** for runner/network/browser failures, stop automation, avoid retry loops, preserve safe diagnostics, and alert the operator; define recovery steps for the actual environment.

## Supplemental guidance

Failures can include loss of communications among critical components or with operational facilities. Procedures may alert staff and instruct them to do nothing, restore settings, stop/restart processes, or contact designated roles.

## Related controls

From the [official SI-17 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si17), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-12](../CP-contingency-planning/CP-12-safe-mode.md), [CP-13](../CP-contingency-planning/CP-13-alternative-security-mechanisms.md), [SC-24](../SC-system-and-communications-protection/SC-24-fail-in-known-state.md), [SI-13](SI-13-predictable-failure-prevention.md).

## Plain-language metaphor

Like a train’s emergency procedure: stop safely, alert the operator, and follow a known recovery sequence.

## Stagehand and operator guidance

Maintainers should define safe cancellation and cleanup behaviour. Operators configure job timeouts, cancellation, notifications, and recovery. Test targets may need cleanup when a run stops partway through.

## Control enhancements

None listed.

## Current repository context

Session/run close methods coordinate cleanup, including in-flight setup, and dispatch preserves step errors. Callers own closing sessions/runs in finally blocks. No cancellation API, target rollback, external credential revocation, or complete M6 execution outcome policy is established.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.**
