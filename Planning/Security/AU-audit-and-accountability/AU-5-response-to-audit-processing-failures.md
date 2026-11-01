# AU-5 — Response to Audit Processing Failures

**Source:** [ITSG-33 Annex 3A, AU-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au5).

## Control definition

Alert organisation-designated roles when audit processing fails and take additional organisation-defined actions.

**Organisation-defined parameters to review:** recipients; failure-specific response actions; threshold and warning time for enhancement 1; real-time alert events/recipients/timing for enhancement 2; traffic threshold and reject/delay choice for enhancement 3; and failure conditions and shutdown/degraded mode for enhancement 4. **Suggested starting point:** alert the security operations owner on ingestion/storage failures and preserve the automation run’s safe-stop behaviour; validate business continuity impact before choosing shutdown actions.

## Supplemental guidance

Failures include hardware/software errors, capture mechanism failures, or storage exhaustion. Define responses by severity and repository scope. A response may range from alerting to limiting service operation; decisions should account for mission impact and alternative audit capability.

## In plain language

If the security camera stops recording, someone must be told and the site needs a pre-agreed fallback plan.

## Related controls

From the [official AU-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-4](AU-4-audit-storage-capacity.md), [SI-12](../SI-system-and-information-integrity/SI-12-information-output-handling-and-retention.md).
- **AU-5(4):** [AU-15](AU-15-alternate-audit-capability.md).

## Stagehand initial assessment

The deployment should detect logging SDK/collector errors, full disks, blocked forwarding, and unavailable central stores. Operators should decide whether automation pauses, continues in a restricted mode, or stops when security logging is unavailable; ensure queued records are protected and recovered. Stagehand must not be described as emitting real-time alerts or failing closed without implementation evidence.

## Control enhancements

1. **AU-5(1), audit storage capacity:** warn designated recipients within a defined period when storage reaches an organisation-defined percentage of maximum.
2. **AU-5(2), real-time alerts:** rapidly alert on organisation-defined audit failures.
3. **AU-5(3), configurable traffic-volume thresholds:** reject or delay communications above thresholds when audit capacity would be exceeded.
4. **AU-5(4), shutdown on failure:** invoke full shutdown, partial shutdown, or degraded mode for defined audit failures unless alternate auditing exists. Choose the response through availability and risk analysis.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
