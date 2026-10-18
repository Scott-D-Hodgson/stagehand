# SI-10 - Information Input Validation

**Source:** [ITSG-33 Annex 3A, SI-10](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Validate assigned information inputs for expected syntax and meaning.

**Organisation-defined parameter:** inputs to validate. **Suggestion for review:** validate Stagehand plan schemas, URL/action values, file imports, and configuration at boundaries; reject invalid/unexpected values.

## Supplemental guidance

Validation checks character set, length, range, and allowed values. Untrusted inputs used to construct commands/messages without correct encoding can become executable control information, leading to injection or cross-site scripting. Validate before passing to interpreters.

## Plain-language metaphor

Like checking a form’s fields and allowed values before handing it to a machine that acts on the information.

## Stagehand and operator guidance

Maintainers should schema-validate plan data, safely encode output, and constrain URLs/actions. Operators should keep plan sources trusted and avoid overriding validation except through controlled procedures.

## Control enhancements

(1) allow only authorized, audited manual validation overrides; (2) review/resolve validation errors within a defined period; (3) specify predictable documented behaviour for invalid input; (4) account for timing interactions among components when handling invalid inputs; (5) restrict inputs to defined trusted sources/formats (allowlisting).

## Assessment status

**Planned / not verified.** Input-validation evidence is not assessed.
