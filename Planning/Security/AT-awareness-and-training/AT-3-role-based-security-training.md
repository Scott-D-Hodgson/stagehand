# AT-3 — Role-Based Security Training

**Source:** [ITSG-33 Annex 3A, AT-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a32at3).

## Control definition

Provide role-specific security training to people with assigned security duties before granting system access or assigning those duties, when system changes require it, and at an organisation-defined recurring frequency.

**Organisation-defined parameter to review:** recurring frequency; enhancement-specific personnel/roles and indicators of malicious code. **Suggested values for review:** annual refresh, plus role changes and material changes to the system or responsibilities.

## Supplemental guidance

Training should match each person’s duties and the systems they can access. Technical staff, developers, architects, acquisition personnel, administrators, auditors, assessors, and contractors may need tailored training spanning management, operational, technical, physical, personnel, and supply-chain security responsibilities.

## In plain language

A building’s fire warden, electrician, and receptionist need different safety instructions. Give each person practice for the risks and tools in their own job.

## Related controls

From the [official AT-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a32at3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AT-2](AT-2-security-awareness.md), [AT-4](AT-4-security-training-records.md), [PL-4](../PL-planning/PL-4-rules-of-behaviour.md), [PS-7](../PS-personnel-security/PS-7-third-party-personnel-security.md), [SA-3](../SA-system-and-services-acquisition/SA-3-system-development-lifecycle.md), [SA-12](../SA-system-and-services-acquisition/SA-12-supply-chain-protection.md), [SA-16](../SA-system-and-services-acquisition/SA-16-developer-provided-training.md).
- **AT-3(1):** [PE-1](../PE-physical-and-environmental-protection/PE-1-physical-and-environmental-protection-policy-and-procedures.md), [PE-13](../PE-physical-and-environmental-protection/PE-13-fire-protection.md), [PE-14](../PE-physical-and-environmental-protection/PE-14-temperature-and-humidity-controls.md), [PE-15](../PE-physical-and-environmental-protection/PE-15-water-damage-protection.md).
- **AT-3(2):** [PE-2](../PE-physical-and-environmental-protection/PE-2-physical-access-authorizations.md), [PE-3](../PE-physical-and-environmental-protection/PE-3-physical-access-control.md), [PE-4](../PE-physical-and-environmental-protection/PE-4-access-control-for-transmission-medium.md), [PE-5](../PE-physical-and-environmental-protection/PE-5-access-control-for-output-devices.md).

## Stagehand initial assessment

Organisations deploying Stagehand should tailor training by role: end users learn safe task setup and review; administrators learn access, browser-profile, secrets, logging, and update configuration; developers learn secure development and dependency handling; assessors learn how to collect evidence without exposing sensitive data. Train before granting the relevant access and refresh when deployment changes. Product documentation is not proof that personnel completed training.

## Control enhancements

1. **Environmental controls:** train designated personnel initially and on a defined schedule to operate environmental safeguards.
2. **Physical security controls:** train designated personnel initially and periodically to operate physical security safeguards.
3. **Practical exercises:** use exercises that reinforce role-specific security objectives, such as secure development exercises.
4. **Suspicious communications and anomalous behaviour:** train personnel on organisation-defined indicators of malicious code and recognition/reporting of suspicious communications or system behaviour. Define indicators with security specialists.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
