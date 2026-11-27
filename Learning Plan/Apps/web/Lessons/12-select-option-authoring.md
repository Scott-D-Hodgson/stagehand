# Lesson 12: Select-option authoring

> “Let the interface make an invalid state difficult to express.” — Amara Singh, Quality Engineer

[← Previous: Fill-step authoring](11-fill-step-authoring.md) · [Course outline](../README.md) · [Next: Assert-text authoring →](13-assert-text-authoring.md)

A Select option step chooses an entry from a target control. The current editor
authors either a literal machine-readable Value:

```json
{
  "action": "selectOption",
  "locator": {
    "role": "combobox",
    "name": "Province"
  },
  "value": "ON"
}
```

Or it authors a literal visible Label instead:

```json
{
  "action": "selectOption",
  "locator": {
    "role": "combobox",
    "name": "Province"
  },
  "label": "Ontario"
}
```

## One selection form

The contract requires exactly one selection form. The dialog therefore offers
By value and By label modes rather than showing both fields together. Its
selected field is required, independently blur-gated, and the saved step
contains either `value` or `label`, never both. This is a useful authoring
pattern: when a contract has mutually exclusive alternatives, make that choice
explicit in the interface.

Either selection mode can use a literal or a Plan-variable reference. The
**Use variable?** switch presents the same locale-aware variable cards as Type
and Fill; Apply stores `{ "var": "name" }` in the chosen field. Data-set
authoring remains later M12 work.

## Shared target, separate selection

Select option uses the same constrained locator shape as Click, Type, Fill, Assert text, Assert HTML, and Assert value because
each action needs the same required Role and optional Accessible name target.
The selection mode and its required field remain owned by the Select option
dialog because they describe this action alone.

## Data and recovery

The selected mode and nested locator are copied into the same plain recovery
snapshot as other authored steps. Focused checks cover copying a Label-based
step without retaining live nested data and autosaving a Value-based step.

## Try it

Add a Select option step for a combobox named `Province`. First choose By value
and save `ON`; then confirm cloning the card, edit the clone, switch to By
label, and save `Ontario`.
Blur an empty selection field in each mode to compare the localized feedback.
Choose a Plan variable for each selection mode and apply each change. Refresh
and restore the recovery copy, then inspect the cards to confirm each one
presents the selection form it saved.

## You are ready when

- You can explain why a Select option step saves a Value or a Label, but not
  both.
- You can identify why locator fields are shared while the selection controls
  remain action-specific.
- You can distinguish a literal selection from a Plan-variable reference in
  either mode.

[← Previous: Fill-step authoring](11-fill-step-authoring.md) · [Course outline](../README.md) · [Next: Assert-text authoring →](13-assert-text-authoring.md)
