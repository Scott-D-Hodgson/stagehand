# AU-7 — Audit Reduction and Report Generation

**Source:** [ITSG-33 Annex 3A, AU-7](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Provide audit-reduction and report-generation capability that supports on-demand review, analysis, and reporting requirements without changing the original audit records.

**Organisation-defined parameters to review:** audit fields and event criteria that users can select for reduction and reporting.

## Supplemental guidance

Reduction can remove or summarize detail to make large record sets manageable; reports should preserve source records and support investigations. Search and sort capabilities can help analysts locate events by time, identity, source, type, or outcome.

## In plain language

This is an index and summary of a large filing cabinet. It helps find the right folder quickly while leaving the original evidence intact.

## Stagehand initial assessment

Stagehand logs have not been confirmed to provide immutable source records, search, or reporting. Operators should route structured events to an approved logging platform that supports these functions and ensure summaries link back to retained originals. Do not rely on console output or transient CI logs for investigative reporting without verifying retention and integrity.

## Control enhancements

1. **AU-7(1), automatic audit reduction and report generation:** provide automated reduction/reporting based on organisation-defined event criteria.
2. **AU-7(2), automatic sort and search:** allow sorting/searching by organisation-defined audit fields.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

