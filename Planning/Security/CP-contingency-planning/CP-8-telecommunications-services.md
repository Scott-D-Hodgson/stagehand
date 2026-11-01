# CP-8 — Telecommunications Services

**Source:** [ITSG-33 Annex 3A, CP-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp8).

## Control definition

Establish alternate voice/data telecommunications services and agreements to resume defined operations within an organisation-defined time when primary services are unavailable at primary or alternate sites.

**Organisation-defined parameter to review:** resumption period, including separate objectives by site where needed.

## Supplemental guidance

Alternate services should satisfy continuity requirements and may include separate terrestrial lines or satellite service. Consider availability, quality, and access when negotiating agreements.

## In plain language

If one phone line is cut, have another route for the important messages to get through.

## Related controls

From the [official CP-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](CP-2-contingency-plan.md), [CP-6](CP-6-alternate-storage-site.md), [CP-7](CP-7-alternate-processing-site.md).

## Stagehand initial assessment

Hosted automation depends on network/telecommunications availability to reach identity, orchestration, logging, and target services. Operators should identify those dependencies and decide whether alternate connectivity is needed. Do not weaken network or identity safeguards during failover.

## Control enhancements

1. **CP-8(1), priority of service:** include priority provisions in primary/alternate telecom agreements and request government telecommunications priority where applicable to national-security emergency preparedness and carrier-provided services.
2. **CP-8(2), single points of failure:** obtain alternate services that reduce shared failure points.
3. **CP-8(3), separation of providers:** use providers separated from primary providers to reduce common threats.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
