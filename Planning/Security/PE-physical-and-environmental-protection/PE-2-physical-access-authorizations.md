# PE-2 — Physical Access Authorizations

**Source:** [ITSG-33 Annex 3A, PE-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe2).

## Control definition

Maintain an approved list of people authorized for the system facility; issue access credentials; review the list at a defined frequency; and remove access when no longer needed.

**Organisation-defined parameter:** access-list review frequency. **Suggestion for review:** quarterly, and immediately upon role change or departure, subject to facility policy.

## Supplemental guidance

Applies to employees and visitors in non-public areas. Credential strength should align with policy and sensitivity. Permanent credential holders are not treated as visitors.

## Related controls

From the [official PE-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a311pe2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [PE-3](PE-3-physical-access-control.md), [PE-4](PE-4-access-control-for-transmission-medium.md), [PS-3](../PS-personnel-security/PS-3-personnel-screening.md).
- **PE-2(1):** [AC-2](../AC-access-control/AC-2-account-management.md), [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md).
- **PE-2(2):** [IA-2](../IA-identification-and-authentication/IA-2-identification-and-authentication-organizational-users.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [IA-5](../IA-identification-and-authentication/IA-5-authenticator-management.md).
- **PE-2(3):** [PS-2](../PS-personnel-security/PS-2-position-categorization.md), [PS-6](../PS-personnel-security/PS-6-access-agreements.md).

## Plain-language metaphor

Keep a current guest-and-key list for the building and collect the key when someone no longer needs it.

## Stagehand and operator guidance

For local Stagehand endpoints, secure the office and device. For data-centre/hosted deployments, verify facility access controls and provider assurance. Stagehand itself cannot authorize entry or revoke badges.

## Enhancements

1. **PE-2(1), access by position/role:** grant facility access based on job role.
2. **PE-2(2), two forms of identification:** require two approved IDs for visitors.
3. **PE-2(3), restrict unescorted access:** limit unescorted entry to people with required clearance, authorization, need-to-know, or credentials.
4. **PE-2(4), identification cards:** issue personnel cards containing organisation, name/photo, unique number, and expiry date.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
