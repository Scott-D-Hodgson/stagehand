# Lesson 13: Assert-text authoring

> “A clear expectation turns a check into a useful test.” — Mira Chen, Test Engineer

[← Previous: Select-option authoring](12-select-option-authoring.md) · [Course outline](../README.md) · [Next: Assert-HTML authoring →](14-assert-html-authoring.md)

An Assert text step compares a target’s visible text with an expected value.
The current editor authors this shared-contract shape:

```json
{
  "action": "assertText",
  "locator": {
    "role": "heading",
    "name": "Welcome"
  },
  "expected": {
    "default": "Welcome"
  }
}
```

## A deliberate expectation boundary

The dialog requires Role and Expected text, while Accessible name remains
optional. Each required field shows its localized feedback only after its own
blur or an attempted save. This keeps the first view calm while still making
an incomplete assertion clear before it reaches the case draft.

The creation dialog writes a literal `expected.default` value. On the Step
page, **Use variable?** switches the default expectation between a literal and
a Plan-variable reference such as `{ "var": "welcome" }`. Select a variable
card and choose Apply to save it. The reference names the variable; it does not
copy the variable's value into the assertion.

The Locales tab supports literal expectation overrides. A matching assertion
override takes precedence over the default, including a default variable. When
the variable supplies the active value, the Case card shows its locale-aware
value and variable name. Individual assertion locale overrides cannot yet be
authored as variable references.

## Reuse and recovery

Assert text uses the same constrained locator shape as the existing actions because the
current authoring target is the same constrained Role/Accessible-name locator.
Expected text remains an Assert-text concern, so its input and feedback belong
to the assertion dialog.

The nested locator and `expected.default` are copied into the plain recovery
snapshot. Focused tests protect both detached draft copying and IndexedDB
autosave, preventing reactive state from crossing the storage boundary.

## Try it

Add an Assert text step for a heading named `Welcome`, with Expected text
`Welcome`. Blur each empty required field separately to observe its feedback.
Save the step, select a Plan variable on its Step page, and apply it. Change
the Plan locale and inspect the Case card. Add a literal assertion override
for that locale and confirm it takes precedence. Edit the step, clone it, then
refresh and restore to check that the default reference remains.

## You are ready when

- You can identify the difference between the target’s Accessible name and its
  expected visible text.
- You know why the form saves `expected.default` rather than a raw text field.
- You can distinguish a literal default, a default variable reference, and the
  locale-override workflow described in Lesson 19.

[← Previous: Select-option authoring](12-select-option-authoring.md) · [Course outline](../README.md) · [Next: Assert-HTML authoring →](14-assert-html-authoring.md)
