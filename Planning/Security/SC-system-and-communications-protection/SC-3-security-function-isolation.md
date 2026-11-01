# SC-3 - Security Function Isolation

**Source:** [ITSG-33 Annex 3A, SC-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc3).

## Control definition

Isolate system security functions from non-security functions using boundaries that protect their access and integrity, and restrict access to them through least privilege.

## Supplemental guidance

Isolation may use partitions/domains, hardware modes, filesystem protections, or address-space boundaries. Minimize non-security functions inside the boundary that enforces security; some implementations need limited exceptions.

## Related controls

From the [official SC-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SA-5](../SA-system-and-services-acquisition/SA-5-information-system-documentation.md), [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SA-13](../SA-system-and-services-acquisition/SA-13-trustworthiness.md), [SC-2](SC-2-application-partitioning.md), [SC-7](SC-7-boundary-protection.md), [SC-39](SC-39-process-isolation.md).

## Plain-language metaphor

Like keeping the fire-alarm control panel in a locked cabinet apart from ordinary room controls.

## Stagehand and operator guidance

Maintainers should isolate plan validation, policy enforcement, and secret handling from ordinary test-plan execution where architecture permits. Operators should use OS/container boundaries and least-privileged accounts to protect runner control functions.

## Control enhancements

(1) use hardware separation; (2) isolate access and information-flow enforcement functions from non-security functions and other security functions; (3) minimize non-security functionality inside the isolation boundary; (4) implement security functions as independent, cohesive modules with low coupling; (5) layer security functions with minimal interaction and no lower-layer dependency on higher-layer correctness. These are architecture choices; verify concrete boundaries before claiming satisfaction.

## Assessment status

**Planned / architecture-dependent; not verified.** No runtime isolation evidence is asserted.
