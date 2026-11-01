# CM-5 — Access Restrictions for Change

**Source:** [ITSG-33 Annex 3A, CM-5](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm5).

## Control definition

Define, document, approve, and enforce physical and logical access restrictions for changing the system.

**Organisation-defined parameters to review:** change privileges and their review frequency; software/firmware subject to signature verification; components requiring dual control; operational privileges; and software-library write access.

## Supplemental guidance

Only qualified, authorized people should make changes because changes can affect overall security. Access records support change control and investigations. Restrictions may use account permissions, workflows, protected libraries, and change windows.

## In plain language

Only approved mechanics should be allowed to alter the engine, and the workshop should record who touched it.

## Related controls

From the [official CM-5 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm5), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-6](../AC-access-control/AC-6-least-privilege.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md).
- **CM-5(1):** [AU-2](../AU-audit-and-accountability/AU-2-auditable-events.md), [AU-12](../AU-audit-and-accountability/AU-12-audit-generation.md), [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [CM-3](CM-3-configuration-change-control.md), [CM-6](CM-6-configuration-settings.md).
- **CM-5(2):** [AU-6](../AU-audit-and-accountability/AU-6-audit-review-analysis-and-reporting.md), [AU-7](../AU-audit-and-accountability/AU-7-audit-reduction-and-report-generation.md), [CM-3](CM-3-configuration-change-control.md), [CM-5](CM-5-access-restrictions-for-change.md), [PE-6](../PE-physical-and-environmental-protection/PE-6-monitoring-physical-access.md), [PE-8](../PE-physical-and-environmental-protection/PE-8-access-records.md).
- **CM-5(3):** [CM-7](CM-7-least-functionality.md), [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md), [SI-7](../SI-system-and-information-integrity/SI-7-software-firmware-and-information-integrity.md).
- **CM-5(4):** [AC-5](../AC-access-control/AC-5-separation-of-duties.md), [CM-3](CM-3-configuration-change-control.md).
- **CM-5(5):** [AC-2](../AC-access-control/AC-2-account-management.md).
- **CM-5(6):** [AC-2](../AC-access-control/AC-2-account-management.md).

## Stagehand initial assessment

Protect repository branches, release credentials, package publication, signing keys, production configuration, and deployment environments with least privilege and reviewable access. Separate development from production privileges. Operators should constrain who can modify runner images, browser profiles, secrets, and network policy.

## Control enhancements

1. **CM-5(1), automated enforcement/auditing:** enforce change restrictions and log enforcement.
2. **CM-5(2), review system changes:** review at defined frequencies and circumstances for unauthorized changes.
3. **CM-5(3), signed components:** block defined software/firmware unless a recognized organisational signature is verified.
4. **CM-5(4), dual authorization:** require two qualified people for defined high-impact changes.
5. **CM-5(5), limit production privileges:** restrict and periodically re-evaluate production change privileges.
6. **CM-5(6), limit library privileges:** restrict write privileges to software libraries.
7. **CM-5(7), automatic security safeguards:** withdrawn and incorporated into SI-7.
