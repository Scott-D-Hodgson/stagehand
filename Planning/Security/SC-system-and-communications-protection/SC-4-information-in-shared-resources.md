# SC-4 - Information in Shared Resources

**Source:** [ITSG-33 Annex 3A, SC-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Prevent unauthorized or unintended transfer of information through shared system resources after those resources are released by prior users or processes.

## Supplemental guidance

This is also called object reuse or residual information protection. It concerns prior-user information becoming available to a new user of memory, registers, disks, or other shared resources. It does not cover data remanence after nominal deletion, covert channels, or single-user components.

## Plain-language metaphor

Like wiping a shared desk between users so the next person cannot read the previous person’s notes.

## Stagehand and operator guidance

Maintainers should avoid cross-run leakage of plans, credentials, browser state, and temporary artifacts. Operators should use isolated runner workspaces/profiles and securely clean or recycle shared hosts according to organisational media rules.

## Control enhancements

(1) security levels withdrawn and incorporated into SC-4; (2) when processing explicitly switches between security categories/classification levels, prevent unauthorized transfer using defined procedures, which may include sanitization. Enhancement (2) applies only to multi-level processing contexts.

## Assessment status

**Planned / deployment-dependent; not verified.** No shared-host isolation or cleanup behaviour is verified.

## Organisation-defined parameter suggestions

SC-4(2) requires procedures for preventing transfer when processing switches between security categories. **Suggestion for review:** include an approved sanitization/clearance step at every boundary crossing, and define which roles can approve exceptions. This applies only if the deployment processes multiple categories.
