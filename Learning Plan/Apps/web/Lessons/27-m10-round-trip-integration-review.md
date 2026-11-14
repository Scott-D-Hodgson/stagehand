# Lesson 27: M10 round-trip integration review

[← Previous: Component boundaries and inspection mode](26-component-boundaries-and-inspection-mode.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

M10 completes Stagehand's first browser-only portable-file workflow. Its
focused tests protect the ZIP codec, import validation, and export preparation.
The integration review verifies the transitions between those boundaries in the
browser, where the author experiences one continuous workflow.

## The representative round trip

Start with a synthetic ZIP containing `plan.json` and its referenced case
files. Import it, make representative plan and case edits, export the valid
bundle, and re-import the downloaded archive. The resulting plan and cases
must retain the expected portable paths and equivalent contract content.

The import candidate remains detached until explicit replacement confirmation.
Likewise, export validates before filename confirmation. Those controls prevent
a malformed archive or invalid draft from silently replacing current work or
becoming a portable download.

## Integration protections

The walkthrough also confirms that the surrounding safety features continue to
work with portable files: cancellation leaves current work unchanged; recovery
can restore edited work after refresh; a two-tab conflict requires an explicit
choice; and invalid import/export feedback is visible in the selected interface
language. Keyboard dialog operation and the browser's own download feedback
are part of the workflow, not separate implementation details.

The owner completed this representative walkthrough with clean results. That
is evidence for this current editor boundary; it does not prove direct
filesystem support, remote storage, archive signing, or cold offline start.

## You are ready when

- You can distinguish codec tests from browser workflow evidence.
- You can explain why each replacement or destructive transition requires an
  explicit confirmation or recovery choice.
- You can identify which future needs remain outside the M10 ZIP workflow.

[← Previous: Component boundaries and inspection mode](26-component-boundaries-and-inspection-mode.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
