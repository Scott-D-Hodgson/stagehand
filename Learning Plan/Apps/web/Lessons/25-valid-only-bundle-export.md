# Lesson 25: Valid-only bundle export

> “Why should choosing a filename come after validation, not before it?” — Theo “ZIP Courier” Tremblay, Developer

[← Previous: Validated bundle import](24-validated-bundle-import.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

M10.3 turns a valid editor bundle into a browser download. It does not use a
browser filesystem permission or a desktop-style Save dialog. Instead, it asks
the codec to prepare ZIP bytes, asks the author to confirm a filename, and then
uses a browser Blob download.

## Validate before naming

A filename cannot repair an invalid plan or case. Export therefore starts by
running the same bundle validation used for portable encoding. If it fails, a
static localized dialog explains that export is blocked and the current draft
remains editable and recoverable. Only a valid bundle reaches the filename
dialog.

The suggested name is `<plan-id>.stagehand.zip`. The dialog focuses that value,
allows the author to replace it, and adds `.zip` if omitted. Confirming it asks
the browser to download the prepared bytes; the browser provides its normal
download feedback.

## Separate status from persistence

A download does not replace the IndexedDB recovery copy, and a local recovery
save does not prove that the author has exported the latest changes. The footer
therefore reports whether the current draft has unexported changes alongside
the independent local-save status. It does not duplicate the browser’s success
notification with a second downloaded-file message.

## Try it

Explain the outcome of each action:

1. Export a valid plan, accept the suggested filename, then make one edit.
2. Export again and enter a filename without `.zip`.
3. Attempt export when shared validation reports a missing referenced case.

## You are ready when

- You can distinguish bundle validation from filename selection.
- You can explain why a Blob download does not equal a recovery save.
- You can identify why the browser, not Stagehand, reports a successful download.

[← Previous: Validated bundle import](24-validated-bundle-import.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
