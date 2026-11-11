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
sequence, while Fill supplies the field’s value. The current form requires a
literal Value. The shared contract permits a variable reference too, but that
authoring capability belongs to M12 with variables and data sets.

## Shared locator fields

Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value all need the same current target: required Role plus
optional Accessible name. `LocatorFields.vue` owns those inputs, their
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
compare their messages. Save, clone the card and change its Value, then refresh
and restore the recovery copy. Finally, open Click and Type to confirm their
shared locator fields still focus and validate correctly.

## You are ready when

- You can explain the authoring difference between Type and Fill.
- You can identify which fields belong in `LocatorFields.vue` and which remain
  owned by an action dialog.
- You know why literal Value is current scope while variable references wait
  for M12.

[← Previous: Type-step authoring](10-type-step-authoring.md) · [Course outline](../README.md) · [Next: Select-option authoring →](12-select-option-authoring.md)
