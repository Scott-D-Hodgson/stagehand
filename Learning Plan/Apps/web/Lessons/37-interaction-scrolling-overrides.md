# Lesson 37: Interaction scrolling overrides

[Previous: Assertion behaviour](36-assertion-behaviour.md) · [Course outline](../README.md) · [Skill check](../quiz.md)

## Goal

Understand how supported interaction steps preserve their default scrolling
behaviour without unnecessarily serializing it into a Stagehand case document.

## Contract default

The version 1 interaction-step schema defines `scrollIntoView` as a Boolean
with an enabled default. Click, Type, Fill, and Select option execution passes
the setting to the browser interaction implementation. An omitted property is
therefore equivalent to enabled scrolling.

The editor follows that contract shape deliberately. Its Overrides checkbox is
checked for an omitted value and its draft helper removes the property when an
author enables it. Clearing the checkbox writes only `scrollIntoView: false`.
This keeps ordinary documents compact while preserving an intentional request
not to scroll a target automatically.

## Editor presentation

The four supported interaction Step pages reuse one scrolling-option component
in their Overrides panel. View mode describes the effective Enabled or
Disabled value as ordinary read-only information rather than displaying a
disabled checkbox. The helper refuses to alter unrelated actions, so Navigate
and assertion steps cannot accidentally acquire an interaction-only setting.

## Try it

1. Open a Click, Type, Fill, or Select option Step and select Overrides.
2. Confirm that **Scroll element into view** is selected when the step has no
   explicit property.
3. Clear it, navigate away and return, then confirm the option remains clear.
4. Re-select it and confirm an export omits `scrollIntoView`.
5. Switch to View mode and confirm that the effective scrolling setting is
   summarized in plain text.

## Check your understanding

1. Why is an enabled scrolling setting omitted from portable data?
2. What data is stored when the author disables scrolling?
3. Why does the draft helper leave non-interaction actions unchanged?

[Previous: Assertion behaviour](36-assertion-behaviour.md) · [Course outline](../README.md) · [Skill check](../quiz.md)
