# SI-8 - Spam Protection

**Source:** [ITSG-33 Annex 3A, SI-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Use spam protections at system entry/exit points to detect and act on unsolicited messages; update protections as releases become available under configuration policy.

## Supplemental guidance

Entry/exit points include email, web, proxy, remote-access servers, and endpoints. Spam can arrive through email, attachments, and web access; controls may use signatures.

## Plain-language metaphor

Like screening junk mail at the mailroom and keeping the screening rules current.

## Stagehand and operator guidance

Spam filtering is an operator/hosting control, not a Stagehand feature. Protect developer email, source-control notifications, CI alerts, and any support mailbox with managed filtering.

## Control enhancements

(1) centrally manage spam protection; (2) automatically update protection mechanisms; (3) use learning capabilities (for example, user feedback improving classification).

## Assessment status

**Planned / environment-dependent; not verified.**
