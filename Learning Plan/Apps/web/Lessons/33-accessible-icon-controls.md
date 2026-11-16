# Accessible icon controls

## Goal

Use Font Awesome icons to make frequently used editor controls compact without
turning their meaning into a visual-only convention.

## The implementation boundary

`apps/web/index.html` loads the Stagehand Font Awesome kit browser script. The
kit recognises icon class names such as `fa-solid fa-plus` and replaces the
matching element with SVG in the browser. This is a browser-kit integration;
it is separate from optional npm package access through the private Font
Awesome registry.

`apps/web/src/components/IconOnlyButton.vue` centralizes the repeated button
behaviour. Callers supply an icon class and a localized label. The component:

- renders the icon as decorative;
- retains the label in Bootstrap's `visually-hidden` utility so it is the
  button's accessible name;
- initializes a Bootstrap popover with that same label for hover and keyboard
  focus; and
- disposes the popover before Vue removes the control.

The wrapper forwards normal button attributes and click listeners, so it can
be used in toolbars, compact card action groups, and dropdown toggles without
changing the owning component's action logic.

## Security and delivery boundary

The kit script uses its public kit identifier and does not expose the private
package token. The root `.npmrc` obtains `FONTAWESOME_PACKAGE_TOKEN` only from
the ignored `.env` file passed into the development container at runtime. The
token must never be committed, embedded in browser code, or passed inline in a
shell command.

The browser kit and Bootstrap assets remain external CDN dependencies. They
make this presentation slice practical now, but they do not meet the editor's
later offline-after-load objective.

## Verify

1. Hover and keyboard-focus each icon-only action: its localized popover text
   appears.
2. Use the action with mouse and keyboard: its original behaviour is unchanged.
3. Switch the interface language and repeat the check: the visually hidden
   name and popover wording both change.
4. Navigate away from the route or switch modes while a popover is visible:
   no detached popover remains.
5. Inspect the button with browser accessibility tools: it has an accessible
   localized name.
