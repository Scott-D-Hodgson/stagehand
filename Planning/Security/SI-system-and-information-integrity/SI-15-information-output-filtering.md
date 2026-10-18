# SI-15 - Information Output Filtering

**Source:** [ITSG-33 Annex 3A, SI-15](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Validate output from assigned programs/applications to ensure it matches expected content.

**Organisation-defined parameter:** programs/outputs. **Suggestion for review:** validate generated reports and exported data against expected structure; flag unexpected content and avoid unsafe rendering.

## Supplemental guidance

Unexpected output may reveal injection or other malicious behaviour. Filtering can detect extraneous content, prevent display, and alert monitoring tools.

## Plain-language metaphor

Like checking what comes out of a machine against the expected receipt before handing it to a customer.

## Stagehand and operator guidance

Maintainers should safely encode report content, validate output formats, and handle untrusted browser text. Operators should scan and review artifacts before sharing, especially HTML reports, screenshots, and traces.

## Control enhancements

None listed.

## Assessment status

**Planned / not verified.**
