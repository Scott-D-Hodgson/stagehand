# AU-2 — Auditable Events

**Source:** [ITSG-33 Annex 3A, AU-2](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Determine which events the system can audit, coordinate selection with other organisations needing audit information, justify why the selected events support investigations, and specify which events are actually audited and under what conditions or frequency.

**Organisation-defined parameters to review:** auditable event set; audited subset; frequency or trigger for each; and review/update frequency in enhancement 3. **Suggested starting point:** authentication and authorization failures, privileged actions, configuration changes, automation task start/stop/outcome, sensitive data access/export, and security-relevant errors; validate this list with system owners and privacy stakeholders.

## Supplemental guidance

An event is an observable occurrence. Select events based on investigation and ongoing audit needs, applicable requirements, and system impact. Distinguish events the system is capable of recording from the subset actively recorded. Distributed workflows may require correlating records across components.

## In plain language

First decide what a security camera could see, then choose what it should record routinely and explain why those moments matter.

## Stagehand initial assessment

Map events across application, browser, OS, identity provider, runner/orchestrator, and target service. Stagehand should expose enough structured events for operators to understand automation outcomes without logging secrets, page contents, or unnecessary personal information. Verify actual event coverage in each deployment. Organisations should coordinate event selection with incident response and audit teams and review the list periodically.

## Control enhancements

1. **AU-2(1), compilation from multiple sources:** withdrawn and incorporated into AU-12.
2. **AU-2(2), event selection by component:** withdrawn and incorporated into AU-12.
3. **AU-2(3), reviews and updates:** review and update audited events at an organisation-defined frequency. Suggested review: annually and after material incidents or architecture changes.
4. **AU-2(4), privileged functions:** withdrawn and incorporated into AC-6(9).
