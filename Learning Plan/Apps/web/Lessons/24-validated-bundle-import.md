# Lesson 24: Validated bundle import

> “Why is a valid ZIP not automatically safe to make current?” — Imani “Import Guard” Ibrahim, Developer

[← Previous: Portable bundle codec](23-portable-bundle-codec.md) · [Course outline](../README.md) · [Next: Valid-only bundle export →](25-valid-only-bundle-export.md)

M10.2 adds the browser-facing half of import without weakening the safety
boundary from M10.1. The Import button selects a ZIP archive, reads it into a
detached candidate, and asks the portable bundle codec to validate it. No plan
or case is replaced while that work is happening.

## A candidate is not the active draft

A file can be structurally valid while the author still does not intend to
discard the plan currently on screen. For that reason, every valid candidate
stops at a static confirmation dialog. Cancelling leaves the active draft
unchanged; confirming passes a copied bundle into the normal recovery and
autosave path.

Invalid candidates receive a second static dialog. It summarizes unreadable
ZIP data, malformed JSON, missing or ambiguous references, and other invalid
document failures in the selected interface language. The dialog prevents
background editing until acknowledged, which avoids burying a safety-relevant
message below the fold.

## Try it

Describe the state of the active draft after each event:

1. A person chooses a non-ZIP file.
2. A ZIP is valid but the person cancels replacement.
3. A ZIP is valid and the person confirms replacement.

Then explain why only the third event should trigger normal autosave.

## You are ready when

- You can distinguish a decoded candidate from the active editor draft.
- You can explain why both rejection and replacement use blocking dialogs.
- You can identify why browser import must not use the Node filesystem loader.

[← Previous: Portable bundle codec](23-portable-bundle-codec.md) · [Course outline](../README.md) · [Next: Valid-only bundle export →](25-valid-only-bundle-export.md)
