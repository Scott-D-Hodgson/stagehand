# CP-4 — Contingency Plan Testing and Exercises

**Source:** [ITSG-33 Annex 3A, CP-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp4).

## Control definition

Test the system contingency plan using defined tests at a defined frequency to evaluate plan effectiveness and readiness; review results and start corrective actions where needed.

**Organisation-defined parameters to review:** test frequency and methods. **Suggested value for review:** tabletop at least annually, plus technical recovery tests for critical deployments on a risk-based schedule.

## Supplemental guidance

Testing can include walkthroughs, tabletops, checklists, simulations, and full exercises. Match scope to continuity requirements, consider operational impacts, and document/follow up corrective actions.

## In plain language

Practice the emergency drill before a real emergency reveals that the instructions or equipment do not work.

## Related controls

From the [official CP-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](CP-2-contingency-plan.md), [CP-3](CP-3-contingency-training.md), [IR-3](../IR-incident-response/IR-3-incident-response-testing-and-exercises.md).
- **CP-4(1):** [IR-8](../IR-incident-response/IR-8-incident-response-plan.md).
- **CP-4(2):** [CP-7](CP-7-alternate-processing-site.md).
- **CP-4(4):** [CP-10](CP-10-information-system-recovery-and-reconstitution.md), [SC-24](../SC-system-and-communications-protection/SC-24-fail-in-known-state.md).

## Stagehand initial assessment

Exercise runner outage, corrupted plan, browser/provider failure, suspected credential exposure, and recovery from trusted configuration. Verify the fallback workflow and restoration of logging/security controls. Do not use live sensitive data in exercises unless authorized and protected.

## Control enhancements

1. **CP-4(1), coordinate with related plans:** coordinate testing with teams responsible for related continuity and incident plans.
2. **CP-4(2), alternate processing site:** test staff familiarity and alternate-site capabilities.
3. **CP-4(3), automated testing:** use automation to improve coverage and realism of plan tests.
4. **CP-4(4), full recovery/reconstitution:** test full restoration to a known state.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
