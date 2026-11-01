# AC-7 — Unsuccessful Login Attempts

**Status:** Shared / conditional; not implemented or verified. **Source:** [ITSG-33 Annex 3A](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac7).

## Control definition

Limit consecutive invalid login attempts within an organisation-defined period and apply a response when the limit is exceeded, such as a temporary lock, administrator release, or increasing delay.

## Supplemental Guidance summary

Lockouts can themselves be abused to deny service, so temporary automatic release is common. Controls may be enforced by the operating system or application. The source excludes actions explicitly documented as not requiring authentication under AC-14.

## Related controls

From the [official AC-7 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a31ac7), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.
- **AC-7(2):** [AC-19](AC-19-access-control-for-mobile-devices.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).

## Plain-language explanation

After too many wrong keys, the lock pauses or slows further tries so guessing is harder, while avoiding a lockout attackers could use to block the real owner.

## Stagehand mapping and operator guidance

The planned local editor and CLI have no Stagehand account login. Apply this control to OS, repository, CI, cloud, and target-application authentication. If a future hosted Stagehand service adds accounts, design rate limits and lockout behaviour with denial-of-service risks in mind. Operators should use identity-provider protections and monitor repeated failures.

## Parameters — suggestions for review

Set the failed-attempt count, observation period, response, and lockout/delay duration per identity system. **Suggestion:** use the provider's approved baseline and temporary lockout with automatic recovery; do not apply a single guessed threshold across unrelated services.

## Enhancements

AC-7(1) Automatic account lock is withdrawn and incorporated into the base control. AC-7(2) Purge/wipe mobile device concerns mobile-device data erasure after repeated device-login failures; Stagehand has no mobile device management function. See source for exact parameters and guidance.
