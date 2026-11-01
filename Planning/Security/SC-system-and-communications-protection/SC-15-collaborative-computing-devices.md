# SC-15 - Collaborative Computing Devices

**Source:** [ITSG-33 Annex 3A, SC-15](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc15).

## Control definition

Prohibit remote activation of collaborative computing devices except for defined exceptions, and provide an explicit indication to people physically present when devices are in use.

**Organisation-defined parameter:** exceptions for remote activation. **Suggestion for review:** allow only documented business cases and require visible device-use indicators.

## Supplemental guidance

Examples include networked whiteboards, cameras, and microphones. Clear indicators tell users when a device is active.

## Related controls

From the [official SC-15 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc15), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-21](../AC-access-control/AC-21-information-sharing.md).

## Plain-language metaphor

Like a meeting-room light that turns on whenever the microphone or camera is live.

## Stagehand and operator guidance

Stagehand is not a collaboration-device manager. Operators running automation on endpoints should review microphone/camera permissions and disable unnecessary remote activation through OS/MDM policy.

## Control enhancements

(1) easy physical disconnect; (2) inbound/outbound traffic blocking withdrawn and incorporated into SC-7; (3) disable/remove devices from defined systems in secure work areas; (4) explicitly indicate the current participants in defined online meetings/teleconferences.

## Assessment status

**Planned / endpoint-dependent; not verified.**
