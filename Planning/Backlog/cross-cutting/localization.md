# Localization requirements

## Distinct concepts

- **Plan-description language:** language used for test names, step descriptions, and other human-facing plan content.
- **Browser locale:** locale applied to the browser context, such as `en-CA` or `fr-CA`.
- **Browser time zone:** IANA time zone identifier applied to the browser context, such as `America/Toronto`.

These settings are independent.

## Requirements

- Plan and case IDs remain stable across translations. Steps are identified by case ID and sequence position; results represent that position as a zero-based index, not an author-assigned step ID.
- A plan can supply localized descriptions. Missing translations require a fallback language, but its value remains to be specified.
- The selected/resolved descriptions are preserved in reports.
- Browser locale and time zone are applied through Playwright context configuration.
- Assertion expected values use a required `default` value and may include BCP 47 locale overrides. Locale keys are canonicalized before matching; equivalent duplicate keys are invalid. The matching override is used when available, otherwise the assertion's own `default` applies. This fallback is separate from the fallback language for descriptions.
