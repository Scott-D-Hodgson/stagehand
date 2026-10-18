# IA-6 — Authenticator Feedback

**Source:** [ITSG-33 Annex 3A, IA-6](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Obscure authentication feedback so unauthorized people cannot exploit information exposed during authentication.

## Supplemental guidance

Do not reveal credential values or useful hints while authenticating. Choose masking behaviour for the device and context, balancing shoulder-surfing risk against input errors on small screens.

## Plain-language metaphor

Cover the combination while entering it so a bystander cannot copy the code.

## Stagehand and operator guidance

Authentication prompts are generally provided by the browser or target service. Operators should ensure credentials are entered only into expected origins, avoid screenshots/session recordings during authentication, and configure browser/remote-desktop masking according to policy. Stagehand should not log or echo secrets.

## Enhancements

None are listed for IA-6 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

