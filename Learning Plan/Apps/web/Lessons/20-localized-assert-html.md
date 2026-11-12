# Lesson 20: Localized Assert-HTML expectations

[← Previous: Localized Assert-text expectations](19-localized-assert-text.md) · [Course outline](../README.md) · [Next: Localized Assert-value expectations →](21-localized-assert-value.md)

Assert HTML uses the same early M11 locale-override model as Assert text while
keeping HTML practical to author. Its required `expected.default` remains the
base value, and optional `expected.locales` entries provide literal alternate
HTML values.

## Shared locale behaviour

Plan Locale and each override draw from the same maintained JSON catalogue of
66 canonical locale tags. Interface language remains independent: changing the
editor language never changes the configured execution locale or an expected
HTML value.

## Multiline HTML values

The Assert HTML card's Locale overrides panel is intentionally separate from
the base-step dialog. Its alphabetically sorted list supports Add, Edit, and
confirmed removal. Both the base expected value and an override value use a
multiline field, because HTML commonly contains markup across several lines.
Required Locale and Expected HTML feedback appears after blur or Save.

## Configured-value preview

Each card emphasizes the exact value selected by the Plan Locale. When a
matching override exists, that HTML value is primary-coloured and identified by
a locale pill; otherwise the default is emphasized. The default-state pill
keeps its space while invisible, so changing the configured locale does not
shift the cards below it. In the expanded list, the matching override has a
primary border.

## Try it

Set Plan Locale to `fr-CA`. Add an Assert HTML step whose default is
`<strong>Welcome</strong>`, then add an `fr-CA` override of
`<strong>Bienvenue</strong>`. Confirm the French value and locale pill are
emphasized. Switch the Plan Locale to `en-CA`, confirm the default is
emphasized without shifting the page, then refresh and restore the local draft.

## You are ready when

- You can explain why Assert HTML uses multiline base and override inputs.
- You can distinguish the Plan Locale preview from the editor's interface
  language.
- You know that the editor preserves literal HTML values; it does not parse or
  sanitize them while authoring.

[← Previous: Localized Assert-text expectations](19-localized-assert-text.md) · [Course outline](../README.md) · [Next: Localized Assert-value expectations →](21-localized-assert-value.md)
