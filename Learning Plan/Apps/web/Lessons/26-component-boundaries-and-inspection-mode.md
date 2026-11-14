# Lesson 26: Component boundaries and inspection mode

[← Previous: Valid-only bundle export](25-valid-only-bundle-export.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

As the editor gained plans, case references, several step types, and modal
forms, one component could no longer describe the screen clearly. The current
layout keeps each concern near the data it presents without changing who owns
the active editor draft.

## Follow the document hierarchy

`App.vue` still owns application-level preferences and the active plan/case
draft. `Plans/PlanBundle.vue` coordinates the editor workspace. Its plan
details live in `Plans/`; reference and case details live in `Cases/`; and the
individual step displays and their orchestration live in `Steps/`. Modal forms
remain in `components/dialogs/` because they are temporary interactions rather
than part of a rendered plan, case, or step card.

This arrangement makes a step card easier to read: its numbered action and
details remain in the card body, while authoring actions belong in the header
and action-specific panels belong in the footer. A component boundary does not
move validation, recovery, or document ownership into the child component.

## Inspect without authoring controls

The sticky plan toolbar has a temporary Edit/View switch. Edit mode shows the
plan, case-reference, and step card headers and footers, including their
authoring controls. View mode hides those card sections, presents Plan Locale
and Case ID as values, and keeps case-reference expansion available for
inspection.

The switch is not Stagehand document data and is not a recovery preference. It
starts in Edit each time the interface loads. That keeps a portable plan focused
on executable contract data, while recovery remains focused on author work that
must survive a close or refresh.

## Try it

1. Open a plan with at least one expanded case and several step cards.
2. Switch to View and confirm that headers, footers, and authoring controls are
   absent while step details remain visible.
3. Expand or collapse a case reference in View, then return to Edit and confirm
   that the controls return without changing plan data.

## You are ready when

- You can identify where plan, case, step, and dialog components belong.
- You can explain why child components present or emit draft changes rather
  than becoming a second owner of the active bundle.
- You can distinguish temporary interface presentation from portable contract
  data and recoverable author work.

[← Previous: Valid-only bundle export](25-valid-only-bundle-export.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
