# AU-16 — Cross-Organisational Auditing

**Source:** [ITSG-33 Annex 3A, AU-16](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au16).

## Control definition

Use organisation-defined methods to coordinate organisation-defined audit information among external organisations when records cross organisational boundaries.

**Organisation-defined parameters to review:** coordination methods and audit information to exchange.

## Supplemental guidance

Shared services require coordinated auditing. Identity attribution across organisations can be difficult and costly; agreements should clarify which organisation records which identity and event details. The initial service may record the requesting individual while downstream services record the authorized request source.

## In plain language

When a parcel passes between delivery companies, each needs agreed tracking numbers so the route can be reconstructed.

## Related controls

From the [official AU-16 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au16), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-6](AU-6-audit-review-analysis-and-reporting.md).

## Stagehand initial assessment

For hosted runners, managed browser services, identity platforms, and target systems operated by different organisations, define audit ownership and exchange arrangements before deployment. Correlate task/run identifiers with provider request IDs where possible. Share only necessary records under approved agreements and protect identity data. Stagehand cannot establish another organisation’s audit coverage.

## Control enhancements

1. **AU-16(1), identity preservation:** preserve individual identities in cross-organisational audit trails where traceability is required.
2. **AU-16(2), sharing audit information:** provide defined organisations with audit information under established sharing agreements.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
