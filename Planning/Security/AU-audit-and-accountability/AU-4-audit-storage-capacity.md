# AU-4 — Audit Storage Capacity

**Source:** [ITSG-33 Annex 3A, AU-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au4).

## Control definition

Allocate storage for audit records according to organisation-defined requirements.

**Organisation-defined parameter to review:** audit storage requirements. **Suggested value for review:** size capacity for expected event rates and retention, with monitored headroom and documented growth assumptions; determine exact volumes from deployment measurements.

## Supplemental guidance

Capacity depends on the events recorded and processing needs. Insufficient space can cause loss or reduction of audit capability. Plan for each repository and the overall service, including any buffering or forwarding path.

## In plain language

If a notebook is too small, important pages get lost. Estimate how many pages you need and arrange another protected notebook before it fills up.

## Related controls

From the [official AU-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-2](AU-2-auditable-events.md), [AU-5](AU-5-response-to-audit-processing-failures.md), [AU-6](AU-6-audit-review-analysis-and-reporting.md), [AU-7](AU-7-audit-reduction-and-report-generation.md), [AU-11](AU-11-audit-record-retention.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

## Stagehand initial assessment

Operators should size local logs, container/runner output, centralized logging, and any cloud retention using observed workload volumes. Alert before capacity is exhausted and document what happens during outages or queue backlogs. Avoid silently dropping events or expanding logs in ways that capture sensitive browser content.

## Control enhancements

1. **AU-4(1), transfer to alternate storage:** off-load audit records at an organisation-defined frequency to separate systems or media, protecting confidentiality and integrity. For hosted Stagehand, use an approved central repository and confirm delivery/retention behaviour.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
