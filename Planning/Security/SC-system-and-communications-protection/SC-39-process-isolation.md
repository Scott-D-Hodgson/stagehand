# SC-39 - Process Isolation

**Source:** [ITSG-33 Annex 3A, SC-39](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc39).

## Control definition

Maintain a separate execution domain for every executing process.

## Supplemental guidance

Separate address spaces let security functions control communication between processes and prevent one process from modifying another’s executing code. Common multi-state operating systems provide process separation.

## Related controls

From the [official SC-39 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc39), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SC-2](SC-2-application-partitioning.md), [SC-3](SC-3-security-function-isolation.md).

## Plain-language metaphor

Like giving each worker a separate locked workspace so one cannot alter another’s tools.

## Stagehand and operator guidance

Maintainers should avoid requiring elevated privileges and keep runner/browser workloads isolated. Operators should use OS process isolation, containers/VMs where appropriate, and prevent unrelated workloads from sharing privileged execution contexts.

## Control enhancements

(1) use hardware separation mechanisms for process separation; (2) maintain separate execution domains for each thread in defined multithreaded processing.

## Current repository context

Fresh Playwright contexts isolate browser state per case, but share the run browser process. They are not per-case OS processes, containers, or tenants. Operators remain responsible for host/process isolation, worker identity, and protection from untrusted page content.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / platform-dependent; not verified.**
