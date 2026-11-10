# Lesson 13: Assert-text authoring

> “A clear expectation turns a check into a useful test.” — Mira Chen, Test Engineer

[← Previous: Select-option authoring](12-select-option-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

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

The current form writes one literal `expected.default` value. The contract can
also represent locale-specific expected values, but those belong to M11 with
the related browser and run configuration work. The dialog must not imply that
localized assertion behaviour is already authorable.

## Reuse and recovery

Assert text shares `LocatorFields.vue` with the existing actions because the
current authoring target is the same constrained Role/Accessible-name locator.
Expected text remains an Assert-text concern, so its input and feedback belong
to the assertion dialog.

The nested locator and `expected.default` are copied into the plain recovery
snapshot. Focused tests protect both detached draft copying and IndexedDB
autosave, preventing reactive state from crossing the storage boundary.

## Try it

Add an Assert text step for a heading named `Welcome`, with Expected text
`Welcome`. Blur each empty required field separately to observe its feedback.
Save the step, edit its expected text, clone it, then remove one card. Refresh
and restore the recovery copy to confirm the default expected value remains.

## You are ready when

- You can identify the difference between the target’s Accessible name and its
  expected visible text.
- You know why the form saves `expected.default` rather than a raw text field.
- You can explain why localized expected values remain M11 work.

[← Previous: Select-option authoring](12-select-option-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
