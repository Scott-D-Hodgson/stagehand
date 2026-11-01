# CP-12 — Safe Mode

**Source:** [ITSG-33 Annex 3A, CP-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp12).

## Control definition

When organisation-defined conditions are detected, enter a safe operating mode with organisation-defined restrictions.

**Organisation-defined parameters to review:** triggering conditions and allowed/restricted safe-mode functions.

## Supplemental guidance

For systems supporting critical functions, organisations may define conditions that trigger a predefined mode restricting activity. It may activate automatically or manually and permit only functions viable under reduced capabilities.

## In plain language

When a serious warning light appears, a machine can switch to a limited mode that avoids dangerous actions until it is checked.

## Related controls

From the [official CP-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a36cp12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.

## Stagehand initial assessment

A deployment might define safe behaviour such as stopping new tasks, disabling writes, allowing only approved health checks, or requiring human confirmation when authorization, logging, or target integrity is uncertain. Define triggers and recovery authority explicitly. These modes are recommendations; no Stagehand safe-mode feature is assumed implemented.

## Control enhancements

None are listed for CP-12 in Annex 3A.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
