# IA-3 — Device Identification and Authentication

**Source:** [ITSG-33 Annex 3A, IA-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Uniquely identify and authenticate organisation-defined devices or device types before establishing local, remote, or network connections.

**Organisation-defined parameters:** device scope, connection types, authentication strength, lease details/duration, and configuration-management process for attestation.

## Supplemental guidance

Device identity may use shared network information or stronger organisational authentication mechanisms. Limit application to devices that need it and choose strength based on system sensitivity.

## Plain-language metaphor

Before a machine joins the workshop network, check its own badge as well as the person carrying it.

## Stagehand and operator guidance

Stagehand does not establish trust in the host device. Operators should use managed and authenticated endpoints/runners, device certificates or equivalent network access controls when required, and quarantine noncompliant devices. Do not treat an IP address alone as strong identity. Product deployment should document which device boundary it assumes.

## Enhancements

1. **IA-3(1), cryptographic bidirectional authentication:** authenticate defined devices to each other before connection.
2. **IA-3(2), cryptographic bidirectional network authentication:** withdrawn and incorporated into IA-3(1).
3. **IA-3(3), dynamic address allocation:** standardize/audit defined DHCP lease information and durations.
4. **IA-3(4), device attestation:** manage attestation-based identity through a defined configuration-management process.
