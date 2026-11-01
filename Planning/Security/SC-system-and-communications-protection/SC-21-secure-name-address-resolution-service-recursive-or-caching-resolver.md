# SC-21 - Secure Name/Address Resolution Service (Recursive or Caching Resolver)

**Source:** [ITSG-33 Annex 3A, SC-21](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc21).

## Control definition

Request and validate origin authentication and integrity of name/address-resolution responses from authoritative sources.

## Supplemental guidance

Clients can validate themselves or use authenticated channels to trusted validating resolvers. DNS clients validate DNSSEC or communicate securely with a resolver that does.

## Related controls

From the [official SC-21 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc21), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-20](SC-20-secure-name-address-resolution-service-authoritative-source.md), [SC-22](SC-22-architecture-and-provisioning-for-name-address-resolution-service.md).

## Plain-language metaphor

Like checking a directory entry’s seal yourself or consulting a trusted clerk who performs that check.

## Stagehand and operator guidance

Operators configure managed endpoints and CI agents to use trusted validating resolvers and protect resolver communication. Stagehand should not disable certificate or DNS validation to make tests pass.

## Control enhancements

(1) data-origin/integrity enhancement withdrawn and incorporated into SC-21.

## Assessment status

**Planned / deployment-dependent; not verified.**
