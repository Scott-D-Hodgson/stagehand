# Lesson 30: Step-timeout inheritance and View summaries

[← Previous: Accessibility configuration and rule tags](29-accessibility-configuration-baseline.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

This M11 slice makes execution timeouts authorable without confusing a
Stagehand fallback with a value stored in a plan.

## One timeout hierarchy

An action or assertion uses its own `timeout` when present. Otherwise it uses
the containing case's `settings.timeout`, then the plan's `defaults.timeout`.
When all three are omitted, runner-core uses Stagehand's built-in 30,000 ms
default. A future CLI will map the serialized plan and case fields into the
runner's public run-level and case settings. Each value is a positive whole
number of milliseconds.

Wait-list entries are separate: their existing `timeout` values continue to
bound an individual wait item and do not inherit this step-timeout hierarchy.

The plan and case UI use an explicit override checkbox. This keeps an omitted
value genuinely omitted in the portable document while still showing the
effective 30,000 ms fallback to the author. Step cards provide the final,
optional override. Editing an action through its dialog or cloning it retains
an existing step timeout.

## View mode is a summary

Edit-mode tabs are useful for authoring but should not decide what someone
sees in View mode. Plan and case details therefore become Bootstrap-style
accordions in View mode, with Default, Browser, and Accessibility sections.
Default opens every time View mode begins. The view state remains temporary
interface state and is not added to the plan or recovery record.

## Try it

1. Leave the plan timeout override disabled and confirm the plan and an
   inheriting case show 30,000 ms.
2. Enable a plan override, set it to `5000`, then enable a case override and
   change that to `1000`.
3. Set one step to `250`, edit the step through its action dialog, and confirm
   the step-level value remains.
4. Switch from Browser or Accessibility in Edit mode to View mode and confirm
   Default opens in the read-only accordion.

## You are ready when

- You can explain step, case, plan, and built-in timeout precedence.
- You can distinguish a portable omitted setting from a displayed fallback.
- You can explain why View mode resets its read-only summary independently of
  Edit-mode tabs.

[← Previous: Accessibility configuration and rule tags](29-accessibility-configuration-baseline.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
