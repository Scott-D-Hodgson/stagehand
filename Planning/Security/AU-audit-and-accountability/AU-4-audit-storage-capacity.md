# AU-4 — Audit Storage Capacity

**Source:** [ITSG-33 Annex 3A, AU-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Allocate storage for audit records according to organisation-defined requirements.

**Organisation-defined parameter to review:** audit storage requirements. **Suggested value for review:** size capacity for expected event rates and retention, with monitored headroom and documented growth assumptions; determine exact volumes from deployment measurements.

## Supplemental guidance

Capacity depends on the events recorded and processing needs. Insufficient space can cause loss or reduction of audit capability. Plan for each repository and the overall service, including any buffering or forwarding path.

## In plain language

If a notebook is too small, important pages get lost. Estimate how many pages you need and arrange another protected notebook before it fills up.

## Stagehand initial assessment

Operators should size local logs, container/runner output, centralized logging, and any cloud retention using observed workload volumes. Alert before capacity is exhausted and document what happens during outages or queue backlogs. Avoid silently dropping events or expanding logs in ways that capture sensitive browser content.

## Control enhancements

1. **AU-4(1), transfer to alternate storage:** off-load audit records at an organisation-defined frequency to separate systems or media, protecting confidentiality and integrity. For hosted Stagehand, use an approved central repository and confirm delivery/retention behaviour.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

