# CM-9 — Configuration Management Plan

**Source:** [ITSG-33 Annex 3A, CM-9](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Develop and implement a system configuration-management plan that defines roles and processes, identifies configuration items through the lifecycle, places them under management, and protects the plan from unauthorized disclosure or modification.

## Supplemental guidance

The plan tailors organisational CM policy to the system and describes change workflows, settings and baselines, inventories, environment separation, and management of key documents/releases. Configuration items include hardware, software, firmware, and documentation.

## In plain language

This is the instruction manual for tracking every important part and controlling changes from design through retirement.

## Stagehand initial assessment

Product maintainers should define controlled items across source, plans/schema, dependencies, browser/runtime assumptions, build/release artifacts, and docs. Operators should maintain a deployment-specific plan for runner images, secrets/configuration, browser profiles, integrations, and operational records. Protect plans and baselines against unauthorized changes.

## Control enhancements

1. **CM-9(1), assignment of responsibility:** assign CM process development to personnel not directly involved in system development, to provide independent oversight.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

