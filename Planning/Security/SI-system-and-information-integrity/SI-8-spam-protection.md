# SI-8 - Spam Protection

**Source:** [ITSG-33 Annex 3A, SI-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si8).

## Control definition

Use spam protections at system entry/exit points to detect and act on unsolicited messages; update protections as releases become available under configuration policy.

## Supplemental guidance

Entry/exit points include email, web, proxy, remote-access servers, and endpoints. Spam can arrive through email, attachments, and web access; controls may use signatures.

## Related controls

From the [official SI-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AT-2](../AT-awareness-and-training/AT-2-security-awareness.md), [AT-3](../AT-awareness-and-training/AT-3-role-based-security-training.md), [SC-5](../SC-system-and-communications-protection/SC-5-denial-of-service-protection.md), [SC-7](../SC-system-and-communications-protection/SC-7-boundary-protection.md), [SI-3](SI-3-malicious-code-protection.md).
- **SI-8(1):** [AU-3](../AU-audit-and-accountability/AU-3-content-of-audit-records.md), [SI-2](SI-2-flaw-remediation.md), [SI-7](SI-7-software-firmware-and-information-integrity.md).

## Plain-language metaphor

Like screening junk mail at the mailroom and keeping the screening rules current.

## Stagehand and operator guidance

Spam filtering is an operator/hosting control, not a Stagehand feature. Protect developer email, source-control notifications, CI alerts, and any support mailbox with managed filtering.

## Control enhancements

(1) centrally manage spam protection; (2) automatically update protection mechanisms; (3) use learning capabilities (for example, user feedback improving classification).

## Assessment status

**Planned / environment-dependent; not verified.**
