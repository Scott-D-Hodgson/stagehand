# Lesson 38: Applied forms and navigation gates

[Previous: Interaction scrolling overrides](37-interaction-scrolling-overrides.md) · [Course outline](../README.md) · [Skill check](../quiz.md)

## Goal

Understand why editable Plan, Case, Step, and Wait settings stay local to a
small form until an author explicitly applies valid changes.

## Local form boundary

An author can edit fields and receive validation feedback without changing the
underlying editor draft. Each authoring panel keeps its own local form value,
marks fields for feedback on blur, and disables **Apply** until required data
is valid. Applying transfers the complete valid form to the draft as one
immutable update. This avoids autosaving accidental partial values while an
author is still typing.

The approach also distinguishes an omitted configuration property from an
invalid or incomplete field. For example, a Step timeout can inherit its Case
timeout, while a selected timeout override must contain a valid positive
number before it can be applied.

## Navigation protection and feedback

When a valid local form differs from its persisted draft, navigation away from
that context opens a blocking confirmation. The author can remain and apply
the work, or explicitly discard the local edits and continue. This protection
applies to both Step and dedicated Wait routes.

After a successful Apply, a Bootstrap toast briefly confirms the result. The
toast belongs to the application shell rather than an individual route, so it
can remain visible if an applied action changes route context. Wait Apply keeps
the author on the Wait page; **Return** remains an explicit navigation action.

## Try it

1. Change a valid field on a Step page without selecting **Apply**.
2. Follow a breadcrumb or Return action and confirm the discard dialog opens.
3. Cancel the dialog, apply the change, and confirm the success toast appears.
4. Open a Wait page, make a valid edit, select **Apply**, and confirm the
   toast appears while the Wait page remains open.
5. Make another unapplied Wait edit, use **Return**, and confirm that either
   cancelling preserves the local form or confirming discards it.

## Check your understanding

1. Why should a field event not immediately update the recovered editor draft?
2. What must happen before a valid dirty form may lose its route context?
3. Why is the applied-changes toast mounted at the application shell?

[Previous: Interaction scrolling overrides](37-interaction-scrolling-overrides.md) · [Course outline](../README.md) · [Skill check](../quiz.md)
