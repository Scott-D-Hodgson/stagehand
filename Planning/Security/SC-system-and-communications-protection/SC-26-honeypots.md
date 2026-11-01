# SC-26 - Honeypots

**Source:** [ITSG-33 Annex 3A, SC-26](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc26).

## Control definition

Include components intentionally designed as targets for malicious attacks to detect, deflect, and analyse attacks.

## Supplemental guidance

A honeypot is a decoy that attracts adversaries away from operational systems. Depending on its use, legal counsel consultation may be appropriate.

## Related controls

From the [official SC-26 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc26), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-30](SC-30-concealment-and-misdirection.md), [SC-44](SC-44-detonation-chambers.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

## Plain-language metaphor

Like a decoy safe that draws attention away from the real valuables while alerting security when someone tries it.

## Stagehand and operator guidance

Stagehand should not create decoy targets by default. Operators deploying honeypots must isolate them from production and handle collected data under legal, privacy, and incident-response policies.

## Control enhancements

(1) detection of malicious code withdrawn and incorporated into SC-35.

## Assessment status

**Planned / not applicable to standard Stagehand function; environment-dependent.**
