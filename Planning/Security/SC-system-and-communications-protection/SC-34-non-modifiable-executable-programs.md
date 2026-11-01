# SC-34 - Non-Modifiable Executable Programs

**Source:** [ITSG-33 Annex 3A, SC-34](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc34).

## Control definition

For assigned components, load/execute the operating environment and applications from hardware-enforced read-only media.

**Organisation-defined parameters:** components, applications. **Suggestion for review:** apply to specialized high-assurance appliances or immutable infrastructure where feasible.

## Supplemental guidance

Read-only media can preserve executable integrity from image creation. Reprogrammable read-only media requires integrity protection before installation and hardware controls against reprogramming while installed.

## Related controls

From the [official SC-34 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc34), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **SC-34(1):** [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [MP-7](../MP-media-protection/MP-7-media-use.md).
- **SC-34(2):** [AC-5](../AC-access-control/AC-5-separation-of-duties.md), [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md), [CM-9](../CM-configuration-management/CM-9-configuration-management-plan.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md), [MP-5](../MP-media-protection/MP-5-media-transport.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SC-28](SC-28-protection-of-information-at-rest.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md).

## Plain-language metaphor

Like running from a sealed master copy that ordinary users cannot rewrite.

## Stagehand and operator guidance

Stagehand itself does not enforce immutable hosts. Operators may use signed immutable runner images and controlled deployment pipelines; protect the image before provisioning.

## Control enhancements

(1) components with no persistent writable storage; (2) protect integrity before recording to read-only media and control that media afterward; (3) hardware write-protection for defined firmware with controlled procedures to disable/re-enable it during authorized changes.

## Assessment status

**Planned / specialized platform-dependent; not verified.**
