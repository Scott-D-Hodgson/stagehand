# SC-2 - Application Partitioning

**Source:** [ITSG-33 Annex 3A, SC-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc2).

## Control definition

Separate user functionality, including user-interface services, from information-system management functionality, physically or logically.

## Supplemental guidance

Management functions often require privileged access. Separation may use separate machines, OS instances, network addresses, virtualization, or distinct interfaces/authentication, such as a separate protected administration domain.

## Related controls

From the [official SC-2 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc2), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md), [SA-8](../SA-system-and-services-acquisition/SA-8-security-engineering-principles.md), [SC-3](SC-3-security-function-isolation.md).
- **SC-2(1):** [AC-3](../AC-access-control/AC-3-access-enforcement.md).

## Plain-language metaphor

Like keeping the public entrance separate from the control room where staff manage the building.

## Stagehand and operator guidance

If Stagehand adds administrative functions, maintainers should separate them from test-user features and require stronger access controls. Operators should host management consoles and CI administration on restricted interfaces, separate from runner/user access where practical.

## Control enhancements

(1) prevent management-related functionality from being presented at interfaces for non-privileged users. Administrative controls should not merely be visible but disabled; require an appropriately privileged session.

## Assessment status

**Planned / architecture-dependent; not verified.** Current repo plans do not demonstrate privileged management interfaces.
