# AC-18 — Wireless Access

**Source:** [ITSG-33 Annex 3A, AC-18](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish usage restrictions, configuration requirements, and connection requirements for wireless access, and authorize wireless access to the information system before permitting it.

**Organisation-defined parameters to review:** authorized wireless technologies, configurations, users/devices, and connection requirements; monitoring requirements; and whether embedded wireless capabilities must be disabled when unused.

## Supplemental guidance

Wireless includes Wi-Fi, cellular, and other radio technologies. Access points and clients should be configured and monitored according to organisational policy. Encryption and authentication protect the link, but do not replace endpoint security or authorization.

## In plain language

Wi-Fi is a doorway that can be reached through the air. A strong lock helps, but the organisation still needs to decide who gets a key and watch for unauthorized doors.

## Stagehand initial assessment

Stagehand inherits wireless risks from the workstation, hosted runner, or remote environment on which it operates. Operators should use approved networks, secure authentication and encryption, managed endpoints, and network segmentation appropriate to the data. Disable unused wireless interfaces where policy requires it; do not assume Stagehand can detect or secure the host’s Wi-Fi configuration.

## Control enhancements

Enhancements include stronger authentication and encryption, monitoring for unauthorized wireless connections (some catalogue enhancements are withdrawn into other controls), disabling wireless when not needed, and restricting user configuration of wireless settings. Confirm the current catalogue status and organisation baseline.
