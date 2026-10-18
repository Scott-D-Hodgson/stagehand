# SC-39 - Process Isolation

**Source:** [ITSG-33 Annex 3A, SC-39](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Maintain a separate execution domain for every executing process.

## Supplemental guidance

Separate address spaces let security functions control communication between processes and prevent one process from modifying another’s executing code. Common multi-state operating systems provide process separation.

## Plain-language metaphor

Like giving each worker a separate locked workspace so one cannot alter another’s tools.

## Stagehand and operator guidance

Maintainers should avoid requiring elevated privileges and keep runner/browser workloads isolated. Operators should use OS process isolation, containers/VMs where appropriate, and prevent unrelated workloads from sharing privileged execution contexts.

## Control enhancements

(1) use hardware separation mechanisms for process separation; (2) maintain separate execution domains for each thread in defined multithreaded processing.

## Assessment status

**Planned / platform-dependent; not verified.**
