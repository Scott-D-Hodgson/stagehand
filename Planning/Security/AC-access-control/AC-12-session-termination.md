# AC-12 — Session Termination

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Automatically end user-initiated logical sessions when organisation-defined conditions or events occur.

## Supplemental Guidance summary

Ending a logical user session differs from dropping the network connection. A session may end after inactivity, an incident response, or a time-of-day restriction; processes that the user explicitly arranged to continue may be treated separately. Services may show a clear logout message.

## Plain-language explanation

Session termination is signing out and returning the borrowed key, not merely closing the hallway door.

## Stagehand mapping and operator guidance

The CLI is not a user-session service. Configure session expiration in CI, identity systems, and target applications. The runner should close browser contexts and release temporary credentials after each run; implementation and tests are still required. Do not assume ending a process revokes all external sessions unless the provider confirms it.

## Parameters — suggestions for review

Define conditions/triggers by account and service. **Suggestion:** terminate authenticated test sessions when a job completes or is cancelled, and use managed inactivity policies for interactive services.

## Enhancements

AC-12(1) User-initiated logouts/message displays: provide logout for authenticated resources and clearly confirm session termination. This belongs to each authenticated service; Stagehand should not claim it for external targets.
