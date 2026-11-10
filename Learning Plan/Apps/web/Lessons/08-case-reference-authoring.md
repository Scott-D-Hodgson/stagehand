# Lesson 8: Case-reference authoring

> “A reference is not a case document. It is the plan’s deliberate pointer to one.” — Dana “Draft” Ellis, Developer

[← Previous: recovery gate](07-recovery-gate.md) · [Course outline](../README.md) · [Next: Click-step authoring →](09-click-step-authoring.md)

M9 begins controlled plan authoring without inventing a new contract. A version
1 plan stores each case reference as a `path` in its `cases` array. The current
editor can add, edit, and remove that path while preserving all other draft
values immutably. Each reference now has an in-memory version 1 case document
with an independently editable ID and an empty `steps` array. It does not yet
create a case JSON file, resolve a path from the browser filesystem, or export
a plan.

New plan starts an empty bundle rather than changing the shared contract. The
author supplies a required Plan ID; the editor suggests a filename-safe value,
uses `en-CA` by default, and begins with no references or case documents. If
the active bundle has changes, a Bootstrap confirmation prevents accidental
replacement. The new bundle continues at the current local recovery revision,
so the first autosave replaces the prior recovery copy without a false
multiple-tab conflict.

The first editable step is Navigate. The case-details panel displays each step
as a numbered card with its action and URL. Add and Edit use the same dialog,
which describes the absolute HTTP/HTTPS URL rule. Validation becomes visible
after URL-field blur; an invalid value cannot be saved into the case. A valid
step remains part of the recovered bundle after refresh and restore.

Existing paths are displayed read-only. Selecting Add or Edit opens the same
Bootstrap dialog. The Name field offers a filename-safe suggestion such as
`cases/landing-page.json`; the author can independently change the Reference
path before saving. This is a convenience for authoring, not a claim that the
referenced file exists.

Removing a reference and resetting a changed sample use a Bootstrap confirmation
dialog rather than a browser-native prompt. This makes the behaviour consistent
with the editor’s presentation and leaves room for clear localized wording. The
plan/case bundle helpers return new objects, allowing IndexedDB autosave and
the multi-tab conflict logic established in M8 to observe the complete changed
draft. Earlier recovery records contained only the plan. On load, Stagehand
retains each legacy reference and creates an empty case document with a
filename-derived ID.

## Try it

Add a reference using a multi-word case name. Explain how its suggested path is
made filename-safe. Then select the reference, change its case ID, refresh,
and restore the local recovery copy. Confirm that the author must explicitly
confirm removal and that Reset asks for confirmation only after the draft
differs from the bundled sample.

Add a Navigate step with an invalid URL, blur the field, and explain the
feedback. Replace it with a valid URL, save it, then refresh and restore the
local recovery copy.

## You are ready when

- You can distinguish a case-reference path from a case document.
- You know why a filename suggestion must remain editable.
- You can explain why immutable updates matter to recovery and conflict handling.

[← Previous: recovery gate](07-recovery-gate.md) · [Course outline](../README.md) · [Next: Click-step authoring →](09-click-step-authoring.md)
