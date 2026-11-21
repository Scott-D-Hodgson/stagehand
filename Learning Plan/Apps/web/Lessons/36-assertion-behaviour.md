# Lesson 36: Assertion behaviour

[Previous: Step-wait authoring and wait routes](35-interaction-wait-authoring.md) · [Course outline](../README.md) · [Skill check](../quiz.md)

## Goal

Understand how an assertion can stop a case immediately or record its failure
while allowing subsequent steps to run.

## Contract-default hard assertions

Assert text, Assert HTML, and Assert value share the optional version 1
`soft` property. When it is omitted, the assertion is hard: a failure stops
the case. The editor represents this ordinary default by omitting the property
from portable data rather than serializing `soft: false`.

Selecting Soft writes `soft: true`. A failed soft assertion is recorded while
the case continues to its later steps. This is useful when one run should
report more than one independent assertion failure.

## Editor presentation

Each assertion Step page exposes the shared Assertion behaviour control in
Overrides beside the optional timeout. Edit mode provides Hard and Soft radio
choices with concise outcome guidance. View mode uses a plain summary instead
of disabled controls. The same control keeps the three assertion pages aligned
while the draft helper makes the immutable update and removes `soft` when Hard
is selected.

## Try it

1. Open an Assert text, Assert HTML, or Assert value Step and select Overrides.
2. Confirm Hard is selected when the step has no `soft` property.
3. Select Soft, switch to View, and confirm the summary says Soft assertion.
4. Return to Edit, select Hard, and confirm an export omits `soft` rather than
   writing `soft: false`.
5. Repeat with each assertion action and confirm its locator and expected value
   remain unchanged.

## Check your understanding

1. Why does the editor omit `soft` for Hard rather than writing `soft: false`?
2. When is Soft assertion behaviour useful?
3. Why does View mode show a summary instead of disabled Hard/Soft radios?

[Previous: Step-wait authoring and wait routes](35-interaction-wait-authoring.md) · [Course outline](../README.md) · [Skill check](../quiz.md)
