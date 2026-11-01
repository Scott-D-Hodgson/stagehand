# CM-3 — Configuration Change Control

**Source:** [ITSG-33 Annex 3A, CM-3](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm3).

## Control definition

Identify which changes are controlled; review and approve/reject them with explicit security-impact consideration; document decisions; implement approved changes; retain change records for a defined period; audit/review change activity; and coordinate oversight through an assigned change-control body or process.

**Organisation-defined parameters to review:** change types, record retention, approving body, and its meeting cadence or triggering conditions. **Suggested value for review:** require documented review for security-relevant changes and preserve records per the organisation’s retention schedule.

## Supplemental guidance

Change control covers proposal, justification, implementation, testing, review, and disposition of changes to hardware, software, firmware, settings, baselines, and vulnerability fixes. It includes unauthorized/unscheduled change detection and oversight.

## In plain language

Before changing a bridge, record the plan, check the safety impact, get approval, test it, and keep a record of what was built.

## Related controls

From the [official CM-3 entry](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33#a35cm3), checked 1 November 2026. These are catalogue relationships, not a claim that the linked controls are implemented.

- **Base control:** [CA-7](../CA-security-assessment-and-authorization/CA-7-continuous-monitoring.md), [CM-2](CM-2-baseline-configuration.md), [CM-4](CM-4-security-impact-analysis.md), [CM-5](CM-5-access-restrictions-for-change.md), [CM-6](CM-6-configuration-settings.md), [CM-9](CM-9-configuration-management-plan.md), [SA-10](../SA-system-and-services-acquisition/SA-10-developer-configuration-management.md), [SI-2](../SI-system-and-information-integrity/SI-2-flaw-remediation.md), [SI-12](../SI-system-and-information-integrity/SI-12-information-output-handling-and-retention.md).
- **CM-3(6):** [SC-13](../SC-system-and-communications-protection/SC-13-use-of-cryptography.md).

## Stagehand initial assessment

Use review appropriate to the contributor workflow and release approval for security-sensitive code, dependencies, plan formats, browser-control behaviour, permissions, and release workflows. Record risk decisions and deployment changes. Operators should use approved change windows and procedures for production configuration. Any future auto-update or policy-changing feature requires explicit change governance.

## Control enhancements

1. **CM-3(1), automated documentation/notification/prohibition:** automate change records, approval notifications, overdue highlighting, blocking unapproved changes, recording completed changes, and completion notifications.
2. **CM-3(2), test/validate/document:** test and document changes before operational deployment without disrupting operations.
3. **CM-3(3), automated implementation:** automate baseline change implementation/deployment where appropriate.
4. **CM-3(4), security representative:** include an information-security representative in the defined change-control body.
5. **CM-3(5), automated security response:** trigger defined responses when unauthorized baseline changes occur.
6. **CM-3(6), cryptography management:** place cryptographic mechanisms supporting defined safeguards under configuration management.

## Current repository context

PRs and a manual owner self-review are the intended solo change path. The owner reported passing CI on every PR through #50. No independent reviewer approval or automatic security review is established; independent review joins the workflow when other reviewers are available.

Repository implementation review, 1 November 2026; see the [security review evidence and limits](../REVIEW.md). This updates the product context without rating this control satisfied.

## Assessment status

**Planned / not verified.** This mapping reflects the anticipated Stagehand design or deployment context; it is not implementation evidence or a compliance determination.
