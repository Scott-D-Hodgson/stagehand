# PE-11 — Emergency Power

**Source:** [ITSG-33 Annex 3A, PE-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe11).

## Control definition

Provide short-term UPS power to support orderly shutdown or transition to long-term alternate power after primary power loss.

## Supplemental guidance

Primarily concerns facilities with concentrated system resources. Coordinate emergency power with continuity plans.

## Related controls

From the [official PE-11 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe11), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [CP-2](../CP-contingency-planning/CP-2-contingency-plan.md), [CP-7](../CP-contingency-planning/CP-7-alternate-processing-site.md).

## Plain-language metaphor

A battery gives the machine enough time to save work or switch to a generator when power fails.

## Stagehand and operator guidance

Local devices should use endpoint power protections appropriate to their role. Hosting providers should document UPS and alternate-power coverage and recovery objectives. Automation tasks should safely stop or resume rather than leave partial operations.

## Enhancements

1. **PE-11(1), long-term alternate supply—minimal capability:** maintain minimum required operation through extended outages.
2. **PE-11(2), self-contained long-term supply:** use an independent supply capable of minimum or full operation for an extended outage.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
