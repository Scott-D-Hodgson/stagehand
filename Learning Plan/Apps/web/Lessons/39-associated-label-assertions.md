# Lesson 39: Associated-label assertions

[Previous: Applied forms and navigation gates](38-applied-forms-and-navigation-gates.md) · [Course outline](../README.md) · [Skill check](../quiz.md)

## Goal

Understand how an Assert Value Step optionally checks its associated label
without changing the assertion's primary value check.

## Always-soft optional check

The associated-label check is opt-in. When enabled, it has a required default
expected label and may have localized overrides. It is always soft: a missing,
ambiguous, mismatched, or timed-out label is recorded without turning the
primary Assert Value result into a hard failure.

The editor keeps the label expectation separate from the primary expected value
and its locale list. Changing an existing locale in either list replaces the
original locale key, rather than adding a duplicate override. Disabling and
applying removes `associatedLabel` from the portable Step data.

## Try it

1. Open an Assert Value Step and select **Associated label**.
2. Enable the check, enter a default expected label, and select **Apply**.
3. Add a localized label override, then edit it to a different locale.
4. Confirm only the replacement locale remains, then disable the check and
   apply the change.

## Check your understanding

1. Why is the label expectation separate from the primary expected value?
2. Why does disabling the option remove rather than empty the property?
3. Why does a label failure remain soft?

[Previous: Applied forms and navigation gates](38-applied-forms-and-navigation-gates.md) · [Course outline](../README.md) · [Skill check](../quiz.md)
