# SI-12 - Information Output Handling and Retention

**Source:** [ITSG-33 Annex 3A, SI-12](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si12).

## Control definition

Handle and retain system information and information outputs under applicable legislation and TBS requirements.

## Supplemental guidance

Handling/retention rules apply throughout the information lifecycle and may continue beyond system retirement. The catalogue refers to Library and Archives Canada retention guidance and related media/audit controls.

## Related controls

From the [official SI-12 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a317si12), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AC-16](../AC-access-control/AC-16-security-attributes.md), [AU-5](../AU-audit-and-accountability/AU-5-response-to-audit-processing-failures.md), [AU-11](../AU-audit-and-accountability/AU-11-audit-record-retention.md), [MP-2](../MP-media-protection/MP-2-media-access.md), [MP-4](../MP-media-protection/MP-4-media-storage.md).

## Plain-language metaphor

Like labelling records, storing them securely for the required period, then disposing of them properly.

## Stagehand and operator guidance

Plans, reports, screenshots, traces, logs, and test data may be sensitive. Maintainers should document output contents and safe defaults. Operators set access, retention, encryption, sharing, and disposal rules appropriate to data classification and records obligations.

## Control enhancements

None listed.

## Current repository context

Mapped axe findings retain URL, rule tags, markup, structured selectors, optional failure summary/impact/XPath, and related nodes. Sessions also retain original raw scan results, including incomplete observations, through shared references. Findings are deep copied, but copies are not sanitization; retention, encryption, redaction, and full result serialization remain separate work. JSON is the MVP output; JUnit/HTML reports, screenshots, and traces are deferred.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / deployment-dependent; not verified.**
