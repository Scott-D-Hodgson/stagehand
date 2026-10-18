# 3. Versioned test-plan and result schemas

## Self-assessment: do I need this lesson?

Check each statement you can confidently explain without looking it up. If any remain unchecked, read the lesson; if all are checked, try the exercise to confirm you can design clear validation behaviour.

- [ ] I can distinguish valid JSON syntax from a valid Stagehand plan.
- [ ] I can explain what a schema checks and when domain-specific validation is also needed.
- [ ] I understand why a plan and a result may need separate version numbers.
- [ ] I can explain what should happen when software receives an unsupported plan version.
- [ ] I know why changing a contract requires examples and updates to its consumers.

## What you will learn

- What a data contract/schema does for JSON documents.
- How validation differs from execution.
- Why contracts need explicit versions and compatibility rules.
- How to design clear rejection and migration behaviour.

## Core ideas

A **schema** describes the shape and permitted values of data. A validator compares an input document with that contract and reports violations. A schema can check that a field exists and is the right kind of value; domain rules may need additional validation code where a generic schema cannot express the rule clearly.

Think of a schema as a form with labelled boxes and rules for each box. Validation checks the form before it is handed to the operator. If a new form version adds a field or changes a meaning, the version number tells the operator which instructions apply.

The plan describes shared steps, executable cases, and named data sets. A case is one executable test case with steps; plans can reference case JSON files, and a case file may contribute a named data set to the plan-level collection. Stagehand plans are consumed by both the runner and editor, so both must agree about what a valid plan means. Results have their own versioned contract for the runner and downstream tools. The proposed policy is to identify plan schema versions explicitly, reject unsupported versions, and use deliberate migrations rather than silently reinterpret a plan. This does not yet specify a particular JSON Schema draft or migration tool.

## Concepts to understand

### What is meant by “schema representation/validator approach”?

The project has chosen a shared, versioned JSON Schema document for plans. The Vue editor and CLI runner must both consume that same plan schema and report useful errors. Runtime semantic checks may supplement it, but must not make the editor and runner disagree about valid plans. The MVP's run output is JSON only; the result contract is versioned separately. Whether to formalize its structure with a JSON Schema remains a separate implementation decision.

- **Syntax vs. semantics:** valid JSON syntax does not imply the document describes a meaningful plan.
- **Required fields, types, and enumerations:** basic schema constraints that catch missing or malformed values.
- **Version selection:** choose the rules for the declared version before interpreting the document.
- **Backward compatibility:** whether newer software can correctly consume older documents.
- **Breaking change:** a change that causes existing producers or consumers to interpret the contract differently or fail.
- **Migration:** an explicit transformation from one contract version to another; migration should preserve intent or report what cannot be preserved.
- **Fixtures:** representative valid and invalid documents used to demonstrate and check contract behaviour.
- **No silent loss:** unknown instructions must not be dropped as though they had been executed.

## Apply this to Stagehand

Read [ATR-001](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md), [ATR-002](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md), [TE-001](../../Planning/Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md), and [ADR-003](../../Planning/Backlog/decisions/ADR-003-versioned-plan-contract.md). Plan validation should happen before browser launch, so a malformed plan is a plan error rather than a misleading failed test. Keep result versioning separate from plan versioning because each contract has its own consumers and change pace.

For every field, ask: who writes it, who reads it, whether it is required, what values are allowed, what its default means, and what error a user sees when it is invalid. Do not make a default hide an unsupported or misspelled instruction.

## Exercise

Draft a tiny fictional plan contract with a declared version, browser configuration, one case, one named data set, and one action. Create one valid example and invalid examples for a missing required field, wrong value type, unknown action, and unsupported version. Describe the error each should produce and verify that none can launch a browser. Repeat the thought exercise for the versioned JSON run result and one consumer.

## You are ready when

- You can explain the difference between parsing JSON, schema validation, and validating execution-specific rules.
- You can describe how a plan version is selected and what happens when it is unsupported.
- You can identify which changes require a version decision, fixtures, docs, and consumer updates.

## Read next

- [ATR-001 — Versioned JSON test-plan schema](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-001.md)
- [ATR-002 — Load and validate a test plan](../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-002.md)
- [TE-001 — Versioned plan and result schemas](../../Planning/Backlog/technical-enablers/te-001-versioned-plan-and-result-schemas.md)
- [ADR-003 — Versioned test-plan contract](../../Planning/Backlog/decisions/ADR-003-versioned-plan-contract.md)

## Reinforcement quiz

Try these before opening the answer key.

1. Does successfully parsing JSON prove that it is a valid Stagehand test plan? Why?
2. What is the difference between schema validation and execution?
3. Why might plan and result contracts have separate versions?
4. What should a runner do with an unsupported plan version?
5. Name two artifacts or consumers that should be reviewed when a contract changes.

<details>
<summary>Answer key</summary>

1. No. Parsing only proves the text follows JSON syntax; schema and domain rules determine whether the document is a meaningful supported plan.
2. Validation checks the document and rules before running it. Execution performs the actions described by an accepted plan.
3. Plans and results have different producers, consumers, and rates of change; versioning them separately avoids coupling their compatibility decisions.
4. Reject it clearly rather than silently interpreting or dropping instructions.
5. Examples include valid/invalid fixtures, the runner, editor, result/report consumers, documentation, and migration behaviour.

</details>
