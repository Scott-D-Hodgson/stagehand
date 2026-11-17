# Lesson 28: Browser configuration and step-card ownership

[← Previous: M10 round-trip integration review](27-m10-round-trip-integration-review.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

M11 begins with the browser settings already supported by the shared contracts.
The editor authors only the supported fields and keeps their inheritance clear.

## Plan defaults and case overrides

Plan Browser settings author Chromium headless mode, viewport dimensions, and
an IANA time zone. A case may override only its viewport and time zone because
headless mode is selected when the run-wide browser process starts. Enabling a
case override copies the effective plan values, giving the author a safe
starting point. Disabling it removes only `settings.browser`, preserving any
other case settings for later M11 work.

The editor preserves raw invalid values long enough for shared validation to
explain the issue. It does not silently repair a time zone or viewport value.

## Keep card ownership local

`StepReferences` coordinates the ordered case-step array, dialogs, and emitted
draft changes. It does not define every card. Dedicated Step-page components
own their action-specific route details and tabs. Localized assertion Step
pages additionally own their Default, Overrides, and Locales tabs.

This separation means a change to a step card's presentation stays with that
step type, while list movement, recovery, and document updates retain one
coordinator.

## Edit and inspect deliberately

The active case in Edit mode shows its settings tabs and step controls. Other
cases use the same reduced read-only step display as View mode. View mode shows
each Case ID and its step bodies; it hides card tabs, headers, and footers, and
localized assertions show their Default value. Neither mode is plan data or a
recovery preference.

## Try it

1. Change a plan viewport and time zone, then enable a case override and
   confirm it starts with the plan values.
2. Remove the override and confirm the case reports inherited settings.
3. Switch among two cases in Edit mode, then switch to View mode; compare the
   active editing presentation with the reduced inspection presentation.
4. Open a localized assertion's Locale overrides tab in Edit mode, then switch
   to View and confirm its Default content remains visible.

## You are ready when

- You can explain why headless mode is plan-level while viewport and time zone
  may be overridden by a case.
- You can locate step-card presentation separately from ordered-step updates.
- You can distinguish Edit/View presentation state from persisted plan data.

[← Previous: M10 round-trip integration review](27-m10-round-trip-integration-review.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
