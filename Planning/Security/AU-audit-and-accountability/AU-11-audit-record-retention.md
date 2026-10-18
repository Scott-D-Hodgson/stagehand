# AU-11 — Audit Record Retention

**Source:** [ITSG-33 Annex 3A, AU-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Retain audit records for an organisation-defined period consistent with records-retention policy, investigations, and regulatory or organisational requirements.

**Organisation-defined parameter to review:** retention period. **Suggested value for review:** use the approved records schedule for each record type and account for legal holds and investigations; there is no universal duration suitable for every Stagehand deployment.

## Supplemental guidance

Records may need to remain available for administrative, legal, audit, or operational purposes. Define record categories and standard response processes for legal requests and other preservation needs.

## In plain language

Keep the right receipts for as long as the rules or an investigation require, and make sure they can still be read later.

## Stagehand initial assessment

Stagehand’s deployment owner should set retention across application, host, CI, browser, and central log services, including backups and deletion behaviour. Minimize retained secrets and page content. Document how records are placed on legal hold, exported, and deleted at expiry. Verify actual provider retention rather than assuming logs persist.

## Control enhancements

1. **AU-11(1), long-term retrieval capability:** use defined measures to ensure retained records remain retrievable, such as format migration, compatible readers, and interpretation documentation.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

