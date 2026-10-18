# CM-3 — Configuration Change Control

**Source:** [ITSG-33 Annex 3A, CM-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Identify which changes are controlled; review and approve/reject them with explicit security-impact consideration; document decisions; implement approved changes; retain change records for a defined period; audit/review change activity; and coordinate oversight through an assigned change-control body or process.

**Organisation-defined parameters to review:** change types, record retention, approving body, and its meeting cadence or triggering conditions. **Suggested value for review:** require documented review for security-relevant changes and preserve records per the organisation’s retention schedule.

## Supplemental guidance

Change control covers proposal, justification, implementation, testing, review, and disposition of changes to hardware, software, firmware, settings, baselines, and vulnerability fixes. It includes unauthorized/unscheduled change detection and oversight.

## In plain language

Before changing a bridge, record the plan, check the safety impact, get approval, test it, and keep a record of what was built.

## Stagehand initial assessment

Maintain peer review and release approval for security-sensitive code, dependencies, plan formats, browser-control behaviour, permissions, and release workflows. Record risk decisions and deployment changes. Operators should use approved change windows and procedures for production configuration. Any future auto-update or policy-changing feature requires explicit change governance.

## Control enhancements

1. **CM-3(1), automated documentation/notification/prohibition:** automate change records, approval notifications, overdue highlighting, blocking unapproved changes, recording completed changes, and completion notifications.
2. **CM-3(2), test/validate/document:** test and document changes before operational deployment without disrupting operations.
3. **CM-3(3), automated implementation:** automate baseline change implementation/deployment where appropriate.
4. **CM-3(4), security representative:** include an information-security representative in the defined change-control body.
5. **CM-3(5), automated security response:** trigger defined responses when unauthorized baseline changes occur.
6. **CM-3(6), cryptography management:** place cryptographic mechanisms supporting defined safeguards under configuration management.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.

