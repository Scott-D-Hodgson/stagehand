# Lesson 17: Case-reference workspaces

> “Keep the case and the work it contains together.” — Dana “Draft” Ellis, Developer

[← Previous: Step reordering](16-step-reordering.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

Each case reference is a Bootstrap card that also serves as its case workspace.
The card header is an accessible button: it reports whether the workspace is
expanded and identifies the panel it controls. Clicking the same open header
collapses it; opening another reference closes the previous workspace.

## Context without clutter

A collapsed card retains its reference path and a localized 0/1/many step
count. An expanded card reveals the Case ID field, validation feedback,
numbered step cards, and all available step-authoring actions. Keeping the
case content inside its reference card avoids separating a case from the path
that identifies it in the plan.

## Independent header actions

Move, Edit, and Remove remain independent buttons in the card header. Their
clicks do not toggle the workspace. Reference movement returns a new plan draft
and uses stable path keys so Vue can animate the cards moving into their new
positions without changing the selected case data.

## Theme-aware active state

The expanded card uses Bootstrap's theme-aware body-secondary background and
an emphasis-colour border. These tokens adapt to the selected light or dark
theme, unlike fixed `bg-light` or `border-dark` utilities. Visible `ID` and
`BCP` abbreviations use `abbr` elements with localized expansions.

When a case has an invalid authored step, its card instead receives the
theme-independent danger border. This remains visible while the workspace is
collapsed, directing the author to the case that needs attention.

## Try it

Create two references. Expand one, add a step, then expand the other and
confirm the first collapses with its step count. Use Move, Edit, and Remove
without changing the expanded state unintentionally. Switch between light and
dark themes, refresh, and restore the local recovery copy.

## You are ready when

- You can explain why a collapsed case card still needs its step count.
- You know why header actions must not toggle the workspace.
- You can choose theme-aware Bootstrap tokens instead of fixed light/dark
  utilities for an active state.

[← Previous: Step reordering](16-step-reordering.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
