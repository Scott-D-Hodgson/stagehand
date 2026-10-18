# CM-11 — User-Installed Software

**Source:** [ITSG-33 Annex 3A, CM-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Set policies for user-installed software, enforce them through defined methods, and monitor compliance at a defined frequency.

**Organisation-defined parameters to review:** policy, enforcement method, monitoring frequency, alert recipients, and privilege requirements.

## Supplemental guidance

Users with sufficient privileges may install software. Organisations should define permitted and prohibited installations, such as approved app stores or security updates versus software of unknown provenance. Enforcement may be procedural, automated, or both.

## In plain language

Decide what tools workers may bring into the workshop, check that rule is followed, and require special keys for installation when needed.

## Stagehand initial assessment

The Stagehand package and dependency installation should use documented, approved sources and lockfiles. Users should not install unofficial browser extensions, binaries, or helper tools to make automation work. Operators should enforce endpoint software policy, alert on unauthorized installation where supported, and reserve installation privileges for administrators.

## Control enhancements

1. **CM-11(1), alerts for unauthorized installations:** alert designated roles when unauthorized installation is detected.
2. **CM-11(2), prohibit installation without privileged status:** block user installation unless explicitly privileged.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

