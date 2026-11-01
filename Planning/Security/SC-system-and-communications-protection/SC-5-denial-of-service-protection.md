# SC-5 - Denial of Service Protection

**Source:** [ITSG-33 Annex 3A, SC-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc5).

## Control definition

Protect against or limit effects of defined denial-of-service attack types using defined safeguards.

**Organisation-defined parameters:** attack types and safeguards. **Suggestion for review:** cover resource exhaustion and abusive traffic relevant to exposed services; use rate limits, quotas, filtering, and capacity planning as appropriate to the deployment.

## Supplemental guidance

Filtering at network boundaries can protect internal systems. Capacity, bandwidth, and service redundancy can also reduce susceptibility to flooding attacks.

## Related controls

From the [official SC-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-6](SC-6-resource-availability.md), [SC-7](SC-7-boundary-protection.md).
- **SC-5(3):** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md).

## Plain-language metaphor

Like a venue limiting crowd size and keeping emergency exits clear so one rush cannot stop all operations.

## Stagehand and operator guidance

A local browser runner has limited DoS exposure from the app itself but can overload target systems if plans repeat or parallelize actions. Maintainers should consider limits on loops/concurrency. Operators should authorize load, rate-limit external interfaces, and prevent runner hosts from being used to flood third parties.

## Control enhancements

(1) restrict users’ ability to launch defined DoS attacks against other systems; (2) manage excess capacity/bandwidth/redundancy; (3) use defined monitoring tools and resource monitoring to detect attacks and determine capacity. Scope is environment-dependent.

## Current repository context

Per-action and wait timeouts are implemented, but overall case/run limits, concurrency policy, and bounded-loop execution are not. Enabled axe assessments add work after eligible steps and retain raw observations; they do not impose a workload or target rate limit. Operators must set job/resource limits separately.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / environment-dependent; not verified.** No DoS-resilience testing is asserted.
