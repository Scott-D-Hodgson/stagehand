# Lesson 40: M11 configuration round trips

> “How do we know the editor keeps all of those settings when they leave the page?” — Rowan “Round Trip” Patel

[Previous: Associated-label assertions](39-associated-label-assertions.md) · [Course outline](../README.md) · [Next: Skill check](../quiz.md)

## Goal

Understand why a representative round trip is stronger evidence than checking
each editor field in isolation.

## One bundle, several boundaries

M11 settings live in more than one place while an author works: the editable
Vue draft, an IndexedDB recovery record, and the JSON files inside a portable
ZIP. A preservation test creates one valid bundle containing browser and
accessibility settings, timeout overrides, waits, localized assertion values,
and an associated-label expectation. It then exports and imports the ZIP and
expects the same data back.

Recovery needs the same care. The storage test saves that representative data,
reads it again, changes the returned copy, and confirms the stored copy did
not change. That guards against an accidental shared object reference.

## Recovery is a choice

A saved local copy is not silently activated. The author confirms restoration
first. If the previous URL no longer fits the recovered data, Stagehand keeps
the closest valid context: Wait falls back to Step, Step to Case, and Case to
Plan. This is like reopening a bookmark after a chapter was removed: keep the
reader as close as possible without pointing at something that no longer
exists.

## Try it

1. Configure a plan, case, and assertion with at least one wait and locale
   override.
2. Refresh the browser and choose **Yes** on the recovery confirmation.
3. Export the bundle, create a temporary plan, then import the ZIP.
4. Compare the restored values with the original configuration.
5. Refresh again and choose **No** to confirm that Home remains available
   without reopening the saved copy.

## Readiness criteria

- You can explain the difference between an in-memory draft, recovery record,
  and portable bundle.
- You can identify why mutable-copy isolation matters for browser storage.
- You can predict the safe fallback route for an invalid recovered Wait URL.

[Previous: Associated-label assertions](39-associated-label-assertions.md) · [Course outline](../README.md) · [Next: Skill check](../quiz.md)
