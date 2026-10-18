# SC-42 - Sensor Capability and Data

**Source:** [ITSG-33 Annex 3A, SC-42](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Prohibit remote activation of environmental sensors except for defined exceptions, and explicitly indicate sensor use to a defined user class.

**Organisation-defined parameters:** exceptions and users to be notified. **Suggestion for review:** define camera/microphone/location permissions and visible indicators for managed endpoints.

## Supplemental guidance

Mobile systems may contain cameras, microphones, GPS, and accelerometers. Covert activation could reveal sensitive information or track people.

## Plain-language metaphor

Like ensuring a device’s camera light is on whenever it records and that nobody can secretly switch it on remotely.

## Stagehand and operator guidance

Stagehand’s browser automation may interact with web APIs but does not manage endpoint sensors. Operators should restrict browser/OS permissions and prohibit sensor-capable devices in controlled areas where policy requires.

## Control enhancements

(1) route sensor data only to authorized roles; (2) ensure use is limited to authorized purposes; (3) prohibit devices with assigned sensing capabilities in defined facilities/areas/systems.

## Assessment status

**Planned / endpoint- and facility-dependent; not verified.**
