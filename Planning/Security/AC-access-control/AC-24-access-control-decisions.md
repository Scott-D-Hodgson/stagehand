# AC-24 — Access Control Decisions

**Source:** [ITSG-33 Annex 3A, AC-24](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac24).

## Control definition

Establish procedures to ensure that access-control decisions are applied to each access before the information system enforces that access.

## Supplemental guidance

The decision and the enforcement mechanism are distinct: a policy component determines whether access is permitted, and an enforcement component applies that result. Clear interfaces and protected decision information help ensure that enforcement reflects the approved policy.

## In plain language

A guard decides whether a visitor may enter; the door lock must then follow that decision. A correct decision is useless if the lock ignores it.

## Related controls

From the [official AC-24 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac24), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Stagehand initial assessment

Stagehand’s access decisions are primarily inherited from the browser, operating system, identity provider, and target application. Validate that these components enforce authorization on every relevant action, including API calls and direct URLs, rather than relying solely on hidden UI controls. Keep policy decisions and enforcement logs correlated where available. A schema-valid JSON plan or passing test is not an authorization decision.

## Control enhancements

Enhancements address secure transmission of access-authorization information and limiting identity information used in access decisions when required for privacy. Confirm enhancement applicability against the organisation’s architecture and catalogue baseline.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
