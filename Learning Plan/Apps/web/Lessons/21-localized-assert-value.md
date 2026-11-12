# Lesson 21: Localized Assert-value expectations

[← Previous: Localized Assert-HTML expectations](20-localized-assert-html.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

Assert value completes the editor's first localized assertion trio. Its required
literal `expected.default` remains the base value, and optional
`expected.locales` entries provide alternate values for configured Plan
Locales.

## The shared override pattern

The card-level Locale overrides panel uses the same maintained JSON catalogue,
alphabetical list, Add/Edit dialog, confirmed removal, and recovery behaviour
as Assert text and Assert HTML. It is separate from the base-step dialog, so
the normal assertion form remains focused on its Role, Accessible name, and
default Expected value.

## Configured-value preview

The card emphasizes the exact expected value selected by the Plan Locale. A
matching override is primary-coloured and followed by a locale pill; otherwise
the default is emphasized. The invisible default-state pill reserves the same
space, so selecting a different Plan Locale does not shift the cards below.

## The associated-label boundary remains

The optional `associatedLabel` assertion contract remains unedited by the UI.
It is a distinct optional check with its own expected-value shape, so this
locale-override work does not decide its authoring or inheritance behaviour.

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
- You can distinguish completed expected-value overrides from the still-deferred
  associated-label form.

[← Previous: Localized Assert-HTML expectations](20-localized-assert-html.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
