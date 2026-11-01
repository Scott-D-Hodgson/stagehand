# SC-4 - Information in Shared Resources

**Source:** [ITSG-33 Annex 3A, SC-4](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc4).

## Control definition

Prevent unauthorized or unintended transfer of information through shared system resources after those resources are released by prior users or processes.

## Supplemental guidance

This is also called object reuse or residual information protection. It concerns prior-user information becoming available to a new user of memory, registers, disks, or other shared resources. It does not cover data remanence after nominal deletion, covert channels, or single-user components.

## Related controls

From the [official SC-4 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc4), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-3](../AC-access-control/AC-3-access-enforcement.md), [AC-4](../AC-access-control/AC-4-information-flow-enforcement.md), [MP-6](../MP-media-protection/MP-6-media-sanitization.md).

## Plain-language metaphor

Like wiping a shared desk between users so the next person cannot read the previous person’s notes.

## Stagehand and operator guidance

Maintainers should avoid cross-run leakage of plans, credentials, browser state, and temporary artifacts. Operators should use isolated runner workspaces/profiles and securely clean or recycle shared hosts according to organisational media rules.

## Control enhancements

(1) security levels withdrawn and incorporated into SC-4; (2) when processing explicitly switches between security categories/classification levels, prevent unauthorized transfer using defined procedures, which may include sanitization. Enhancement (2) applies only to multi-level processing contexts.

## Current repository context

Each case session now receives a fresh browser context/page, and run shutdown closes active sessions and waits for in-flight setup. Tests use doubles; this is not proof of isolation on a shared host or secure erasure. Raw axe scan history persists while the session object is retained, independently of context closure.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.** No shared-host isolation or cleanup behaviour is verified.

## Organisation-defined parameter suggestions

SC-4(2) requires procedures for preventing transfer when processing switches between security categories. **Suggestion for review:** include an approved sanitization/clearance step at every boundary crossing, and define which roles can approve exceptions. This applies only if the deployment processes multiple categories.
