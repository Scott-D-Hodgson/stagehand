# SC-22 - Architecture and Provisioning for Name/Address Resolution Service

**Source:** [ITSG-33 Annex 3A, SC-22](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Ensure the systems collectively providing organisational name/address resolution are fault-tolerant and separate internal and external roles.

## Supplemental guidance

DNS resilience typically uses at least two authoritative servers, ideally geographically/network separated. Internal resolvers serve internal clients; external-facing resolvers serve external clients. Define which clients may access each role.

## Plain-language metaphor

Like keeping separate, backed-up public and internal directories so one outage or disclosure does not affect both.

## Stagehand and operator guidance

DNS architecture belongs to operators and service providers. Use resilient managed DNS, restrict authoritative servers by role, and ensure runner networks resolve only approved targets.

## Control enhancements

None listed.

## Assessment status

**Planned / DNS-provider-dependent; not verified.**
