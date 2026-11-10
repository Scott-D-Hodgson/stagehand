# Lesson 9: Click-step authoring and modal lifecycle

> “A form should explain the choice it offers, not recite every choice it does not.” — Mira “Modal” Chen, Interface Developer

[← Previous: case-reference authoring](08-case-reference-authoring.md) · [Course outline](../README.md) · [Next: Type-step authoring →](10-type-step-authoring.md)

The editor’s current Click form creates the shared-contract shape for a Click
step:

```json
{
  "action": "click",
  "locator": {
    "role": "button",
    "name": "Continue"
  }
}
```

The Role is required; Accessible name is optional. The shared locator contract
also permits other locator forms, such as `css` and `xpath`, but this M9 form
does not offer those choices yet. A good form should validate the fields it
actually gives an author. For an empty Role, the dialog therefore says one
localized thing: enter a role. It does not expose the schema engine’s rejected
alternatives for unrelated locator forms.

## Data and recovery

Click steps include a nested `locator` object. Vue makes editor state reactive,
but IndexedDB needs ordinary cloneable data. The editor copies nested step data
into a plain snapshot before autosave. This keeps recovery and multi-tab
comparison working while the user edits a nested locator.

The step chooser leads to a Navigate, Click, or Type dialog. Existing steps can be
edited, cloned into a new step, or removed after confirmation. These are small
forms today, but their values remain part of the same recoverable case-document
draft as every other M9 change.

## Bootstrap modal lifecycle

Bootstrap owns the visual modal lifecycle while Vue owns the state. The dialog
waits for Bootstrap’s `shown.bs.modal` event before focusing the first useful
control. It waits for `hidden.bs.modal` before Vue removes the component. That
order matters: removing a modal too early can leave Bootstrap’s backdrop or
page-scroll lock behind.

The dialogs use a static backdrop. Clicking outside does not dismiss one,
avoiding accidental loss or close-induced field validation. Authors can still
use the visible × and Cancel controls, and Bootstrap’s normal Escape handling.

## Try it

Add a Click step with Role `button` and Accessible name `Continue`. Clone it,
change the name, and remove the original after confirmation. Then open a new
Click dialog, leave Role empty, blur it, and observe the one focused message.
Finally, cancel it with the × and with Cancel, then click the backdrop and
confirm that the dialog remains open.

## You are ready when

- You can explain why the current form supports a Role/Accessible-name locator
  without claiming that all locator forms are editable.
- You know why nested reactive data needs a plain copy at the IndexedDB edge.
- You can describe why a modal’s `shown` and `hidden` events matter to focus
  and page scrolling.

[← Previous: case-reference authoring](08-case-reference-authoring.md) · [Course outline](../README.md) · [Next: Type-step authoring →](10-type-step-authoring.md)
