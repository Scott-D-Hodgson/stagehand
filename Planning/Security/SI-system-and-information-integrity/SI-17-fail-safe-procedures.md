# SI-17 - Fail-Safe Procedures

**Source:** [ITSG-33 Annex 3A, SI-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Implement defined fail-safe procedures for defined failure conditions.

**Organisation-defined parameters:** failure conditions and procedures. **Suggestion for review:** for runner/network/browser failures, stop automation, avoid retry loops, preserve safe diagnostics, and alert the operator; define recovery steps for the actual environment.

## Supplemental guidance

Failures can include loss of communications among critical components or with operational facilities. Procedures may alert staff and instruct them to do nothing, restore settings, stop/restart processes, or contact designated roles.

## Plain-language metaphor

Like a train’s emergency procedure: stop safely, alert the operator, and follow a known recovery sequence.

## Stagehand and operator guidance

Maintainers should define safe cancellation and cleanup behaviour. Operators configure job timeouts, cancellation, notifications, and recovery. Test targets may need cleanup when a run stops partway through.

## Control enhancements

None listed.

## Assessment status

**Planned / not verified.**
