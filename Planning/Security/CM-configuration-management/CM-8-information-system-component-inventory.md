# CM-8 — Information System Component Inventory

**Source:** [ITSG-33 Annex 3A, CM-8](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm8).

## Control definition

Maintain a current, sufficiently detailed inventory of all components in the authorization boundary, with organisation-defined accountability information, and update it at a defined frequency.

**Organisation-defined parameters to review:** inventory fields and update cadence; component scope and ownership.

## Supplemental guidance

Inventories may be centralized but should retain system-specific ownership and association. Useful fields include component specifications, licences, versions, owners, names, addresses, and location. Detail should support tracking and reporting.

## In plain language

Keep an up-to-date list of every part in the system, like a workshop tool inventory that says what exists and who is responsible for it.

## Related controls

From the [official CM-8 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm8), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-2](CM-2-baseline-configuration.md), [CM-6](CM-6-configuration-settings.md).
- **CM-8(2):** [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **CM-8(3):** [AC-17](../AC-access-control/AC-17-remote-access.md), [AC-18](../AC-access-control/AC-18-wireless-access.md), [AC-19](../AC-access-control/AC-19-access-control-for-mobile-devices.md), [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [SI-3](../SI-system-and-information-integrity/SI-3-malicious-code-protection.md), [SI-4](../SI-system-and-information-integrity/SI-4-information-system-monitoring.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md), [RA-5](../RA-risk-assessment/RA-5-vulnerability-scanning.md).
- **CM-8(6):** [CM-2](CM-2-baseline-configuration.md), [CM-6](CM-6-configuration-settings.md).
- **CM-8(9):** [SA-4](../SA-system-and-services-acquisition/SA-4-acquisition-process.md).

## Stagehand initial assessment

Product maintainers should inventory source dependencies, generated assets, release artifacts, and supported runtime/browser components. Operators should inventory hosts, runner images, browsers, network components, cloud services, and integrations within their authorization boundary. Record versions, owners, configuration, and approved deviations.

## Control enhancements

1. **CM-8(1), updates during installation/removal:** update inventory as components are installed, removed, or changed.
2. **CM-8(2), automated maintenance:** use automation to keep inventory current, complete, accurate, and accessible.
3. **CM-8(3), unauthorized-component detection:** detect unauthorized hardware/software/firmware at a defined frequency and disable, isolate, or notify as selected.
4. **CM-8(4), accountability information:** identify the responsible administrator by name, position, or role.
5. **CM-8(5), no duplicate accounting:** verify in-boundary components are not duplicated across inventories.
6. **CM-8(6), assessed configurations/deviations:** record assessed configurations and approved deviations.
7. **CM-8(7), centralized repository:** maintain a central component-inventory repository.
8. **CM-8(8), automated location tracking:** track component geographic locations automatically.
9. **CM-8(9), assignment to systems:** assign acquired components to a system and obtain system-owner acknowledgement.

## Current repository context

Workspace manifests and package-lock.json inventory direct/transitive npm packages; THIRD-PARTY-NOTICES.md records selected resolved dependency licences and bundled notices. This is not a generated or complete release SBOM, host inventory, or supplier assurance assessment.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
