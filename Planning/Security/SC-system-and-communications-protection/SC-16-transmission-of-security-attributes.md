# SC-16 - Transmission of Security Attributes

**Source:** [ITSG-33 Annex 3A, SC-16](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Associate organisation-defined security attributes with information exchanged between systems and system components.

**Organisation-defined parameter:** attributes to associate. **Suggestion for review:** identify labels/classification, integrity, or handling attributes that the deployment actually uses and document how they travel with information.

## Supplemental guidance

Security attributes may be explicit or implicit associations with information. Related controls include access enforcement and security attributes under AC-3, AC-4, and AC-16.

## Plain-language metaphor

Like attaching a handling label to a package so each handler knows how it must be protected.

## Stagehand and operator guidance

If Stagehand plans, reports, or test data carry labels, maintainers should preserve them through parsing/export. Operators should define labels and ensure intermediaries, repositories, and artifact stores do not strip or alter them.

## Control enhancements

(1) validate the integrity of transmitted security attributes.

## Assessment status

**Planned / data-model-dependent; not verified.**
