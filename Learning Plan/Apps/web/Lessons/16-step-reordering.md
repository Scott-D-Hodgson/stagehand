# Lesson 16: Step reordering

> “The order is part of the test, so make a change in order easy to see.” — Darius Bell, Test Engineer

[← Previous: Assert-value authoring](15-assert-value-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

Case steps execute in their displayed order. The M9 editor therefore gives each
step card adjacent Move up and Move down controls. The first card cannot move
up, and the last card cannot move down.

## A pure list update

The editor's `moveCaseStep` helper returns a new list with one item at a new
valid position. It does not mutate the list it receives. That keeps the draft
update compatible with the existing recovery snapshot and conflict comparison
paths, rather than adding a separate persistence route for reordering.

## Animating the exchange

The cards live in a Vue `TransitionGroup`. Their keys identify the individual
step objects rather than their current indexes. When a step moves, Vue can then
recognize the two existing cards and animate them into their new positions.
An index key would instead describe a position, which is unsuitable for showing
the cards exchanging places.

## Try it

Create three distinct steps. Move the middle step up, then down. Confirm that
both affected cards move smoothly, their displayed numbers update, and the
boundary buttons remain disabled. Refresh and restore the local recovery copy
to confirm that the new order remains part of the saved draft.

## You are ready when

- You can explain why step order is contract data, not merely presentation.
- You know why the reordering helper returns a new list.
- You can distinguish a stable card key from a current list index.

[← Previous: Assert-value authoring](15-assert-value-authoring.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
