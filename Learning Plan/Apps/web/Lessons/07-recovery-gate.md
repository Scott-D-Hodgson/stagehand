# Lesson 7: Recovery gate

> “Why must an editor ask before replacing its starting sample?” — Gia “Gate” Nguyen, Developer

[← Previous: recovery storage](06-recovery-storage-foundation.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)

The recovery gate runs before the editable plan appears. A readable local record
offers Restore and Discard actions with its saved time. Restore makes that draft
the active plan. Discard deletes only the recovery copy after an explicit user
action, then allows the bundled sample to open.

An unreadable record is more cautious: Stagehand does not replace or delete it
automatically. The person must explicitly discard it before starting fresh.
When browser storage cannot be read at all, the editor can still work in memory,
but cannot promise recovery after the tab closes.

The gate must precede autosave. Otherwise, a newly opened editor could write its
bundled sample over a recovery record before the person has a chance to restore
it.

## Try it

Use browser DevTools to seed a valid recovery record. Refresh, restore it, then
refresh again and discard it. Identify which action changes the active plan and
which action changes browser storage.

## You are ready when

- You can explain why recovery is loaded before editing begins.
- You can distinguish restoring a draft from discarding a recovery copy.
- You know that autosave and saved/failed status feedback remain later work.

[← Previous: recovery storage](06-recovery-storage-foundation.md) · [Course outline](../README.md) · [Next: course skill check →](../quiz.md)
