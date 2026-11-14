# Lesson 29: Accessibility configuration baseline

[← Previous: Browser configuration and step-card ownership](28-browser-configuration-and-step-card-ownership.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

The shared plan and case contracts already describe accessibility settings.
This M11 slice introduces the smallest useful editor form without pretending
that rule-tag selection is a solved interaction.

## Defaults and overrides

Plan Accessibility controls whether scans are enabled and whether detected
violations fail the run. A case inherits both values until its Accessibility
override is enabled. Enabling copies the effective plan values; clearing the
override removes only `settings.accessibility`, preserving unrelated settings
such as the browser override.

This mirrors browser configuration but keeps the two settings independent:
enabling scans is not the same decision as treating findings as failures.

## Deliberate deferral

The contract also supports an optional axe rule-tag list. It is not exposed by
this first editor form. A safe authoring experience needs a maintained tag
catalogue, clear replacement versus inheritance semantics, keyboard support,
and a searchable multi-selection design. The absence of that UI must not be
misrepresented as the contract rejecting tags.

## Try it

1. Enable scanning and failing violations at plan scope.
2. Enable a case override and confirm it copies both values.
3. Change one case setting, clear the override, and confirm inherited wording
   returns without disturbing Browser settings.

## You are ready when

- You can distinguish scan enablement from violation outcome policy.
- You can explain why a case override is copied, then removable.
- You know why axe rule tags remain a separate authoring slice.

[← Previous: Browser configuration and step-card ownership](28-browser-configuration-and-step-card-ownership.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
