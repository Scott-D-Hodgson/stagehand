# Lesson 15: Assert-value authoring

> “Check the value the person depends on, not merely what happens to be visible.” — Darius Bell, Test Engineer

[← Previous: Assert-HTML authoring](14-assert-html-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

An Assert value step compares a control’s value with an expected value. The
current editor authors this shared-contract shape:

```json
{
  "action": "assertValue",
  "locator": {
    "role": "textbox",
    "name": "Email"
  },
  "expected": {
    "default": "author@example.com"
  }
}
```

## A literal default value

The dialog requires Role and Expected value, while Accessible name remains
optional. Each field’s feedback is independently blur-gated. The form saves a
literal `expected.default` value, like the other current assertion forms.
The early M11 workflow adds optional localized expected values; [Lesson
21](21-localized-assert-value.md) covers that card-level flow.

## The associated-label boundary

The shared contract supports an optional associated-label check for an Assert
value step. The current editor deliberately does not author it. That check has
its own expected value and conditional UI, so its placement and behaviour need
a focused decision rather than being folded into this basic assertion slice.

## Shared target and recovery

Assert value reuses `LocatorFields.vue` for the same constrained
Role/Accessible-name target as the other current forms. Its Expected value
field belongs in the assertion dialog. The nested locator and expected value
are copied into the plain recovery snapshot; focused checks cover detached
copying and IndexedDB autosave.

## Try it

Add an Assert value step for a textbox named `Email`, with Expected value
`author@example.com`. Blur the empty Role and Expected value fields separately,
then save, edit, clone, and remove the card. Refresh and restore the recovery
copy. Confirm that no associated-label controls are presented in this slice.

## You are ready when

- You can distinguish a control’s expected value from its Accessible name.
- You know why this form saves `expected.default` and can add optional locale
  overrides outside the base dialog.
- You can identify the optional associated-label check as deferred work rather
  than a missing saved field.

[← Previous: Assert-HTML authoring](14-assert-html-authoring.md) · [Course outline](../README.md) · [Next: Localized Assert-value expectations →](21-localized-assert-value.md)
