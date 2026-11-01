# SC-22 - Architecture and Provisioning for Name/Address Resolution Service

**Source:** [ITSG-33 Annex 3A, SC-22](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc22).

## Control definition

Ensure the systems collectively providing organisational name/address resolution are fault-tolerant and separate internal and external roles.

## Supplemental guidance

DNS resilience typically uses at least two authoritative servers, ideally geographically/network separated. Internal resolvers serve internal clients; external-facing resolvers serve external clients. Define which clients may access each role.

## Related controls

From the [official SC-22 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc22), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-2](SC-2-application-partitioning.md), [SC-20](SC-20-secure-name-address-resolution-service-authoritative-source.md), [SC-21](SC-21-secure-name-address-resolution-service-recursive-or-caching-resolver.md), [SC-24](SC-24-fail-in-known-state.md).

## Plain-language metaphor

Like keeping separate, backed-up public and internal directories so one outage or disclosure does not affect both.

## Stagehand and operator guidance

DNS architecture belongs to operators and service providers. Use resilient managed DNS, restrict authoritative servers by role, and ensure runner networks resolve only approved targets.

## Control enhancements

None listed.

## Assessment status

**Planned / DNS-provider-dependent; not verified.**
