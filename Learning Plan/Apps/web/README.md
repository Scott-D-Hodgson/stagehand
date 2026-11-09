# Course: Understanding `@stagehand/web`

This course explains the foundation of the local-first Stagehand web editor. The [application README](../../../apps/web/README.md) is the operational reference for its commands; [M8](../../../Planning/Work%20Plan/M8-editor-foundation-and-document-state.md) defines the current milestone scope.

## In this course you will learn

- How the Vite, Vue, and TypeScript workspace starts and builds the editor.
- Why browser code consumes the public `@stagehand/plan-schema` entry point.
- How container port forwarding supports a local visual check.
- How Vitest protects small editor-state boundaries before UI workflows grow.
- How display preferences stay separate from a Stagehand plan and recovery draft.
- How per-locale JSON resources and i18next pluralization keep shell wording maintainable.
- Why the first plan field preserves raw input and how the editor components divide responsibility.
- How a versioned IndexedDB recovery record stays behind a small storage interface.
- How a recovery gate prevents a bundled sample from silently replacing local work.
- How M8 established the editor foundation and where M9 case-reference authoring begins.

## Do I need this course?

- [ ] I am changing the web editor entry point, scripts, or dependencies.
- [ ] I need to add or review browser-safe use of a shared Stagehand package.
- [ ] I am adding editor state, validation feedback, or its unit tests.
- [ ] I need to distinguish the implemented foundation from planned editor behaviour.

## Current boundary

M8 is complete: the application has a Vite/Vue/TypeScript foundation, Bootstrap-styled shell, public shared-schema validation, focused Vitest checks, Light/Dark/System and interface-language preferences, Canadian English/French resources, IndexedDB recovery, and two-tab conflict handling. M9 now has editable case-reference paths, in-memory version 1 case documents, New plan creation, and a validated Navigate-step form. The editor does not yet provide the remaining step forms, import/export, or execute plans.

## Lessons

1. [Application foundation](Lessons/01-application-foundation.md)
2. [Browser-safe shared contracts](Lessons/02-browser-safe-contracts.md)
3. [Development-container visual checks](Lessons/03-container-visual-checks.md)
4. [Focused editor tests](Lessons/04-focused-editor-tests.md)
5. [Document-state delivery path](Lessons/05-document-state-path.md)
6. [Recovery-storage foundation](Lessons/06-recovery-storage-foundation.md)
7. [Recovery gate](Lessons/07-recovery-gate.md)
8. [Case-reference authoring](Lessons/08-case-reference-authoring.md)

Finish with the [course skill check](quiz.md).
