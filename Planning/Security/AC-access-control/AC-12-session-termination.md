# AC-12 — Session Termination

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac12).

## Control definition

Automatically end user-initiated logical sessions when organisation-defined conditions or events occur.

## Supplemental Guidance summary

Ending a logical user session differs from dropping the network connection. A session may end after inactivity, an incident response, or a time-of-day restriction; processes that the user explicitly arranged to continue may be treated separately. Services may show a clear logout message.

## Related controls

From the [official AC-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-10](../SC-system-and-communications-protection/SC-10-network-disconnect.md), [SC-23](../SC-system-and-communications-protection/SC-23-session-authenticity.md).

## Plain-language explanation

Session termination is signing out and returning the borrowed key, not merely closing the hallway door.

## Stagehand mapping and operator guidance

The CLI is not a user-session service. Configure session expiration in CI, identity systems, and target applications. The runner now exposes browser-context/run cleanup; callers must invoke it. Temporary credential release and external session revocation remain separate responsibilities. Do not assume ending a process revokes all external sessions unless the provider confirms it.

## Parameters — suggestions for review

Define conditions/triggers by account and service. **Suggestion:** terminate authenticated test sessions when a job completes or is cancelled, and use managed inactivity policies for interactive services.

## Enhancements

AC-12(1) User-initiated logouts/message displays: provide logout for authenticated resources and clearly confirm session termination. This belongs to each authenticated service; Stagehand should not claim it for external targets.

## Current repository context

Runner-core now provides explicit session/run close operations with in-flight setup coordination and mocked cleanup tests. Callers must invoke cleanup; closing a browser context does not revoke external credentials, terminate all target-side sessions, or undo target actions. Actual Chromium/axe frame/cleanup verification is deferred until a project test site exists.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.
