# Lesson 11: Fill-step authoring and field reuse

> “Reuse the parts that mean the same thing; name the parts that do not.” — Felicia “Form” Osei, Test Engineer

[← Previous: Type-step authoring](10-type-step-authoring.md) · [Course outline](../README.md) · [Next: Select-option authoring →](12-select-option-authoring.md)

A Fill step replaces the current value of a target field. The current editor
authors this shared-contract shape:

```json
{
  "action": "fill",
  "locator": {
    "role": "textbox",
    "name": "Email"
  },
  "value": "author@example.com"
}
```

This looks similar to Type, but its meaning is different: Type enters text in
sequence, while Fill supplies the field’s value. Its Value can be a literal or
a Plan-variable reference. The **Use variable?** switch opens the same
locale-aware card chooser used by Type. Apply saves a whole-field reference
such as `{ "var": "email" }`, rather than embedding the resolved value.
Data-set authoring remains later M12 work.

## Shared locator fields

Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value all need the same current target: required Role plus
optional Accessible name. The dedicated Step pages own those inputs, their
localized Role feedback, and role focus after the dialog opens. Each dialog
still owns its action-specific fields and independent validation: none for
Click, Text for Type, Value for Fill, a Value-or-Label choice for Select option,
Expected text for Assert text, Expected HTML for Assert HTML, and Expected value
for Assert value.

This is a practical rule for component design: share a thing only when it has
the same meaning, behaviour, and future direction everywhere it appears.

## Data and recovery

Fill steps retain their nested locator and Value in the same plain recovery
snapshot as the other authored steps. Focused tests protect both the detached
draft copy and the IndexedDB autosave record. That matters because a recovery
save must not keep Vue’s live reactive objects.

## Try it

Add a Fill step for a textbox named `Email` with Value
`author@example.com`. Blur the empty Role and Value fields one at a time and
compare their messages. Save, select a Plan variable on the Fill page, and
apply it. Inspect the Case card's locale-aware preview, then clone the card,
refresh, and restore the recovery copy. Finally, open Click and Type to confirm
their shared locator fields still focus and validate correctly.

## You are ready when

- You can explain the authoring difference between Type and Fill.
- You can identify the common locator fields and the action-specific fields on
  each dedicated Step page.
- You can distinguish a literal Fill value from a Plan-variable reference and
  explain when Apply changes the draft.

[← Previous: Type-step authoring](10-type-step-authoring.md) · [Course outline](../README.md) · [Next: Select-option authoring →](12-select-option-authoring.md)
