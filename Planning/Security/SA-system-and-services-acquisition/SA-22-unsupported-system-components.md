# SA-22 - Unsupported System Components

**Source:** [ITSG-33 Annex 3A, SA-22](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa22).

## Control definition

Replace components when vendor/developer support ends. If mission/business needs require continued use, document justification and approval.

## Supplemental guidance

Support includes patches, firmware updates, replacement parts, and maintenance contracts. Unsupported components can expose systems to newly discovered weaknesses. Exceptions may be needed when no replacement exists or isolation makes replacement infeasible.

## Related controls

From the [official SA-22 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a315sa22), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [PL-2](../PL-planning/PL-2-system-security-plan.md), [SA-3](SA-3-system-development-lifecycle.md).

## Plain-language metaphor

Like replacing a smoke detector whose manufacturer no longer provides batteries or repairs, unless there is a documented reason and extra protection.

## Stagehand and operator guidance

Maintainers should track supported runtimes and dependencies, update or replace end-of-life components, and publish support policy. Operators should keep the host OS, browser, CI images, and dependencies within support, or document risk and approval for exceptions.

## Control enhancements

(1) provide in-house or defined external support for unsupported components that remain essential.

## Current repository context

Runtime/browser/axe versions are pinned and documented, but a pin alone does not establish ongoing support or advisory monitoring. Keep versions within supported lifecycles through reviewed updates; no automated axe release/tag watcher is implemented.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** No support lifecycle inventory is asserted.
