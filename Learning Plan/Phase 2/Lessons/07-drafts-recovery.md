# Lesson 7: Drafts and recovery

> “What protects an unfinished plan if the tab closes or the editor crashes?” — Drew “Draft Defender” Dawson, Developer

[← Previous: local files](06-local-files.md) · [Phase outline](../README.md) · [Next: integration review →](08-integration-review.md)


A draft is a local recovery copy, not automatically the authoritative plan file. The editor should clearly identify unsaved changes and let the person choose whether to recover or discard a draft. M8 plans one IndexedDB snapshot of the plan and its associated cases, saved after a short pause in editing. It may contain incomplete or invalid form input.

Recovery data can contain sensitive test inputs. Store only what is needed, keep it local, and provide a clear way to remove it. Browser storage can be unavailable, cleared, or evicted, so recovery does not replace a downloaded export.

More than one editor tab may edit the same draft. A revision check prevents an outdated tab from silently replacing newer saved work. When a conflict occurs, preserve its pending edits, pause autosave in that tab, and let the user compare, discard, or explicitly replace the stored draft. Automatic merging is not part of M8.

## Try it

Write the choices shown when a stored draft is newer than an exported file, then write the choices for a competing-save conflict in another tab.

## You are ready when

You can distinguish saving a local recovery snapshot, automatic recovery, and exporting—and explain which copy is authoritative and why a conflicting tab must not overwrite newer work.

[← Previous: local files](06-local-files.md) · [Phase outline](../README.md) · [Next: integration review →](08-integration-review.md)
