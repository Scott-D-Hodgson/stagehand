# Lesson 18: Selected-step validation

[← Previous: Case-reference workspaces](17-case-reference-workspaces.md) · [Course outline](../README.md) · [Next: Localized Assert-text expectations →](19-localized-assert-text.md)

Shared validation is authoritative, but its raw messages are not always useful
editor copy. A schema `oneOf` can report several alternatives for one incomplete
step. The editor should identify the affected authored step without displaying
all of those internal branches to an author.

## Mapping a validation location

`getInvalidCaseStepIndexes` validates a complete case through the public shared
contract and reads issue paths shaped like `/steps/2/...`. It gathers the
indexes in a set, sorts them, and returns each affected step once. It does not
replace schema validation or decide whether a draft may be recovered; it only
maps a validation result to an editor presentation location.

## Presenting useful feedback

The expanded case shows a localized zero, one, or many summary. Each affected
step card has a danger border and one concise message explaining that the step
is incomplete. The enclosing case-reference card also has a danger border,
including when collapsed, so the author can find work needing attention before
opening the case. A valid case has none of those cues.

## Try it

Restore a local draft containing an incomplete step. Confirm the reference
card, case summary, and step card identify the problem. Correct or remove the
step and confirm each warning clears after the draft becomes valid.

## You are ready when

- You can distinguish shared contract validation from UI presentation mapping.
- You know why a set of step indexes avoids repeated messages for one step.
- You can explain why a collapsed case still needs a validation cue.

[← Previous: Case-reference workspaces](17-case-reference-workspaces.md) · [Course outline](../README.md) · [Next: Localized Assert-text expectations →](19-localized-assert-text.md)
