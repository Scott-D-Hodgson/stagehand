# Lesson 14: Assert-HTML authoring

> “Markup is part of the contract when the structure matters.” — Laila Morgan, Test Engineer

[← Previous: Assert-text authoring](13-assert-text-authoring.md) · [Course outline](../README.md) · [Next: Assert-value authoring →](15-assert-value-authoring.md)

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

On the Step page, **Use variable?** can replace the literal default with a
Plan-variable reference. The Case card previews the locale-aware value and
identifies the variable while that default is active. A matching literal
assertion locale override takes precedence. Individual locale overrides are
still authored as literals.

Role and Expected HTML are required and independently blur-gated; Accessible
name remains optional. The early M11 workflow adds optional localized expected
values; [Lesson 20](20-localized-assert-html.md) covers that dedicated Step-page flow.

## Shared target and recovery

The constrained Role/Accessible-name target is the same current target used by
the other authored actions and assertions. Its HTML-specific expected field
remains owned by the dedicated Step page. The nested locator and
`expected.default` are copied into the plain
recovery snapshot. Focused checks protect detached expected-HTML copying and
IndexedDB autosave.

## Try it

Add an Assert HTML step for a heading named `Welcome`, with Expected HTML
`<strong>Welcome</strong>`. Blur an empty Role and Expected HTML field
independently to compare their feedback. Save, select a Plan variable on the
Step page, and apply it. Check the Case card, add a literal locale override,
then edit and clone the step. Refresh and restore the recovery record.

## You are ready when

- You can distinguish Assert HTML’s inner-HTML comparison from Assert text’s
  visible-text comparison.
- You know why both forms save `expected.default` despite using different
  input controls.
- You can distinguish a literal HTML default from a Plan-variable reference
  and explain when a locale override takes precedence.
- You know that localized Assert-HTML expectations are covered by the early M11
  workflow in [Lesson 20](20-localized-assert-html.md).

[← Previous: Assert-text authoring](13-assert-text-authoring.md) · [Course outline](../README.md) · [Next: Assert-value authoring →](15-assert-value-authoring.md)
