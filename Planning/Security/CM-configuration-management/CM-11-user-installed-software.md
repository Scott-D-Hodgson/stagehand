# CM-11 — User-Installed Software

**Source:** [ITSG-33 Annex 3A, CM-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm11).

## Control definition

Set policies for user-installed software, enforce them through defined methods, and monitor compliance at a defined frequency.

**Organisation-defined parameters to review:** policy, enforcement method, monitoring frequency, alert recipients, and privilege requirements.

## Supplemental guidance

Users with sufficient privileges may install software. Organisations should define permitted and prohibited installations, such as approved app stores or security updates versus software of unknown provenance. Enforcement may be procedural, automated, or both.

## In plain language

Decide what tools workers may bring into the workshop, check that rule is followed, and require special keys for installation when needed.

## Related controls

From the [official CM-11 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm11), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [CM-2](CM-2-baseline-configuration.md), [CM-3](CM-3-configuration-change-control.md), [CM-5](CM-5-access-restrictions-for-change.md), [CM-6](CM-6-configuration-settings.md), [CM-7](CM-7-least-functionality.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md).
- **CM-11(1):** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).
- **CM-11(2):** [AC-6](../AC-access-control/AC-6-least-privilege.md).

## Stagehand initial assessment

The Stagehand package and dependency installation should use documented, approved sources and lockfiles. Users should not install unofficial browser extensions, binaries, or helper tools to make automation work. Operators should enforce endpoint software policy, alert on unauthorized installation where supported, and reserve installation privileges for administrators.

## Control enhancements

1. **CM-11(1), alerts for unauthorized installations:** alert designated roles when unauthorized installation is detected.
2. **CM-11(2), prohibit installation without privileged status:** block user installation unless explicitly privileged.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
