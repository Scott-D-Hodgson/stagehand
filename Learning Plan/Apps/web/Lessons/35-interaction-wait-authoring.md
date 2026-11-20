# Lesson 35: Interaction-wait authoring and wait routes

[Previous: Step View/Edit summaries](34-step-view-edit-summaries.md) · [Course outline](../README.md) · [Skill check](../quiz.md)

## Goal

Understand how the editor authors ordered interaction waits without returning
to nested editable cards on a small screen.

## Before and After lists

Click, Type, Fill, and Select option steps can have ordered waits before an
interaction, after it, or both. Their Step page has a Waits pill beside Default
and Overrides. It presents separate Before and After lists as read-only cards.
The parent Step page owns the list order and its Promote, Demote, Edit, Clone,
and Remove actions.

Remove does not change a list immediately. It opens the same static Bootstrap
confirmation pattern used for Step removal: **Please Confirm** asks “Remove
this wait?” before the editor deletes the selected item. Cancel leaves the
Before or After list unchanged.

Add first opens a type chooser. Authors select one of the currently supported
waits:

- Locator waits for a locator condition.
- Page state waits for the selected page state.
- Delay waits for a fixed number of milliseconds.

The selected type then opens a validated details dialog. Locator waits require
a Role; Delay waits require a bounded delay; Locator and Page-state waits may
set an independent timeout. Cancel leaves the list unchanged, and only Save
adds the new card. Selecting an existing wait card opens its dedicated Wait
page. This keeps the editable details at one route level and keeps the Step
page compact.

## Wait-route context

A Wait route is nested below the selected Step route. Its breadcrumb adds a
non-link Before or After item between the Step and the indexed wait, so the
author knows where the wait executes. The Wait page owns the field editor and
offers Return to go back to its Step. The Step and Case pages similarly provide
Return actions to their immediate parent pages.

## Timeout boundary

Locator and Page-state waits may set an independent timeout. That timeout
bounds the wait itself; it is not part of the plan, case, and step timeout
inheritance hierarchy.

A Delay wait does not expose Timeout in the editor. A timeout beside a fixed
delay only makes the wait fail earlier, while both values have the same
bounded maximum in version 1. The editor preserves an imported version 1
Delay-wait timeout without showing or modifying it. Removing that legacy
contract property requires a deliberate version and compatibility decision,
recorded in [ATR-043](../../../Planning/Backlog/epics/E01-plan-definition/stories/ATR-043.md).

## Try it

1. Open a Click, Type, Fill, or Select option Step and choose Waits.
2. Add one Before Locator wait and one After Delay wait; verify incomplete
   fields show feedback and Cancel does not add a card.
3. Follow each saved card to its Wait page, edit the visible fields, and use
   Return.
4. Promote and demote one list item; confirm the cards move to their new
   positions without changing the other list.
5. Start to remove either wait, confirm Cancel leaves it in place, then confirm
   Remove deletes only the selected wait.
6. Import a valid version 1 Delay wait containing a timeout and confirm the
   editor retains it without presenting a Timeout control.

## Check your understanding

1. Why are Wait cards read-only summaries on a Step page instead of nested
   editable forms?
2. What does the unlinked Before or After breadcrumb item communicate?
3. Why does a Delay wait omit an authorable Timeout while Locator and Page-state
   waits retain one?
4. Why is Wait removal confirmed instead of changing the list immediately?

[Previous: Step View/Edit summaries](34-step-view-edit-summaries.md) · [Course outline](../README.md) · [Skill check](../quiz.md)
