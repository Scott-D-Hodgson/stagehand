# 3. Import, export, unsaved work, and offline behaviour

## Self-assessment: do I need this lesson?

- [ ] I can explain the difference between an in-memory edit and a saved file.
- [ ] I know how browser upload and download workflows work at a high level.
- [ ] I can describe how to prevent accidental loss of unsaved changes.
- [ ] I understand the difference between an already-open app working offline and cold-starting offline.
- [ ] I can explain why a local-first editor must be clear about where user files go.

## What you will learn

- How a browser editor can work on user-owned files without a backend.
- How import and export relate to validation and versioned contracts.
- How to signal unsaved changes and handle failure paths.
- What the planned offline behaviour does and does not promise.

## Core ideas

Import copies a selected file into the editor's in-memory working state. Export serializes the current document and asks the browser to download it. These are different operations from silently reading or writing arbitrary files on disk. Browser file APIs vary; Stagehand's MVP uses upload/import and download/export in supported browsers.

An unsaved-change indicator is a small but important promise. If a user edits a plan and navigates away, closes a tab, or imports another file, the editor should explain the risk and offer a chance to export or cancel. Do not claim an edit has been saved merely because it is visible on screen.

Offline behaviour has two meanings. The loaded editor may continue working without a network connection. Cold-starting the site while offline is not initially required. Direct filesystem access is also deferred; users manage files through explicit import and export.

## Apply this to Stagehand

On import, parse the file, identify its version, validate it, and present errors without replacing the current document unexpectedly. On export, validate first, preserve the supported plan version, and provide a predictable filename. Show the file name currently being edited and whether there are unsaved changes. The user owns the files and chooses where downloaded files are stored.

Test the interruption paths: invalid upload, cancelled file picker, browser download behaviour, replacing a dirty document, reload while offline, and storage exhaustion if browser storage is used for recovery. Browser storage is a recovery aid only if the product defines its limits and does not imply it replaces export.

## Exercise

Write the user-visible states for: clean plan, edited plan, successful export, invalid import, user cancels import, and offline after the app has loaded. For each, say whether the current document is preserved and what action the user can take.

## You are ready when

- Import cannot silently destroy unsaved content.
- Users can tell which plan is in memory and whether it has been exported.
- Offline and file-access claims match the actual browser workflow.

## Read next

- [Phase 2 roadmap](../../Planning/Roadmap/Phase-2-visual-authoring/README.md)
- [Epic E05: Local-first web editor](../../Planning/Backlog/epics/E05-web-editor/README.md)
- [Direct filesystem access is deferred](../../Planning/Backlog/technical-enablers/te-020-direct-filesystem-access-for-editor.md)
- [MDN: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)

## Reinforcement quiz

1. What does importing a plan do in the MVP?
2. What should happen if a user selects an invalid file while the current plan has unsaved changes?
3. Does “works offline after loading” guarantee the site can be opened offline from a fresh browser session?
4. Why is an unsaved-change indicator not the same as saving a file?

<details>
<summary>Answer key</summary>

1. It loads a user-selected file into the editor's working state for parsing, validation, and editing.
2. Preserve the current document and explain the import error; do not replace it silently.
3. No. Cold-starting offline is not initially required.
4. The indicator only communicates that the in-memory document differs from the exported file. The user must explicitly export to create an updated file.

</details>
