# Lesson 29: Accessibility configuration and rule tags

[← Previous: Browser configuration and step-card ownership](28-browser-configuration-and-step-card-ownership.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

The shared plan and case contracts already describe accessibility settings.
This M11 slice introduces the supported editor form while keeping its catalogue
aligned with the shared contract.

## Defaults and overrides

Plan Accessibility controls whether scans are enabled and whether detected
violations fail the run. A case inherits both values until its Accessibility
override is enabled. Enabling copies the effective plan values; clearing the
override removes only `settings.accessibility`, preserving unrelated settings
such as the browser override.

This mirrors browser configuration but keeps the two settings independent:
enabling scans is not the same decision as treating findings as failures.

## Rule tags without a divergent catalogue

The optional axe rule-tag list is derived from the public shared schema rather
than copied into a browser-only list. The editor shows the alphabetized tags as
a wrapping checkbox list and provides an optional filter. Filtering narrows
visible choices without hiding the complete list by default.

At plan scope, no selected tags means axe defaults. A case override begins by
copying the plan tags. A non-empty case selection replaces those tags; an
explicit empty case list clears the inherited filter and also uses axe defaults.

## Try it

1. Enable scanning and failing violations at plan scope.
2. Enable a case override and confirm it copies both values.
3. Filter tags, select one or two, then clear the filter and confirm the
   selected tags remain checked.
4. Change one case tag, clear the override, and confirm inherited wording
   returns without disturbing Browser settings.

## You are ready when

- You can distinguish scan enablement from violation outcome policy.
- You can explain why a case override is copied, then removable.
- You can explain plan inheritance, case replacement, and explicit clearing of
  rule tags.

[← Previous: Browser configuration and step-card ownership](28-browser-configuration-and-step-card-ownership.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
