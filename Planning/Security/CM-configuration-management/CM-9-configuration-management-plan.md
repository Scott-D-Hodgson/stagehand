# CM-9 — Configuration Management Plan

**Source:** [ITSG-33 Annex 3A, CM-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm9).

## Control definition

Develop and implement a system configuration-management plan that defines roles and processes, identifies configuration items through the lifecycle, places them under management, and protects the plan from unauthorized disclosure or modification.

## Supplemental guidance

The plan tailors organisational CM policy to the system and describes change workflows, settings and baselines, inventories, environment separation, and management of key documents/releases. Configuration items include hardware, software, firmware, and documentation.

## In plain language

This is the instruction manual for tracking every important part and controlling changes from design through retirement.

## Related controls

From the [official CM-9 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm9), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CM-2](CM-2-baseline-configuration.md), [CM-3](CM-3-configuration-change-control.md), [CM-4](CM-4-security-impact-analysis.md), [CM-5](CM-5-access-restrictions-for-change.md), [CM-8](CM-8-information-system-component-inventory.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md).

## Stagehand initial assessment

Product maintainers should define controlled items across source, plans/schema, dependencies, browser/runtime assumptions, build/release artifacts, and docs. Operators should maintain a deployment-specific plan for runner images, secrets/configuration, browser profiles, integrations, and operational records. Protect plans and baselines against unauthorized changes.

## Control enhancements

1. **CM-9(1), assignment of responsibility:** assign CM process development to personnel not directly involved in system development, to provide independent oversight.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
