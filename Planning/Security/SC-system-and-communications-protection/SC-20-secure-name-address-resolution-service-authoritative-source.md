# SC-20 - Secure Name/Address Resolution Service (Authoritative Source)

**Source:** [ITSG-33 Annex 3A, SC-20](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Authoritative resolution services provide origin-authentication and integrity evidence with responses to external queries and indicate child-zone security status so a supported chain of trust can be verified.

## Supplemental guidance

DNS and DNSSEC signatures/keys are examples. Other name-to-address technologies need equivalent means to assure response authenticity and integrity.

## Plain-language metaphor

Like a directory that not only gives an address but proves the entry came from the legitimate directory office.

## Stagehand and operator guidance

Stagehand consumes hostnames through its runtime/network environment; operators own authoritative DNS and DNSSEC. Use managed, secured DNS and avoid hard-coded or unverified resolution workarounds.

## Control enhancements

(1) child subspaces withdrawn and incorporated into SC-20; (2) provide origin and integrity protection artifacts for internal name/address queries.

## Assessment status

**Planned / network-service-dependent; not verified.**
