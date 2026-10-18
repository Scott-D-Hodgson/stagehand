# 1. Versioned JSON results and accessibility findings

## Self-assessment: do I need this lesson?

- [ ] I can distinguish a plan contract from a result contract.
- [ ] I know why a result needs stable case and step identity.
- [ ] I can explain the difference between an accessibility violation and a scan failure.
- [ ] I understand Stagehand's rule for identifying newly observed axe violations.
- [ ] I can describe why automated accessibility results need human interpretation.

## What you will learn

- How structured results serve both people and downstream tools.
- Why results include outcome, duration, diagnostics, and effective safe configuration.
- How to version a result contract independently from the plan schema.
- How Stagehand accumulates accessibility findings within one run.

## Core ideas

A result is a durable record of what a run did and observed. A human needs clear context; a pipeline needs stable fields. Keep those needs in one structured contract rather than scraping console text. A result should identify the run, plan, cases, outcomes, durations, failure details, diagnostics, and effective non-secret configuration. The result version can evolve separately from the plan version because producers and consumers change at different times.

Stagehand's MVP emits JSON only. Azure DevOps retains it as a pipeline artifact; it does not publish individual tests into the Azure DevOps Test Results view. JUnit-compatible XML, HTML reports, and screenshots are deferred. Do not add those formats to the MVP just because they are familiar.

The optional axe scan runs after each step. During a run, a finding is considered already seen only when URL, violation description, and problematic markup all match. If URL and description match but new problematic markup appears, add that markup to the existing finding. Findings do not fail functional status by default; plan/case settings can change that. An axe scan error is a separate execution problem, not an accessibility violation.

Automated accessibility checks catch only issues that their rules can detect. They do not establish full conformance and do not replace manual review with assistive technology or keyboard use. Keep this limitation visible in the result and documentation.

## Apply this to Stagehand

Use stable IDs for run/case/step relationships, while keeping localized names and descriptions as display data. Never include secret values in effective configuration. Include enough diagnostics to connect a failure to a case and step. Accessibility findings need rule identity, description, URL, and markup evidence so deduplication and later review are possible.

Define the relationship between case statuses and overall run status consistently. A non-failing accessibility finding should still be visible in JSON. If configuration makes findings fail the case, retain the finding and identify the configured policy that changed status.

## Exercise

Create three synthetic axe observations: the same URL/description/markup twice; same URL/description but new markup; and same description/markup on a different URL. Show which observations deduplicate and what the accumulated JSON finding should contain. Add a separate scan-error example and a functional hard-assertion failure.

## You are ready when

- Consumers can read results without parsing console prose.
- Findings are deduplicated by the agreed three-part identity and preserve new markup.
- Scan errors, accessibility findings, assertion failures, and infrastructure errors remain distinguishable.

## Read next

- [Results and reporting epic E03](../../Planning/Backlog/epics/E03-results-and-reporting/README.md)
- [Reports and accessibility ATR-004](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-004.md)
- [axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [axe-core project and coverage limits](https://github.com/dequelabs/axe-core)

## Reinforcement quiz

1. Why is the result version separate from the plan schema version?
2. Which three values define a duplicate accessibility observation?
3. What happens if the same URL and violation description include newly seen problematic markup?
4. Do axe findings fail the case by default?
5. What is outside the MVP result formats?

<details>
<summary>Answer key</summary>

1. They have different producers, consumers, and change cycles.
2. URL, violation description, and problematic markup.
3. The new markup is added to the existing URL and violation finding.
4. No. They are recorded but non-failing by default; plan/case configuration may make them fail.
5. JUnit conversion, HTML reports, and screenshots.

</details>
