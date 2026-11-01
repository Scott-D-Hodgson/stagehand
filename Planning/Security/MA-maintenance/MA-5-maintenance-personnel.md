# MA-5 — Maintenance Personnel

**Source:** [ITSG-33 Annex 3A, MA-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma5).

## Control definition

Authorize maintenance personnel and keep a list of approved organisations/persons; ensure unescorted technicians have required access; and assign technically competent, appropriately authorized supervisors for technicians who lack those permissions.

## Supplemental guidance

Applies to hardware/software maintainers. Physical-area access is addressed separately. Vendors/consultants may require temporary privileges; base authorization and duration on risk.

## Related controls

From the [official MA-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a39ma5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [IA-8](../IA-identification-and-authentication/IA-8-identification-and-authentication-non-organizational-users.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [PE-2](../PE-physical-and-environmental-protection/PE-2-physical-access-authorizations.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [PE-4](../PE-physical-and-environmental-protection/PE-4-access-control-for-transmission-medium.md), [RA-3](../RA-risk-assessment/RA-3-risk-assessment.md).
- **MA-5(1):** [MP-6](../MP-media-protection/MP-6-media-sanitization.md), [PL-2](../PL-planning/PL-2-system-security-plan.md).
- **MA-5(2):** [PS-3](../PS-personnel-security/PS-3-personnel-screening.md).
- **MA-5(3):** [PS-3](../PS-personnel-security/PS-3-personnel-screening.md).
- **MA-5(4):** [PS-3](../PS-personnel-security/PS-3-personnel-screening.md).

## Plain-language metaphor

Keep a list of approved mechanics, and escort visitors who do not have the workshop’s keys.

## Stagehand and operator guidance

Operators should vet provider support personnel, issue time-limited access, escort or supervise where needed, and revoke temporary accounts after maintenance. Evaluate technician access to plans, credentials, recordings, and production targets.

## Enhancements

1. **MA-5(1), personnel without appropriate access:** escort/supervise, sanitize volatile data and remove/disconnect non-volatile media before work, and define alternative safeguards when sanitization is impossible.
2. **MA-5(2), classified-system clearances:** require appropriate clearances/formal approvals for classified maintenance.
3. **MA-5(3), citizenship requirements for classified systems:** require Canadian citizenship where applicable to classified systems.
4. **MA-5(4), foreign nationals:** restrict foreign-national maintenance of classified systems to specified joint/allied arrangements and document approvals/conditions.
5. **MA-5(5), non-system-related maintenance:** ensure nearby unescorted maintenance personnel have required access authorizations.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
