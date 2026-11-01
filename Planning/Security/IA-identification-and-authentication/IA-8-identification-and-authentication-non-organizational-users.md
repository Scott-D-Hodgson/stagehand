# IA-8 — Identification and Authentication (Non-Organisational Users)

**Source:** [ITSG-33 Annex 3A, IA-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia8).

## Control definition

Uniquely identify and authenticate non-organisational users and processes acting for them, except actions documented under AC-14.

## Supplemental guidance

Non-organisational users include people outside the workforce scope of IA-2. Use risk assessment to balance security, scalability, and usability. Identity/credential assurance guidance may define levels and corresponding safeguards.

## Related controls

From the [official IA-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a37ia8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-14](../AC-access-control/AC-14-permitted-actions-without-identification-or-authentication.md), [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [IA-2](IA-2-identification-and-authentication-organizational-users.md), [IA-4](IA-4-identifier-management.md), [IA-5](IA-5-authenticator-management.md), [MA-4](../MA-maintenance/MA-4-non-local-maintenance.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SC-8](../SC-system-and-communications-protection/SC-8-transmission-confidentiality-and-integrity.md).

## Plain-language metaphor

Visitors still sign in and show a suitable pass even though they do not work in the building.

## Stagehand and operator guidance

For customers, partners, or external testers using a Stagehand deployment, operators should use approved identity federation or unique accounts, apply assurance appropriate to the data, limit guest permissions, and remove access when no longer needed. Never rely on shared “visitor” credentials for traceable actions.

## Enhancements

1. **IA-8(1–5):** PIV acceptance from other agencies, third-party credentials, FICAM-approved products/profiles, and PIV-I acceptance are each marked not applicable to the Government of Canada in Annex 3A.
2. **IA-8(6):** determine identity and credential assurance levels using the TBS standardized framework and implement its minimum identity-assurance requirements. Apply according to the current applicable government standard/profile.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
