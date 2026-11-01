# AU-14 — Session Audit

**Source:** [ITSG-33 Annex 3A, AU-14](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au14).

## Control definition

Provide authorized users the ability to select a user session for capture/recording or live viewing/listening.

**Organisation-defined parameter to review:** authorized users and sessions in scope. Session monitoring should be explicitly authorized and legally/privacy reviewed.

## Supplemental guidance

Session auditing can include keystroke monitoring, visited-site tracking, and recording information or file transfers. Design and use these capabilities in consultation with legal counsel and under applicable legislation, policy, and standards.

## In plain language

This is a security camera for a computer session. Because it can capture very private material, decide carefully when it may be used and who may view it.

## Related controls

From the [official AU-14 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au14), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AU-4](AU-4-audit-storage-capacity.md), [AU-5](AU-5-response-to-audit-processing-failures.md), [AU-9](AU-9-protection-of-audit-information.md), [AU-11](AU-11-audit-record-retention.md).

## Stagehand initial assessment

Browser automation may expose session activity through screenshots, traces, or recordings depending on deployment configuration; do not assume those artifacts are enabled or safely protected. Operators should disable session capture unless needed and approved, notify users where required, restrict access, set short retention, redact sensitive data where possible, and obtain privacy/legal approval for monitoring use. Never characterize session recording as an ordinary debug default without verifying the implementation.

## Control enhancements

1. **AU-14(1), system start-up:** initiate session audits at system start-up.
2. **AU-14(2), capture/record and log content:** provide authorized users a capability to capture, record, and log session-related content.
3. **AU-14(3), remote viewing/listening:** permit authorized live remote viewing/listening of established session content.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
