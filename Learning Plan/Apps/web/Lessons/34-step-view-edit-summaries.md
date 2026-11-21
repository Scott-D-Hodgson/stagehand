# Lesson 34: Step View/Edit summaries

[← Previous: Accessible icon controls](33-accessible-icon-controls.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

## Goal

Understand why a Step page uses different markup in View and Edit modes rather
than showing disabled form controls.

## One page, two presentations

Each dedicated Step route owns one action's fields and tabs. Edit mode presents
the relevant controls so an author can change the selected step. View mode
keeps the same selected tab but replaces those controls with a definition list
that summarizes the saved values. For example, a Navigate step shows its URL
as text, and a Click step shows its role and accessible name as labelled
details.

This makes View mode genuinely read-only. Disabled controls still look like a
form, can suggest an unavailable action, and make compact mobile pages harder
to scan. Plain details instead communicate that the page is being inspected.

## Tabs and localized assertions

The Default and Overrides tabs use summaries in View mode. Assert text, Assert
HTML, and Assert value retain their Locales tab, where the override list stays
visible but its Add, Edit, and Remove controls are absent. Switching View/Edit
does not reset the selected tab or change any portable plan or recovery data.

Click, Type, Fill, and Select option Steps also retain a Waits pill. It shows
read-only Before and After cards in either mode; authors use those cards to
open a dedicated Wait page rather than editing a wait inside the Step page.

## Try it

1. Open a Step page in Edit mode and select its Overrides tab.
2. Switch to View and confirm the Overrides tab remains selected and shows a
   labelled timeout summary rather than a disabled number input.
3. Return to Edit and confirm the editable timeout control is restored.
4. On an assertion Step, select Locales and confirm its list remains visible in
   View mode without locale-management controls.
5. On a supported Step, select Waits and confirm Before and After cards stay
   navigational summaries in both modes.

## Check your understanding

1. Why is a definition list more appropriate than disabled controls in View
   mode?
2. Which Step tabs remain visible in View mode, and which interaction controls
   must disappear?

[← Previous: Accessible icon controls](33-accessible-icon-controls.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
