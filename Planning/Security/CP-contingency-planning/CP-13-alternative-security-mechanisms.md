# CP-13 — Alternative Security Mechanisms

**Source:** [ITSG-33 Annex 3A, CP-13](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp13).

## Control definition

Use organisation-defined alternative or supplemental mechanisms for defined security functions when the primary mechanism is unavailable or compromised.

**Organisation-defined parameters to review:** mechanisms and the security functions they support.

## Supplemental guidance

Alternatives improve resilience but may be less convenient, scalable, or secure than the primary method. Because they can be costly, apply them to critical capabilities and define compensating limits.

## In plain language

Keep a backup lock for the most important door in case the main lock fails, but know exactly what protection the spare lock does and does not provide.

## Related controls

From the [official CP-13 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp13), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CP-2](CP-2-contingency-plan.md).

## Stagehand initial assessment

Organisations should identify critical security functions such as authentication, audit capture, approval, and safe task termination, and define approved fallback methods. Do not bypass MFA, authorization, or safety checks merely to keep automation running. Record who may activate a fallback and when the primary mechanism must be restored.

## Control enhancements

None are listed for CP-13 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
