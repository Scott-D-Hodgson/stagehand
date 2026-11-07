# Lesson 6: Recovery-storage foundation

> “How can a draft survive a closed tab without becoming the user's exported file?” — Rowan “Record” Patel, Developer

[← Previous: document-state path](05-document-state-path.md) · [Course outline](../README.md) · [Next: recovery gate →](07-recovery-gate.md)

M8.4 begins with a narrow persistence boundary. `DraftStorage` exposes only
load, save, and explicit discard operations. Vue components do not use
IndexedDB directly, which keeps browser persistence separate from display and
editing behaviour.

The v1 recovery record contains the raw plan draft, a non-negative revision,
and an ISO 8601 saved time. It deliberately permits incomplete or invalid plan
values: recovery protects the user's work, while shared validation determines
whether a plan is valid for a later export or run.

There is only one active record in this slice. The IndexedDB adapter keeps its
internal lookup key private. If it encounters an unsupported record, it reports
that record as unreadable instead of changing or deleting it. The recovery gate
offers an explicit discard path; it must never overwrite unreadable data
with the bundled sample.

`fake-indexeddb` is a development-only test dependency that lets Vitest execute
the adapter's basic IndexedDB operations in Node.js. It does not replace a
browser recovery check, and it is not bundled into the editor.

## Try it

Read the recovery-storage tests. Identify which assertion protects raw invalid
input, and explain why a database key does not belong in the public recovery
record.

## You are ready when

- You can distinguish a recovery snapshot from an exported plan.
- You can explain why unknown stored data must not be silently discarded.
- You can name the remaining recovery work: autosave timing, status feedback,
  browser evidence for unreadable data, and multiple-tab conflict handling.

[← Previous: document-state path](05-document-state-path.md) · [Course outline](../README.md) · [Next: recovery gate →](07-recovery-gate.md)
