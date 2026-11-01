# AU-15 — Alternate Audit Capability

**Source:** [ITSG-33 Annex 3A, AU-15](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au15).

## Control definition

Provide a backup audit capability with organisation-defined functionality when the primary audit capability fails.

**Organisation-defined parameter to review:** alternate audit functionality needed during primary failure.

## Supplemental guidance

The alternate capability may be temporary and may provide only the affected subset of primary audit functions until the main capability is restored. Coordinate its behaviour with AU-5 failure response.

## In plain language

If the main notebook is unavailable, have a backup way to record the most important events until it is fixed.

## Related controls

From the [official AU-15 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au15), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-5](AU-5-response-to-audit-processing-failures.md).

## Stagehand initial assessment

Operators should define which minimum events must still be captured during collector or network outages, how they are buffered securely, and how they are reconciled afterward. Test that the fallback does not silently lose records or expose them in unprotected temporary storage. No alternate capability is claimed as implemented by Stagehand.

## Control enhancements

None are listed for AU-15 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
