# Lesson 22: M9 integration review

[← Previous: Localized Assert-value expectations](21-localized-assert-value.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

An integration review verifies that completed authoring slices work together.
It is not a substitute for focused unit tests; it exercises the transitions
between plan state, case state, dialogs, recovery, and browser-local
preferences that isolated tests cannot fully represent.

## One representative draft

Create a fresh plan, add independent case references and Case IDs, then author
each supported step type. Edit, clone, reorder, and remove selected items.
Check that the Plan Locale selects the effective localized expected values for
Assert text, Assert HTML, and Assert value without changing the interface
language.

## Protection checks

Refresh and restore the draft. Test Reset sample cancellation and confirmation.
In two tabs, create a stale-save conflict and verify both choices: discard
paused local edits to adopt the newer draft, or replace the newer saved draft
with the paused local edits. The conflict dialog is static and blocking because
continuing to edit while the conflict is hidden would be unsafe.

## Presentation checks

Use keyboard activation through an Add-step dialog, verify focus reaches the
first relevant control, and confirm closing a dialog does not leave the page
scroll-locked. Check Canadian English and French wording, theme preference,
locale fallback, and the fixed footer with long page content.

## You are ready when

- You can distinguish focused automated coverage from the integrated browser
  walkthrough.
- You can explain why recovery and conflict resolution are authoring safety
  features rather than export features.
- You record an integration finding, such as a hidden conflict warning, and
  verify its focused correction before closing the milestone.

[← Previous: Localized Assert-value expectations](21-localized-assert-value.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
