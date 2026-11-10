# Lesson 10: Type-step authoring

> “A good small form does one job clearly before it learns every clever trick.” — Theo “Textbox” Grant, Test Author

[← Previous: Click-step authoring](09-click-step-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

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

## Reuse without premature abstraction

Type and Click currently have separate dialogs even though they share locator
fields. Their behaviour is similar, but Type adds a second required field and
independent validation state. Keeping their components separate makes that
difference obvious while the interaction vocabulary is still growing. A later
review can extract a shared locator-fields component once Fill and other forms
show a stable common shape.

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

[← Previous: Click-step authoring](09-click-step-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
