# IA-2 — Identification and Authentication (Organisational Users)

**Source:** [ITSG-33 Annex 3A, IA-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia2).

## Control definition

Uniquely identify and authenticate organisational users and processes acting for them, except documented unauthenticated actions and authorized group-authenticator cases.

## Supplemental guidance

Organisational users include employees and equivalent personnel such as contractors. Authentication may use knowledge, possession, or biometric factors; multifactor authentication combines distinct factors. Apply identification at system or application level as risk requires. IA-8 covers non-organisational users.

## Related controls

From the [official IA-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-14](../AC-access-control/AC-14-permitted-actions-without-identification-or-authentication.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [IA-4](IA-4-identifier-management.md), [IA-5](IA-5-authenticator-management.md), [IA-8](IA-8-identification-and-authentication-non-organizational-users.md).
- **IA-2(1):** [AC-6](../AC-access-control/AC-6-least-privilege.md).
- **IA-2(3):** [AC-6](../AC-access-control/AC-6-least-privilege.md).
- **IA-2(6):** [AC-6](../AC-access-control/AC-6-least-privilege.md).
- **IA-2(11):** [AC-6](../AC-access-control/AC-6-least-privilege.md).
- **IA-2(12):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md).
- **IA-2(13):** [IA-10](IA-10-adaptive-identification-and-authentication.md), [IA-11](IA-11-re-authentication.md), [SC-37](../SC-system-and-communications-protection/SC-37-out-of-band-channels.md).

## Plain-language metaphor

Give each worker a personal badge and verify it at the door; a shared key makes it harder to know who entered.

## Stagehand and operator guidance

Stagehand is anticipated to run under delegated user/service identities, not to establish organisational identities itself. Operators should use unique accounts, MFA for network/privileged access as required, short-lived scoped credentials, and per-user audit attribution. Avoid shared browser profiles and shared credentials. Verify the identity provider and target applications enforce authorization on every action.

## Enhancements

1. **IA-2(1–4):** MFA for network/local access to privileged/non-privileged accounts.
2. **IA-2(5):** individual authentication when a group authenticator is used.
3. **IA-2(6–7):** network MFA using a separate device for privileged/non-privileged accounts; define mechanism strength.
4. **IA-2(8–9):** replay-resistant network authentication for privileged/non-privileged accounts.
5. **IA-2(10):** single sign-on for organisation-defined accounts/services, balancing convenience with risk from a shared authenticator.
6. **IA-2(11):** remote MFA using a separate device for privileged and non-privileged accounts; define strength.
7. **IA-2(12):** accept and electronically verify PIV credentials where applicable.
8. **IA-2(13):** use defined out-of-band authentication under defined conditions.
9. **IA-2(14):** withdrawn and incorporated into IA-2(11).
