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

Wait-list entries are separate: Locator and Page-state waits may carry an
independent `timeout` that does not inherit this step-timeout hierarchy. A
fixed Delay wait authors only its delay in the editor. The version 1 contract
still accepts an imported legacy Delay-wait timeout, which the editor preserves
without displaying; [ATR-043](../../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-043.md)
records the deliberate future contract change.

The plan and case UI place their explicit timeout checkboxes in an Overrides
panel. This keeps an omitted value genuinely omitted in the portable document
while still showing the effective 30,000 ms fallback to the author. A Step
override is explicitly enabled rather than implied by an empty timeout field.
Editing an action through its dialog or cloning it retains an existing step
timeout.

## View mode is a summary

Edit-mode tabs are useful for authoring, and their selected context remains
useful while inspecting the same settings. Plan, case, and Step details retain
their Bootstrap-style tabs in View mode, while their panels become plain
read-only summaries. Changing modes preserves the selected tab. The view state
remains temporary interface state and is not added to the plan or recovery
record.

## Try it

1. Open the Plan Overrides panel, leave its timeout disabled, and confirm it
   shows the 30,000 ms Stagehand fallback. Open the Case Overrides panel and
   confirm an inheriting case shows the same effective value.
2. Enable a plan override, set it to `5000`, then enable a case override and
   change that to `1000`.
3. Set one step to `250`, edit the step through its action dialog, and confirm
   the step-level value remains.
4. Switch from Browser or Accessibility in Edit mode to View mode and confirm
   the selected tab remains open with read-only content.

## You are ready when

- You can explain step, case, plan, and built-in timeout precedence.
- You can distinguish a portable omitted setting from a displayed fallback.
- You can explain why View mode preserves the author's current tab while
  replacing form controls with summaries.

[← Previous: Accessibility configuration and rule tags](29-accessibility-configuration-baseline.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
