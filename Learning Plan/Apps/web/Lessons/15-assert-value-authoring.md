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

## A literal or variable default value

The dialog requires Role and Expected value, while Accessible name remains
optional. Each field’s feedback is independently blur-gated. The creation
dialog saves a literal `expected.default`; the Step page can replace it with a
Plan-variable reference. Apply saves the reference, and the Case card previews
its locale-aware value and identifies the variable. Literal assertion locale
overrides take precedence when they match. [Lesson 21](21-localized-assert-value.md)
covers the Step-page locale flow.

## The associated-label boundary

The editor also authors the optional always-soft associated-label check on its
own Step-page tab, with a separate default and literal locale overrides.
Variable references for this check remain future work.

## Shared target and recovery

Assert value uses the same constrained
Role/Accessible-name target as the other current forms. Its Expected value
field belongs in the assertion dialog. The nested locator and expected value
are copied into the plain recovery snapshot; focused checks cover detached
copying and IndexedDB autosave.

## Try it

Add an Assert value step for a textbox named `Email`, with Expected value
`author@example.com`. Blur the empty Role and Expected value fields separately,
then save and select a Plan variable on the Step page. Apply, check the Case
card, and add a matching literal locale override. Configure the associated-label
check, edit and clone the step, then refresh and restore the recovery copy.

## You are ready when

- You can distinguish a control’s expected value from its Accessible name.
- You know why this form saves `expected.default` and can add optional locale
  overrides outside the base dialog.
- You can distinguish the optional associated-label check from the expected
  value and identify its variable-reference support as remaining work.

[← Previous: Assert-HTML authoring](14-assert-html-authoring.md) · [Course outline](../README.md) · [Next: Localized Assert-value expectations →](21-localized-assert-value.md)
