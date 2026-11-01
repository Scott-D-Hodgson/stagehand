# AC-8 — System Use Notification

**Status:** Environment / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac8).

## Control definition

Before access, show a system-use notice that communicates privacy/security conditions and require acknowledgment. For public systems, show authorized-use information and any monitoring notice consistent with privacy requirements.

## Supplemental Guidance summary

Notices are usually pre-login warning banners for human-facing login interfaces. They are unnecessary where no human login interface exists. Organisations may need multiple languages and should obtain appropriate legal review of banner language.

## Related controls

From the [official AC-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language explanation

It is the sign at a controlled entrance telling visitors what the area is for and what rules apply before they enter.

## Stagehand mapping and operator guidance

The local CLI and static editor are not planned to authenticate users, so notices belong to the operating system, repository/CI portal, target application, or editor host. If Stagehand later provides a login service, add notices at the authentication boundary and review wording with the organisation's legal/privacy authority. Operators should configure banners on the services that actually provide access.

## Parameter suggestion for review

Define the notice text and display/acknowledgment conditions with the system owner and legal/privacy team. No universal banner text is proposed.

## Enhancements

The ITSG-33 Annex 3A entry lists no enhancements for AC-8.
