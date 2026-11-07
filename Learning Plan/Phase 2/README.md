# Course: Phase 2 — Visual authoring

Phase 2 teaches how a local Vue editor can help people create valid Stagehand documents without requiring them to hand-edit JSON.

## In this phase you will learn

- How the editor separates application state from document state.
- How forms, validation, complex inputs, and local files work together.
- How drafts and recovery protect a user's work.

## Do I need this phase?

- [ ] I am building or reviewing the web editor.
- [ ] I need to design understandable plan-authoring forms.
- [ ] I am working on local import, export, drafts, or recovery.

## Prerequisites

Complete the Phase 1 contract lessons first; the editor must preserve those contracts rather than inventing a second document model.

## Work-plan alignment

The [Phase 2 work plan](../../Planning/Work%20Plan/Phase-2-visual-authoring.md) defines M8–M14. These lessons explain concepts rather than dictate implementation order: basic draft recovery and multiple-tab conflict handling start in M8, before the full file workflow. M13 completes protection across later authoring features.

The accepted foundation uses owner-led Vite/Vue/TypeScript setup, Canadian English/French, Neutral guidance, and initial Bootstrap 5 CDN styling; optional user-loaded personas follow later. See [ADR-006](../../Planning/Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md). The recovery scope is recorded in [ADR-005](../../Planning/Backlog/decisions/ADR-005-editor-draft-recovery.md). These are planned capabilities, not implemented editor behaviour.

## Lessons

1. [Vue application foundations](Lessons/01-vue-foundations.md)
2. [Plan document state](Lessons/02-document-state.md)
3. [Form-based editing](Lessons/03-form-editing.md)
4. [Validation feedback](Lessons/04-validation-feedback.md)
5. [Complex authoring](Lessons/05-complex-authoring.md)
6. [Local import and export](Lessons/06-local-files.md)
7. [Drafts and recovery](Lessons/07-drafts-recovery.md)
8. [Phase integration review](Lessons/08-integration-review.md)

Finish with the [Phase 2 skill check](quiz.md).
