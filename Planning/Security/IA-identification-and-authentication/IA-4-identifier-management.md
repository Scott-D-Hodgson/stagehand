# IA-4 — Identifier Management

**Source:** [ITSG-33 Annex 3A, IA-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia4).

## Control definition

Authorize identifier assignment; select and assign unique identifiers to people, groups, roles, or devices; prevent reuse for a defined period; and disable identifiers after a defined inactivity period.

**Organisation-defined parameters:** approvers, identifier non-reuse period, inactivity period, status attributes, and cross-organisational partners.

## Supplemental guidance

Identifiers include usernames and device/network identifiers. Preventing reuse avoids assigning a former identity to a different subject. Account-management processes use these identifiers. Group/guest accounts have distinct handling.

## Related controls

From the [official IA-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [IA-2](IA-2-identification-and-authentication-organizational-users.md), [IA-3](IA-3-device-identification-and-authentication.md), [IA-5](IA-5-authenticator-management.md), [IA-8](IA-8-identification-and-authentication-non-organizational-users.md), [SC-37](../SC-system-and-communications-protection/SC-37-out-of-band-channels.md).
- **IA-4(1):** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md).
- **IA-4(4):** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md).
- **IA-4(5):** [AC-16](../AC-access-control/AC-16-security-attributes.md).

## Plain-language metaphor

Do not reissue an old employee number immediately; old paperwork might still point to the wrong person.

## Stagehand and operator guidance

Use stable unique identities for people, automation service accounts, and runners, with ownership and lifecycle dates. Disable stale identities and avoid reusing account names that appear in old logs or artifacts. The organisation’s identity system should own assignment; Stagehand should not invent parallel user directories.

## Enhancements

1. **IA-4(1):** prohibit account identifiers that match public personal email identifiers.
2. **IA-4(2):** require supervisor authorization for individual identifier registration.
3. **IA-4(3):** require multiple forms of identity certification at registration.
4. **IA-4(4):** mark defined user status characteristics, such as contractor status.
5. **IA-4(5):** dynamically manage identifiers for runtime entities.
6. **IA-4(6):** coordinate identifier management with defined external organisations.
7. **IA-4(7):** require in-person registration before a designated authority.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
