# SC-30 - Concealment and Misdirection

**Source:** [ITSG-33 Annex 3A, SC-30](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc30).

## Control definition

Use assigned concealment/misdirection techniques for defined systems at defined times to confuse or mislead adversaries.

**Organisation-defined parameters:** techniques, systems, and time periods. **Suggestion for review:** use only with explicit threat rationale and security-owner approval; do not rely on obscurity as a substitute for core safeguards.

## Supplemental guidance

Concealment can reduce adversary targeting opportunities; virtualization, randomness, and uncertainty can increase attacker effort. These methods require resources and are expected to be used selectively.

## Related controls

From the [official SC-30 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a316sc30), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SC-26](SC-26-honeypots.md), [SC-29](SC-29-heterogeneity.md), [SI-14](../SI-system-and-information-integrity/SI-14-non-persistence.md).

## Plain-language metaphor

Like using a decoy path to distract intruders while real doors remain locked.

## Stagehand and operator guidance

This is not a default Stagehand feature. Operators may use approved deception technologies, isolated from production. Avoid misleading product behaviour that could confuse legitimate users or undermine security evidence.

## Control enhancements

(1) virtualization techniques withdrawn and incorporated into SC-29(1); (2) introduce randomness into operations/assets; (3) change processing/storage locations periodically or randomly; (4) use realistic but misleading information about security posture in defined components; (5) conceal defined components. These specialized measures are organisation-specific.

## Assessment status

**Planned / specialized environment-dependent; not verified.**
