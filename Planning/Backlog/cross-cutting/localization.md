# Localization requirements

## Distinct concepts

- **Plan-description language:** language used for test names, step descriptions, and other human-facing plan content.
- **Browser locale:** locale applied to the browser context, such as `en-CA` or `fr-CA`.
- **Browser timezone:** IANA timezone identifier applied to the browser context, such as `America/Toronto`.

These settings are independent.

## Requirements

- Stable test/step IDs are independent of translation.
- A plan can supply localized descriptions and a fallback language.
- The selected/resolved descriptions are preserved in reports.
- Browser locale and timezone are applied through Playwright context configuration.
- Missing translations follow documented fallback rules.
- Assertion expected values may be localized by culture. The selected expected value follows the browser/session culture and the same documented fallback rules, allowing one case to assert appropriate content across cultures.
