# SI-15 - Information Output Filtering

**Source:** [ITSG-33 Annex 3A, SI-15](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si15).

## Control definition

Validate output from assigned programs/applications to ensure it matches expected content.

**Organisation-defined parameter:** programs/outputs. **Suggestion for review:** validate generated reports and exported data against expected structure; flag unexpected content and avoid unsafe rendering.

## Supplemental guidance

Unexpected output may reveal injection or other malicious behaviour. Filtering can detect extraneous content, prevent display, and alert monitoring tools.

## Related controls

From the [official SI-15 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si15), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [SI-3](SI-3-malicious-code-protection.md), [SI-4](SI-4-information-system-monitoring.md).

## Plain-language metaphor

Like checking what comes out of a machine against the expected receipt before handing it to a customer.

## Stagehand and operator guidance

Maintainers should safely encode report content, validate output formats, and handle untrusted browser text. Operators should scan and review artifacts before sharing, especially HTML reports, screenshots, and traces.

## Control enhancements

None listed.

## Current repository context

Result-model validates a JSON result shape; it does not sanitize page markup or safely render HTML. Axe evidence and assertion diagnostics are untrusted target content. HTML reports and the Vue editor are not implemented; any future rendering must handle that content safely, and no redaction guarantee exists today.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.**
