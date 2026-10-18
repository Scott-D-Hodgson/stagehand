# SC-100 - Source Authentication

**Source:** [ITSG-33 Annex 3A, SC-100](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Allow a message recipient to verify the claimed source identifier in a message.

## Supplemental guidance

Source authentication prevents impersonation in non-session communications and can be implemented at protocol layers ranging from IP packets to email.

## Plain-language metaphor

Like checking a signature on a letter to know who actually sent it.

## Stagehand and operator guidance

Maintainers should authenticate release/update sources and any non-session messages if such integrations are added. Operators should verify software provenance and authenticate automated notifications using approved mechanisms.

## Control enhancements

(1) cryptographically authenticate the claimed identifier; (2) use CMVP-certified cryptography for digital-signature generation/verification; (3) use CSE-approved cryptography/protocols for authentication. Select according to applicable requirements and SC-13.

## Assessment status

**Planned / integration-dependent; not verified.**
