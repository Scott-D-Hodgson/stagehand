# Lesson 4: Actions

> “What browser changes can runner-core perform, and what safety rules surround them?” — Arlo “Action Adventurer” Archer, Developer

[← Previous: waits](03-waits.md) · [Course outline](../README.md) · [Next: assertions →](05-assertions.md)


The current actions are `navigate`, `click`, `type`, `fill`, and `selectOption`. A Navigate step stores its `http://` or `https://` protocol separately from its address. Preparation resolves a text or environment-variable address and checks that the combined URL has a host; dispatch joins the protocol and address. Typing enters characters sequentially; filling sets a field directly. Option selection chooses exactly one value or visible label.

Interactions share their timeout between locator resolution and the browser operation. Scrolling is enabled by default. With `scrollIntoView: false`, an off-screen target fails instead of being moved automatically.

## Try it

Explain when you would use `type` rather than `fill`, then trace how a 5-second timeout is shared between finding a field and changing it.

## You are ready when

- You can distinguish the five action behaviours.
- You can explain shared timeout and scrolling rules.

[← Previous: waits](03-waits.md) · [Course outline](../README.md) · [Next: assertions →](05-assertions.md)
