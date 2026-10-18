# IA-11 — Re-Authentication

**Source:** [ITSG-33 Annex 3A, IA-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Require users and devices to authenticate again under organisation-defined conditions.

**Organisation-defined parameter:** events or situations requiring reauthentication.

## Supplemental guidance

Reauthentication can be required after credential or role changes, a change in system sensitivity, privileged actions, a fixed interval, or periodically, in addition to session-lock requirements.

## Plain-language metaphor

For a long trip or a high-value delivery, check the driver’s pass again before continuing.

## Stagehand and operator guidance

Operators should configure identity-provider and target-session timeouts and require reauthentication before sensitive operations where supported. Avoid long-lived browser profiles and unattended sessions. Ensure automation handles expired sessions safely and does not try to bypass the prompt.

## Enhancements

None are listed for IA-11 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

