# SI-11 - Error Handling

**Source:** [ITSG-33 Annex 3A, SI-11](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si11).

## Control definition

Provide enough error detail for corrective action without exposing exploitable information, and show error messages only to assigned roles.

**Organisation-defined parameter:** roles permitted to see error details. **Suggestion for review:** display safe user-facing messages and restrict detailed diagnostics to authorized operators; redact credentials and personal data.

## Supplemental guidance

Carefully consider error structure/content. Errors can reveal passwords, mission details, personal information, or covertly transmit data.

## Related controls

From the [official SI-11 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si11), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [SC-31](../SC-system-and-communications-protection/SC-31-covert-channel-analysis.md).

## Plain-language metaphor

Like telling a caller that a door is locked without giving them the security code or alarm layout.

## Stagehand and operator guidance

Maintainers should redact secrets from errors, logs, traces, and reports and avoid stack/internal detail in user-facing messages. Operators should restrict diagnostic access and review retention/sharing.

## Control enhancements

None listed.

## Current repository context

Runner errors now preserve case/step context and causes, including simultaneous assertion/axe errors. Assertions may include expected/actual content; no general secret redaction is implemented. M6 defines later case/run outcome policy. Restrict access to raw diagnostic values and do not use sensitive literals in plans.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** Current error-handling context is reviewed below; no security redaction or deployment assessment is established.
