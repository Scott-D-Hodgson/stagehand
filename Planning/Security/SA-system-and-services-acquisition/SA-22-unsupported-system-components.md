# SA-22 - Unsupported System Components

**Source:** [ITSG-33 Annex 3A, SA-22](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Replace components when vendor/developer support ends. If mission/business needs require continued use, document justification and approval.

## Supplemental guidance

Support includes patches, firmware updates, replacement parts, and maintenance contracts. Unsupported components can expose systems to newly discovered weaknesses. Exceptions may be needed when no replacement exists or isolation makes replacement infeasible.

## Plain-language metaphor

Like replacing a smoke detector whose manufacturer no longer provides batteries or repairs, unless there is a documented reason and extra protection.

## Stagehand and operator guidance

Maintainers should track supported runtimes and dependencies, update or replace end-of-life components, and publish support policy. Operators should keep the host OS, browser, CI images, and dependencies within support, or document risk and approval for exceptions.

## Control enhancements

(1) provide in-house or defined external support for unsupported components that remain essential.

## Assessment status

**Planned / not verified.** No support lifecycle inventory is asserted.
