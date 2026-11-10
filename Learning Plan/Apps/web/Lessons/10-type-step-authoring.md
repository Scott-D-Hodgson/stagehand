# Lesson 10: Type-step authoring

> “A good small form does one job clearly before it learns every clever trick.” — Theo “Textbox” Grant, Test Author

[← Previous: Click-step authoring](09-click-step-authoring.md) · [Course outline](../README.md) · [Next: Fill-step authoring →](11-fill-step-authoring.md)

A Type step tells the runner to enter text into a target. The current editor
authors this shared-contract shape:

```json
{
  "action": "type",
  "locator": {
    "role": "textbox",
    "name": "Email"
  },
  "text": "author@example.com"
}
```

The target uses the same current locator form as Click: required Role and
optional Accessible name. Type adds required literal Text. Role and Text have
separate blur-gated messages, so leaving Text empty does not produce a Role
message, and vice versa.

The shared contract allows the `text` value to be a variable reference as well
as a literal. The editor does not offer variable selection or editing yet; that
belongs to M12. This is deliberate scope, not a limitation of the contract.

## Reuse after repetition

Click, Type, and Fill now use a shared `LocatorFields.vue` component for their
Role/Accessible-name target fields. Each dialog keeps its action-specific field
and validation state: Text for Type and Value for Fill. This is a useful middle
ground: common target behaviour has one owner, without hiding the meaningful
differences between actions.

## Data and recovery

Like a Click step, a Type step includes a nested locator object. The editor
copies it into a plain value before IndexedDB autosave. Focused tests protect
both the detached draft copy and the autosaved Type representation, so edits to
a recovery snapshot cannot change the in-memory draft.

## Try it

Add a Type step for a textbox named `Email`, with literal text
`author@example.com`. Blur each empty required field separately and identify its
message. Save the valid step, clone it, change the cloned text, refresh the
page, and restore the local recovery copy.

## You are ready when

- You can identify the minimum valid Type-step fields in the current editor.
- You can explain why variable-backed text is deferred even though the contract
  supports it.
- You know why each required field needs its own validation state.

[← Previous: Click-step authoring](09-click-step-authoring.md) · [Course outline](../README.md) · [Next: Fill-step authoring →](11-fill-step-authoring.md)
