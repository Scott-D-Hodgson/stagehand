# Lesson 2: Landing-page structure and accessibility

## Goal

Recognize how the Stagehand landing page communicates a truthful project
boundary while remaining useful on different screen sizes and input methods.

## Structure

The home page is composed from `content/_index.md`, `layouts/index.html`, and
the shared document shell in `layouts/_default/baseof.html`. The CSS asset is
local to the site in `assets/css/site.css`; no third-party theme, JavaScript,
analytics, or design-system dependency is required.

The page includes a visible keyboard focus style, a skip link, semantic
headings, labelled primary navigation, responsive content grids, and browser
light/dark colour preferences. Check both wide and narrow browser widths when
changing its layout.

## Content boundary

The site may explain that Stagehand is local-first and under active
development. It must not claim that the editor is a hosted service, that plans
are centrally stored, or that browser tests execute remotely. Current
development status should remain accurate and link to the repository planning
material rather than duplicating a fragile milestone ledger on the landing
page.

## Practice

Run the local server, then check:

1. Keyboard focus reaches the skip link and moves to main content.
2. The page remains legible at a narrow viewport.
3. Light and dark browser colour preferences both keep controls and text
   legible.
4. Source-code and planning links lead to the intended public GitHub pages.

## Check your understanding

1. Which files should change when editing words on the home page versus its
   reusable document shell?
2. Why does the landing page link to project planning instead of presenting a
   detailed implementation-status ledger?
