# SC-36 - Distributed Processing and Storage

**Source:** [ITSG-33 Annex 3A, SC-36](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Distribute assigned processing and storage across multiple physical locations.

**Organisation-defined parameters:** processing/storage to distribute. **Suggestion for review:** apply only when resilience or risk objectives justify multi-location processing and data-location controls are understood.

## Supplemental guidance

Distribution provides redundancy/overlap and may increase the effort required to disrupt organisational operations; it does not assume a single primary site.

## Plain-language metaphor

Like keeping essential supplies in more than one warehouse so a single outage does not stop the service.

## Stagehand and operator guidance

Stagehand is intended as local tooling unless product architecture changes. Operators should understand where CI, artifacts, backups, and hosted services process/store data and ensure replication does not violate data-location requirements.

## Control enhancements

(1) poll distributed components, comparing results/content to identify faults, errors, or compromise. Distribution alone does not prevent compromise of one component.

## Assessment status

**Planned / deployment-dependent; not verified.**
