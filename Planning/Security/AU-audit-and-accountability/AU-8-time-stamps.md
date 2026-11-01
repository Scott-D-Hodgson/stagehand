# AU-8 — Time Stamps

**Source:** [ITSG-33 Annex 3A, AU-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au8).

## Control definition

Use system clocks to timestamp audit records; ensure timestamps map to UTC or GMT and meet organisation-defined time precision.

**Organisation-defined parameters to review:** required time precision; clock comparison frequency and authoritative source; synchronization threshold. **Suggested value for review:** use UTC timestamps and a centrally approved time source, with synchronization appropriate to incident-correlation needs.

## Supplemental guidance

Consistent timestamps support event ordering across components. Organisations may set different precision requirements by component. Clock synchronization can also support access and authentication mechanisms.

## In plain language

If several people write a story of what happened, their clocks must agree closely enough to put the pages in the right order.

## Related controls

From the [official AU-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-3](AU-3-content-of-audit-records.md), [AU-12](AU-12-audit-generation.md).

## Stagehand initial assessment

Operators should configure the host/container, browser, identity services, and central logging to use approved synchronized time. Stagehand should emit timezone-aware timestamps if supported; verify actual format and precision. Correlate UTC event times across task runs, browser actions, and target services.

## Control enhancements

1. **AU-8(1), synchronization with authoritative time source:** compare clocks at a defined frequency and synchronize when their difference exceeds a defined threshold.
2. **AU-8(2), secondary authoritative time source:** identify a backup time source in a different geographic region.

## Current repository context

Result-model validates UTC timestamp syntax and calendar dates; it does not synchronize clocks or generate execution timestamps. Time-zone settings on browser contexts do not establish reliable audit time. Host time synchronization and cross-system correlation remain operator responsibilities.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
