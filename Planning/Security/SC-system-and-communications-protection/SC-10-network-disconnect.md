# SC-10 - Network Disconnect

**Source:** [ITSG-33 Annex 3A, SC-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc10).

## Control definition

Terminate a network connection at the end of its communications session or after an organisation-defined inactivity period.

**Organisation-defined parameter:** inactivity period. **Suggestion for review:** set shorter timeouts for privileged/remote sessions and align ordinary sessions to service needs; document exceptions.

## Supplemental guidance

Applies to internal and external networks. Termination can release TCP/IP address/port assignments or application-level connections when sessions share an OS connection.

## Related controls

From the [official SC-10 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc10), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Plain-language metaphor

Like hanging up a phone after a call instead of leaving an open line indefinitely.

## Stagehand and operator guidance

Maintainers should ensure any future managed service session is closed after use. Operators should configure session and idle timeouts on remote access, CI consoles, editor hosting, and intermediary services; browser target sessions may have separate application-specific lifetimes.

## Control enhancements

None listed.

## Assessment status

**Planned / deployment-dependent; not verified.** No session timeout behaviour is established here.
