# Lesson 8: Case-reference authoring

> “A reference is not a case document. It is the plan’s deliberate pointer to one.” — Dana “Draft” Ellis, Developer

[← Previous: recovery gate](07-recovery-gate.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

M9 begins controlled plan authoring without inventing a new contract. A version
1 plan stores each case reference as a `path` in its `cases` array. The current
editor can add, edit, and remove that path while preserving all other draft
values immutably. It does not yet create the case JSON file, resolve a path from
the browser filesystem, or export a plan.

Existing paths are displayed read-only. Selecting Add or Edit opens the same
Bootstrap dialog. The Name field offers a filename-safe suggestion such as
`cases/landing-page.json`; the author can independently change the Reference
path before saving. This is a convenience for authoring, not a claim that the
referenced file exists.

Removing a reference and resetting a changed sample use a Bootstrap confirmation
dialog rather than a browser-native prompt. This makes the behaviour consistent
with the editor’s presentation and leaves room for clear localized wording. The
plan-draft helpers return new objects, allowing IndexedDB autosave and the
multi-tab conflict logic established in M8 to observe the complete changed
draft.

## Try it

Add a reference using a multi-word case name. Explain how its suggested path is
made filename-safe. Then edit its path, save it, and use Remove. Confirm that
the author must explicitly confirm removal and that Reset asks for confirmation
only after the draft differs from the bundled sample.

## You are ready when

- You can distinguish a case-reference path from a case document.
- You know why a filename suggestion must remain editable.
- You can explain why immutable updates matter to recovery and conflict handling.

[← Previous: recovery gate](07-recovery-gate.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
