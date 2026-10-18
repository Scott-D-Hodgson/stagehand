# IR-4 — Incident Handling

**Source:** [ITSG-33 Annex 3A, IR-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Operate incident handling covering preparation, detection/analysis, containment, eradication, and recovery; coordinate it with contingency planning; and apply lessons learned to procedures, training, and exercises.

## Supplemental guidance

Incident handling depends on system and business capabilities and should be considered during system design. Information may come from audit, network, physical monitoring, user reports, and supply-chain events. Effective handling coordinates security, business, legal, HR, operations, procurement, and other roles.

## Plain-language metaphor

Treat an incident like a leak: prepare supplies, find the source, contain it, clean it up, restore service, and improve the plumbing.

## Stagehand and operator guidance

For Stagehand-related incidents, operators should halt affected tasks, isolate the runner, preserve approved logs, revoke sessions/credentials, identify affected plans/targets/artifacts, and recover from trusted sources. Coordinate with target-service owners and providers. Ensure response actions do not spread sensitive artifacts.

## Enhancements

1. **IR-4(1), automated incident handling:** use automated mechanisms to support handling, such as incident-management systems.
2. **IR-4(2), dynamic reconfiguration:** reconfigure defined components rapidly to contain attacks or isolate systems.
3. **IR-4(3), continuity of operations:** define incidents and actions that preserve essential work.
4. **IR-4(4), information correlation:** combine incident details and responses for organisation-wide awareness.
5. **IR-4(5), automatic disabling:** automatically disable the system on defined security violations.
6. **IR-4(6), insider-threat capability:** provide specific insider-threat incident handling.
7. **IR-4(7), insider-threat coordination:** coordinate handling across defined organisational elements.
8. **IR-4(8), external coordination:** correlate/share defined incident information with external organisations.
9. **IR-4(9), dynamic response:** deploy defined capabilities rapidly in response to incidents.
10. **IR-4(10), supply-chain coordination:** coordinate incidents with organisations involved in the supply chain.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

