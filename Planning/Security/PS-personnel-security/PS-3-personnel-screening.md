# PS-3 — Personnel Screening

**Source:** [ITSG-33 Annex 3A, PS-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a313ps3).

## Control definition

Screen people before granting system access under the applicable TBS standard and rescreen under defined conditions and intervals.

Suggested rescreening: on role changes or credible risk events, with periodicity set by the organisation and its screening authority.

## Supplemental guidance

Screening is tied to role risk and the sensitivity of information; related controls include account, identifier, and facility access management.

## Related controls

From the [official PS-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a313ps3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-2](../AC-access-control/AC-2-account-management.md), [IA-4](../IA-identification-and-authentication/IA-4-identifier-management.md), [PE-2](../PE-physical-and-environmental-protection/PE-2-physical-access-authorizations.md), [PS-2](PS-2-position-categorization.md).
- **PS-3(1):** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md).

## Plain-language metaphor

Like checking a key-holder’s authorization before handing over the key.

## Stagehand and operator guidance

Stagehand provides no identity screening. Operators must perform required screening before granting repository, CI, host, or data access.

## Control enhancements

Enhancements: (1) classified information: clearance and indoctrination at the highest accessible classification; (2) formal indoctrination for information requiring it; (3) special-protection information: official-duty authorization plus organisation-defined screening criteria. Use only where such information is in scope; Stagehand itself does not establish eligibility.

## Assessment status

**Planned / not verified.** Stagehand implementation and deployment evidence must be assessed before assigning an implemented or compliant status. This summary is a paraphrase for planning, not an authorization decision.
