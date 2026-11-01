# AU-3 — Content of Audit Records

**Source:** [ITSG-33 Annex 3A, AU-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au3).

## Control definition

Generate audit records that establish the event type, time, location, source, outcome, and identity of associated people or processes.

## Supplemental guidance

Useful record fields may include timestamps, source/destination, user or process identifiers, event descriptions, success/failure, affected filenames, and the access or flow rule applied. Record enough context for investigations while limiting unnecessary or misleading data.

## In plain language

A useful receipt tells you what happened, when and where it happened, who or what did it, and whether it worked.

## Related controls

From the [official AU-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a33au3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [AU-2](AU-2-auditable-events.md), [AU-8](AU-8-time-stamps.md), [AU-12](AU-12-audit-generation.md), [SI-11](../SI-system-and-information-integrity/SI-11-error-handling.md).
- **AU-3(2):** [AU-6](AU-6-audit-review-analysis-and-reporting.md), [AU-7](AU-7-audit-reduction-and-report-generation.md).

## Stagehand initial assessment

Define a privacy-conscious event schema for Stagehand and correlate it with host/browser and target-service records. Candidate fields include task/run ID, authenticated principal, action category, target origin, time, result, and relevant policy decision. Avoid recording passwords, tokens, full page contents, or screenshots by default. Validate that errors and cancellations are represented and that timestamps are reliable. No particular current Stagehand log schema is asserted here.

## Control enhancements

1. **AU-3(1), additional audit information:** add organisation-defined detailed fields only when needed for a specific audit purpose; carefully assess sensitive command/content logging.
2. **AU-3(2), centralized management of planned audit content:** centrally configure captured audit content for organisation-defined system components. Stagehand deployments could meet this through the organisation’s logging configuration, subject to implementation evidence.

## Current repository context

The result schema has no separate run-ID field. Case IDs, plan identity/fingerprint, and step indices can support future correlation, but a producer must add trustworthy execution and identity context. The loader fingerprint identifies source bytes; it is not proof of approval, signer identity, or execution.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.
