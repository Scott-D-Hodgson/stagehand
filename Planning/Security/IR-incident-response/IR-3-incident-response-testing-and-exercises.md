# IR-3 — Incident Response Testing and Exercises

**Source:** [ITSG-33 Annex 3A, IR-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir3).

## Control definition

Test incident-response capability at a defined frequency using defined tests, determine effectiveness, and document results.

**Organisation-defined parameters:** test frequency and methods. **Suggestion for review:** annual tabletop plus targeted exercises after major deployment changes; select more demanding methods according to system risk.

## Supplemental guidance

Testing can use checklists, walkthroughs, tabletop exercises, simulations, or comprehensive exercises. Consider operational effects and identify weaknesses to correct.

## Related controls

From the [official IR-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a38ir3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-4](../CP-contingency-planning/CP-4-contingency-plan-testing-and-exercises.md), [IR-8](IR-8-incident-response-plan.md).
- **IR-3(1):** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md).

## Plain-language metaphor

Practice the emergency response before a real alarm, then write down what slowed the team down.

## Stagehand and operator guidance

Exercise scenarios involving leaked credentials, unauthorized browser navigation, compromised dependencies, lost audit collection, or sensitive artifacts. Use isolated test environments and synthetic data. Record findings and feed them into plans, training, and risk remediation.

## Enhancements

1. **IR-3(1), automated testing:** use automation to improve test coverage, realism, or stress on the response capability.
2. **IR-3(2), coordination with related plans:** coordinate with owners of continuity, disaster recovery, crisis communications, and other related plans.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
