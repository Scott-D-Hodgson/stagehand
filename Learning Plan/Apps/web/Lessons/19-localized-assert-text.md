# Lesson 19: Localized Assert-text expectations

[← Previous: Selected-step validation](18-selected-step-validation.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

An Assert text step always has a required literal `expected.default`. The early
M11 slice adds optional `expected.locales` values without moving that primary
authoring field into a large dialog.

## A maintained locale catalogue

Plan Locale and each Assert-text override use the same reviewed JSON catalogue
of 66 canonical locale tags. This is the editor's maintained supported set, not
an exhaustive list of every BCP 47 tag. The interface language remains a
separate local preference. Changing the editor from English to French never
changes a plan's execution locale or its expected values.

## Card-level override authoring

The Assert-text card's Locale overrides toggle reveals an alphabetically sorted
list. Add and Edit open a small Bootstrap dialog for one Locale and Expected
text value. The dialog validates required fields on blur and Save; removal uses
a confirmation dialog. Base-step editing and cloning preserve overrides, and
the ordinary draft/recovery path deep-copies their locale map.

## Configured-value preview

The card previews the value that the configured Plan Locale would select. If no
override matches, the default expected text uses the primary colour. If an
override matches, the default becomes muted and the matching override uses the
primary colour. Other override values remain muted. Matching values are grouped
in the summary, and their locale codes appear on hover.

## Try it

Set Plan Locale to `fr-CA`. Add an Assert text step with default `Welcome` and
an `fr-CA` override of `Bienvenue`. Confirm the override is emphasized. Switch
Plan Locale to `en-CA` and confirm the default is emphasized. Refresh after a
local save, restore the draft, and confirm the override remains.

## You are ready when

- You can distinguish interface language, Plan Locale, and expected-value
  locale overrides.
- You know why the editor keeps a maintained locale set instead of claiming to
  enumerate all possible BCP 47 tags.
- You can explain the card's configured-value colour preview.

[← Previous: Selected-step validation](18-selected-step-validation.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
