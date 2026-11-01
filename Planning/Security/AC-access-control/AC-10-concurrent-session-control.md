# AC-10 — Concurrent Session Control

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac10).

## Control definition

Limit the number of simultaneous sessions for organisation-defined accounts or account types.

## Supplemental Guidance summary

Limits may vary globally, by account type, or by account. The control addresses sessions for an account, not one person using multiple separate accounts.

## Related controls

From the [official AC-10 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac10), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language explanation

It limits how many doors one keycard can hold open at once, especially for sensitive accounts.

## Stagehand mapping and operator guidance

The planned CLI has no Stagehand user sessions. Configure session limits in the identity provider and target services, especially for privileged and test accounts. CI concurrency limits control jobs, not necessarily authenticated sessions, so assess both separately. If Stagehand adds accounts or a hosted editor, revisit this control.

## Parameters — suggestions for review

Select account types and maximum concurrent sessions. **Suggestion:** one concurrent interactive session for privileged accounts where the service supports it; set other limits according to work needs and availability impact.

## Enhancements

The ITSG-33 Annex 3A entry lists no enhancements for AC-10.
