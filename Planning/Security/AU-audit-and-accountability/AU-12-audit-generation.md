# AU-12 — Audit Generation

**Source:** [ITSG-33 Annex 3A, AU-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au12).

## Control definition

Provide audit-record generation for events defined in AU-2 on designated components; allow designated roles to select events by component; and generate records for selected events with AU-3 content.

**Organisation-defined parameters to review:** components, roles allowed to select events, and event sets. Ensure consistency with AU-2 and AU-3.

## Supplemental guidance

Audit records may originate from many system components. The audited set is generally a subset of all events a component can record. This control provides the system capability, while AU-2 determines the required events and AU-3 the record content.

## In plain language

Decide which parts of a machine can write a receipt, what events they record, and make the receipts comparable across the whole machine.

## Related controls

From the [official AU-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AU-2](AU-2-auditable-events.md), [AU-3](AU-3-content-of-audit-records.md), [AU-6](AU-6-audit-review-analysis-and-reporting.md), [AU-7](AU-7-audit-reduction-and-report-generation.md).
- **AU-12(1):** [AU-8](AU-8-time-stamps.md), [AU-12](AU-12-audit-generation.md).
- **AU-12(3):** [AU-7](AU-7-audit-reduction-and-report-generation.md).

## Stagehand initial assessment

Validate audit generation separately for Stagehand and supporting components. The application should expose useful security events and allow operators to configure appropriate detail without capturing unnecessary sensitive content. Operators need to enable and collect events at the browser, host, identity, runner, and target-service layers. No complete system-wide audit trail is assumed.

## Control enhancements

1. **AU-12(1), system-wide/time-correlated audit trail:** compile records from defined components into one logically or physically unified trail within a defined timestamp tolerance.
2. **AU-12(2), standardized formats:** produce a system-wide trail in a standardized format to support exchange and analysis.
3. **AU-12(3), changes by authorized individuals:** permit defined roles to change auditing for defined components/events within defined time limits.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
