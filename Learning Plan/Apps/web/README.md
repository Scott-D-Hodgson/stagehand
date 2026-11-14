# Course: Understanding `@stagehand/web`

This course explains the foundation of the local-first Stagehand web editor. The [application README](../../../apps/web/README.md) is the operational reference for its commands; [M8](../../../Planning/Work%20Plan/M8-editor-foundation-and-document-state.md) defines the foundation, [M9](../../../Planning/Work%20Plan/M9-basic-plan-and-case-authoring.md) defines the initial authoring scope, and [M10](../../../Planning/Work%20Plan/M10-local-import-and-export.md) defines the portable-file workflow.

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
- How a pure browser-safe ZIP codec preserves a validated plan and its case paths
  before file-picker and download UI is introduced.
- How validated ZIP selection keeps an imported candidate separate from active
  editor state until the author confirms replacement.
- How valid-only export separates portable-bundle preparation, filename
  confirmation, browser download, and local recovery state.
- How a representative ZIP round trip verifies the boundaries between import,
  editing, export, recovery, conflicts, and browser feedback.
- How the editor separates plan, case, step, and dialog components without
  changing the document ownership boundary.
- How a temporary Edit/View mode separates authoring controls from focused
  inspection of the current plan, cases, and steps.
- How M8 established the editor foundation and how M9 grows controlled case and step authoring.

## Do I need this course?

- [ ] I am changing the web editor entry point, scripts, or dependencies.
- [ ] I need to add or review browser-safe use of a shared Stagehand package.
- [ ] I am adding editor state, validation feedback, or its unit tests.
- [ ] I need to distinguish the implemented foundation from planned editor behaviour.

## Current boundary

M8, M9, and M10 are complete: the application has a Vite/Vue/TypeScript foundation, Bootstrap-styled shell, public shared-schema validation, focused Vitest checks, Light/Dark/System and interface-language preferences, Canadian English/French resources, IndexedDB recovery, explicit two-tab conflict resolution, editable case-reference paths, in-memory version 1 case documents, New plan creation, validated Navigate, Click, Type, Fill, Select option, Assert text, Assert HTML, and Assert value step forms, animated adjacent reordering, expandable case-reference workspaces, and concise shared-validation feedback on affected steps and cases. The editor separates plan, case, step, and dialog responsibilities into focused component folders, and provides a temporary Edit/View inspection mode that does not change document or recovery data. M10 supplies a pure browser-safe ZIP codec, browser ZIP selection with blocking validation and replacement confirmation, valid-only browser download after filename confirmation, and clean representative round-trip evidence. Early M11 slices have added a maintained locale catalogue and localized Assert-text, Assert-HTML, and Assert-value expected values. The editor does not yet provide the remaining step forms or execute plans.

## Lessons

1. [Application foundation](Lessons/01-application-foundation.md)
2. [Browser-safe shared contracts](Lessons/02-browser-safe-contracts.md)
3. [Development-container visual checks](Lessons/03-container-visual-checks.md)
4. [Focused editor tests](Lessons/04-focused-editor-tests.md)
5. [Document-state delivery path](Lessons/05-document-state-path.md)
6. [Recovery-storage foundation](Lessons/06-recovery-storage-foundation.md)
7. [Recovery gate](Lessons/07-recovery-gate.md)
8. [Case-reference authoring](Lessons/08-case-reference-authoring.md)
9. [Click-step authoring and modal lifecycle](Lessons/09-click-step-authoring.md)
10. [Type-step authoring](Lessons/10-type-step-authoring.md)
11. [Fill-step authoring and field reuse](Lessons/11-fill-step-authoring.md)
12. [Select-option authoring](Lessons/12-select-option-authoring.md)
13. [Assert-text authoring](Lessons/13-assert-text-authoring.md)
14. [Assert-HTML authoring](Lessons/14-assert-html-authoring.md)
15. [Assert-value authoring](Lessons/15-assert-value-authoring.md)
16. [Step reordering](Lessons/16-step-reordering.md)
17. [Case-reference workspaces](Lessons/17-case-reference-workspaces.md)
18. [Selected-step validation](Lessons/18-selected-step-validation.md)
19. [Localized Assert-text expectations](Lessons/19-localized-assert-text.md)
20. [Localized Assert-HTML expectations](Lessons/20-localized-assert-html.md)
21. [Localized Assert-value expectations](Lessons/21-localized-assert-value.md)
22. [M9 integration review](Lessons/22-m9-integration-review.md)
23. [Portable bundle codec](Lessons/23-portable-bundle-codec.md)
24. [Validated bundle import](Lessons/24-validated-bundle-import.md)
25. [Valid-only bundle export](Lessons/25-valid-only-bundle-export.md)
26. [Component boundaries and inspection mode](Lessons/26-component-boundaries-and-inspection-mode.md)
27. [M10 round-trip integration review](Lessons/27-m10-round-trip-integration-review.md)

Finish with the [course skill check](quiz.md).
