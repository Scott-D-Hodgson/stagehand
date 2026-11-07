# ADR-005 — Basic editor draft recovery from M8

**Status:** Accepted  
**Decision date:** 2026-11-07

## Context

The agreed Phase 2 milestone framework starts with M8, editor foundation and document state. Keeping edits only in memory would lose them when the application closes. The owner wants basic recovery from the beginning while retaining small, reviewable implementation slices.

This decision supplements [ADR-002](ADR-002-local-first-editor.md). It commits to browser-local draft storage without introducing a Stagehand backend or requiring offline cold-start support.

## Decision

M8 will include basic IndexedDB autosave and recovery for one active draft containing the plan and its associated cases. The active editing state remains in memory; IndexedDB stores a recovery snapshot. Draft storage must preserve incomplete or invalid form values rather than requiring a valid exportable document. Interface state, such as the selected panel, remains separate from exported document data.

The planned behaviour is:

- Save the latest draft automatically after one second without further edits, independently of validation. Display "Saved locally" only after the write succeeds.
- Offer Restore or Discard when the application reopens with a stored draft, showing its last-saved time.
- Show whether the draft is saving, saved locally, or could not be saved.
- Keep storage operations behind a small interface separate from Vue components.
- Allow multiple tabs to edit the same draft, with conflict detection that prevents silent overwriting of newer saved changes.
- Check the draft revision and write the replacement together in one IndexedDB transaction. An outdated tab must not overwrite a newer revision.
- Preserve pending edits when a conflict is detected and explain that another tab has saved changes. Do not silently reload over those edits.
- Pause autosave in the affected tab and offer a comparison of its pending edits with the saved draft. Let the user discard the local edits or explicitly replace the saved draft. Replacement must check the revision again and detect any intervening save rather than silently overwrite it.
- A tab without pending edits may load the newer saved draft. Automatic merging of concurrent edits and live synchronized editing are outside M8.
- Verify recovery after reopening, preservation of incomplete edits, storage failures, and competing saves from multiple tabs.
- Preserve unreadable recovery data and explain the problem. Starting fresh requires explicit discard; never silently overwrite the stored draft with the sample.

## Related M8 authoring and completion decisions

- Validate on opening a document, after leaving an edited field, and through a Validate button. Validation failures do not prevent draft autosave.
- Require confirmation before resetting edited work to the bundled sample.
- M8 completion evidence must cover basic editing, shared validation, recovery of incomplete edits, storage-failure feedback, and competing-tab saves in supported desktop Chrome and Edge on Windows.

Implement M8 in small PRs: application foundation, document editing and shared validation, then draft persistence and recovery. M8 is not complete until the agreed basic recovery behaviour is verified.

## Scope boundaries

- One current recovery snapshot is sufficient; change history and persistent undo are not included.
- Multiple saved projects, sophisticated recovery, and migrations across released database versions are outside M8. The initial storage format must still be identifiable so unsupported data can be handled safely.
- M13 remains responsible for completing protection across import, replacement, multiple documents, and more involved recovery scenarios. Exact scope will be defined in its milestone plan.
- Browser-local recovery does not replace JSON export as the user's portable saved copy. Storage can be cleared or become unavailable; the interface must not promise guaranteed recovery or imply that a local draft has been exported.
- Recovery on reopening assumes the application can load. This does not extend the offline commitment in [ADR-002](ADR-002-local-first-editor.md) to offline cold-starts.

## Alternatives considered

- **Memory-only M8, recovery in M13:** smaller initial scope, but leaves early authoring work unprotected between sessions.
- **Full draft/project management in M8:** provides more capabilities immediately, but makes the foundation milestone too broad for incremental learning and review.
- **One editable tab:** simpler coordination, but prevents the owner's preferred workflow of editing different aspects of a document in separate tabs.
- **Live synchronized editing:** more seamless across tabs, but adds synchronization and merge behaviour beyond the initial recovery scope. Multiple editing tabs with conflict detection are the accepted initial compromise.

## Consequences and remaining planning

M8 gains a separate persistence slice and its verification work. The Phase 2 work plan must reflect that effort; no estimate is agreed yet. This is an accepted planning decision, not implemented or verified editor behaviour.

The autosave timing, draft contents, conflict-resolution choices, unreadable-data behaviour, validation timing, reset confirmation, and completion scenarios above are accepted. The exact draft representation, comparison presentation, storage-failure wording, library, and database layout remain implementation details to define. Multiple-tab conflict handling should be a separate implementation slice with explicit verification.
