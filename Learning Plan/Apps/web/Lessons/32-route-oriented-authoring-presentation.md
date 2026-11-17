# Lesson 32: Route-oriented authoring presentation

[← Previous: Cloudflare Pages editor deployment](31-cloudflare-pages-editor-deployment.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

## Goal

Understand why the editor presents one plan, case, or step context at a time
instead of nesting editable cards inside one another.

## One context per route

Vue Router separates the editor into four contexts:

- `/` is the recovery-aware Home route. It offers New and Import, and adds
  Recover only when startup finds a readable local draft.
- `/plan` presents the plan ID and plan Default, Browser, and Accessibility
  settings, followed by responsive Case summary cards.
- `/plan/card/:cardIndex` presents the indexed Case ID, its settings, and
  responsive Step summary cards.
- `/plan/card/:cardIndex/step/:stepIndex` presents the indexed step action and
  its fields, which are editable in Edit mode and shown as read-only summaries
  in View mode.

The shell derives a Plan → Case → Step breadcrumb from the active route. Each
card links to its next more-specific route, so browser Back returns from a Step
to its Case and then to its Plan. This gives a phone-sized viewport one focused
editing surface rather than several levels of shrinking cards.

## What belongs where

Plan and Case pages own their settings. Their cards are summaries: they expose
contextual Promote, Demote, Edit, Clone, and Remove controls in Edit mode, but
they do not expose nested step forms. A selected step opens a dedicated Step
page, where its Default and Overrides settings are editable. Localized
assertions also expose a Locales tab that reuses the common locale-override
dialog.

View/Edit remains temporary interface state. It changes the settings controls
for the route being viewed but does not enter the plan, case, or recovery
document. Summary cards remain links in either mode.

## Presentation and semantics

The sticky application brand is not the page heading. Each Home, Plan, Case,
Step, and recovery screen supplies the page-level `h1`; secondary headings
follow the context beneath it. Bootstrap display classes such as `h2` change
appearance only and do not replace semantic heading levels.

Card actions use small, outlined Bootstrap button groups. Dialog Reset and
Cancel actions use outlines, while Save, Create, Download, and destructive
confirmation actions retain their primary semantic emphasis.

## Verify before recording completion

1. Open Home and confirm Recover appears only for a discovered readable draft.
2. Create or import a plan, then follow Plan → Case → Step links and browser
   Back in reverse.
3. Check the Case and Step grids at a narrow and wide viewport.
4. Confirm a Step page edits only its selected step, including all three
   localized assertion Locales panels.
5. Switch View/Edit and confirm only the current route's settings controls
   change, while the selected tab remains open with a read-only summary in
   View mode.
6. Run the editor test, type-check, and production-build commands in the
   development container before claiming the slice is verified.

## Check your understanding

1. Why are Case and Step cards navigational summaries rather than containers
   for their descendant editable forms?
2. Which data must never store the current View/Edit mode?
3. Why should a persistent product brand not be the document `h1` for every
   route?

[← Previous: Cloudflare Pages editor deployment](31-cloudflare-pages-editor-deployment.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
