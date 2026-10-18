# SI-11 - Error Handling

**Source:** [ITSG-33 Annex 3A, SI-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Provide enough error detail for corrective action without exposing exploitable information, and show error messages only to assigned roles.

**Organisation-defined parameter:** roles permitted to see error details. **Suggestion for review:** display safe user-facing messages and restrict detailed diagnostics to authorized operators; redact credentials and personal data.

## Supplemental guidance

Carefully consider error structure/content. Errors can reveal passwords, mission details, personal information, or covertly transmit data.

## Plain-language metaphor

Like telling a caller that a door is locked without giving them the security code or alarm layout.

## Stagehand and operator guidance

Maintainers should redact secrets from errors, logs, traces, and reports and avoid stack/internal detail in user-facing messages. Operators should restrict diagnostic access and review retention/sharing.

## Control enhancements

None listed.

## Assessment status

**Planned / not verified.** Error handling has not been inspected in an implementation.
