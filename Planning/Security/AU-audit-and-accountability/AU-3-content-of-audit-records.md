# AU-3 — Content of Audit Records

**Source:** [ITSG-33 Annex 3A, AU-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Generate audit records that establish the event type, time, location, source, outcome, and identity of associated people or processes.

## Supplemental guidance

Useful record fields may include timestamps, source/destination, user or process identifiers, event descriptions, success/failure, affected filenames, and the access or flow rule applied. Record enough context for investigations while limiting unnecessary or misleading data.

## In plain language

A useful receipt tells you what happened, when and where it happened, who or what did it, and whether it worked.

## Stagehand initial assessment

Define a privacy-conscious event schema for Stagehand and correlate it with host/browser and target-service records. Candidate fields include task/run ID, authenticated principal, action category, target origin, time, result, and relevant policy decision. Avoid recording passwords, tokens, full page contents, or screenshots by default. Validate that errors and cancellations are represented and that timestamps are reliable. No particular current Stagehand log schema is asserted here.

## Control enhancements

1. **AU-3(1), additional audit information:** add organisation-defined detailed fields only when needed for a specific audit purpose; carefully assess sensitive command/content logging.
2. **AU-3(2), centralized management of planned audit content:** centrally configure captured audit content for organisation-defined system components. Stagehand deployments could meet this through the organisation’s logging configuration, subject to implementation evidence.
