# Lesson 14: Assert-HTML authoring

> “Markup is part of the contract when the structure matters.” — Laila Morgan, Test Engineer

[← Previous: Assert-text authoring](13-assert-text-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

An Assert HTML step compares a target’s inner HTML with an expected value. The
current editor authors this shared-contract shape:

```json
{
  "action": "assertHtml",
  "locator": {
    "role": "heading",
    "name": "Welcome"
  },
  "expected": {
    "default": "<strong>Welcome</strong>"
  }
}
```

## HTML is still an expected value

Assert HTML shares the same `expected.default` object shape as Assert text.
What differs is the runner’s comparison content: the assertion checks inner
HTML rather than visible text. The dialog therefore uses a multiline Expected
HTML field, which makes markup easier to enter and review without changing the
stored contract.

Role and Expected HTML are required and independently blur-gated; Accessible
name remains optional. Localized expected values remain M11 work. This form
authors one literal default expectation only.

## Shared target and recovery

The constrained Role/Accessible-name target is the same current target used by
the other authored actions and assertions, so Assert HTML reuses
`LocatorFields.vue`. Its HTML-specific expected field remains owned by the
dialog. The nested locator and `expected.default` are copied into the plain
recovery snapshot. Focused checks protect detached expected-HTML copying and
IndexedDB autosave.

## Try it

Add an Assert HTML step for a heading named `Welcome`, with Expected HTML
`<strong>Welcome</strong>`. Blur an empty Role and Expected HTML field
independently to compare their feedback. Save, edit the markup, clone the card,
remove one copy, then refresh and restore the recovery record.

## You are ready when

- You can distinguish Assert HTML’s inner-HTML comparison from Assert text’s
  visible-text comparison.
- You know why both forms save `expected.default` despite using different
  input controls.
- You can explain why localized expected values remain M11 work.

[← Previous: Assert-text authoring](13-assert-text-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
