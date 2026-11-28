# Lesson 21: Localized Assert-value expectations

[← Previous: Localized Assert-HTML expectations](20-localized-assert-html.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

Assert value completes the editor's first localized assertion trio. Its required
`expected.default` can be a literal or Plan-variable reference, and optional
literal `expected.locales` entries provide alternate values for configured
Plan Locales.

## The shared override pattern

The Step-page Locales tab uses the same maintained JSON catalogue,
Add/Edit dialog, confirmed removal, and recovery behaviour
as Assert text and Assert HTML. It is separate from the base-step dialog, so
the normal assertion form remains focused on its Role, Accessible name, and
default Expected value.

## Configured-value preview

The card emphasizes the exact expected value selected by the Plan Locale. A
matching override is primary-coloured and followed by a locale pill; otherwise
the default is emphasized. The invisible default-state pill reserves the same
space, so selecting a different Plan Locale does not shift the cards below. A
variable supplying the active default is identified by name.

## The associated-label check

The optional always-soft `associatedLabel` check has its own Step-page tab,
default value, and literal locale overrides. Variable references in the label
expectation and individual locale overrides remain future work.

## Try it

Set Plan Locale to `fr-CA`. Add an Assert value step for a textbox named
`Email` with default `author@example.com`, then add an `fr-CA` override of
`auteur@example.com`. Confirm that the French value and locale pill are
emphasized. Edit and clone the step, then refresh and restore the recovery copy
to confirm the override remains.

## You are ready when

- You can explain why all three current assertion types use the same localized
  expected-value pattern.
- You can identify the effective value selected by Plan Locale.
- You can distinguish the associated-label form from the expected-value form
  and identify which variable-reference controls remain to be added.

[← Previous: Localized Assert-HTML expectations](20-localized-assert-html.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
