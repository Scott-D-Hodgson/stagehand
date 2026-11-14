# Lesson 6: Local import and export

> “How can people open and save plans locally without sending them to a Stagehand service?” — Lola “Local-file Librarian” Lowe, Developer

[← Previous: complex authoring](05-complex-authoring.md) · [Phase outline](../README.md) · [Next: drafts recovery →](07-drafts-recovery.md)


Stagehand is local-first: the editor is intended to work without an account or central plan service. A browser can import a file, validate it, let the person edit it, and export a new file.

M10 uses one portable ZIP archive: `plan.json` lives at the archive root and
each case lives at the exact relative path named by the plan. M10.1 implements
the pure browser-safe codec. It rejects unreadable ZIP data, unsafe entry
paths, malformed JSON, unmatched references, and invalid plan/case bundles.
M10.2 connects that codec to browser ZIP selection, but it keeps a valid result
as a candidate until the author confirms replacement of the currently loaded
plan. The later export UI may download only a valid bundle.
M10.3 now provides that download control. It validates first, asks the author to
confirm a suggested filename, and lets the browser communicate download
completion. The editor separately tracks whether later edits have not yet been
exported and whether local recovery has been saved.

Browser file permissions differ from ordinary desktop access. The editor should explain what it can read or replace and provide a download fallback where direct saving is unavailable.

## Try it

Draw the path from choosing a ZIP file to candidate decoding, validation,
replacement confirmation, editing, and export. Add a recovery path for an
invalid import and explain why an invalid draft remains editable but cannot be
exported as a valid portable bundle.

## You are ready when

You can distinguish the pure ZIP codec from the browser controls around it, and
describe a local file workflow that asks for clear permission and never assumes
a cloud service.

[← Previous: complex authoring](05-complex-authoring.md) · [Phase outline](../README.md) · [Next: drafts recovery →](07-drafts-recovery.md)
