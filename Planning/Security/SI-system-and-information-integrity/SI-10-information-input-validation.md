# SI-10 - Information Input Validation

**Source:** [ITSG-33 Annex 3A, SI-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si10).

## Control definition

Validate assigned information inputs for expected syntax and meaning.

**Organisation-defined parameter:** inputs to validate. **Suggestion for review:** validate Stagehand plan schemas, URL/action values, file imports, and configuration at boundaries; reject invalid/unexpected values.

## Supplemental guidance

Validation checks character set, length, range, and allowed values. Untrusted inputs used to construct commands/messages without correct encoding can become executable control information, leading to injection or cross-site scripting. Validate before passing to interpreters.

## Related controls

From the [official SI-10 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si10), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** No explicit related-control list is provided in the source entry.
- **SI-10(1):** [CM-3](../CM-configuration-management/CM-3-configuration-change-control.md), [CM-5](../CM-configuration-management/CM-5-access-restrictions-for-change.md).

## Plain-language metaphor

Like checking a form’s fields and allowed values before handing it to a machine that acts on the information.

## Stagehand and operator guidance

Maintainers should schema-validate plan data, safely encode output, and constrain URLs/actions. Operators should keep plan sources trusted and avoid overriding validation except through controlled procedures.

## Control enhancements

(1) allow only authorized, audited manual validation overrides; (2) review/resolve validation errors within a defined period; (3) specify predictable documented behaviour for invalid input; (4) account for timing interactions among components when handling invalid inputs; (5) restrict inputs to defined trusted sources/formats (allowlisting).

## Current repository context

Plan/case schemas, bundle checks, filesystem containment, and absolute HTTP/HTTPS navigation validation are implemented. Result-model validates document shape/formats, not execution aggregation or authorization. Runner sessions expect validated inputs; loading/validation and dispatch remain separate. Unknown accessibility configuration tags are rejected against axe 4.14.0, while recorded result tags deliberately remain readable across engine versions.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** Input-validation evidence is not assessed.
