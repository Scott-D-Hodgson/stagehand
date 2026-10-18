# 1. Vue application structure and reactive form state

## Self-assessment: do I need this lesson?

- [ ] I can explain how UI state and rendered controls stay synchronized.
- [ ] I can break a complex editor into components with clear responsibilities.
- [ ] I can distinguish temporary form state from the plan document being edited.
- [ ] I know why one shared plan contract matters to both the Vue editor and the CLI.
- [ ] I can explain how to avoid losing edits when switching between sections.

## What you will learn

- How component state and one-way data flow make form behaviour easier to reason about.
- How to organise an editor around plan, case, and step structures.
- How to update nested data without accidental cross-component mutation.
- How to keep the UI model aligned with the versioned JSON plan contract.

## Core ideas

Vue components are small pieces of interface with their own inputs, state, and events. Reactive state means Vue tracks changes and updates the display. For a plan editor, the plan model is the document; controls are different views onto parts of that document. Think of it as a workbook: the underlying entries are the records, while tabs and forms are ways to inspect and edit them.

Avoid having every screen keep its own slightly different copy of the same case. That is how stale values sneak in. Keep one authoritative editor state, pass the relevant section to child components, and make changes through clear events or actions. A child editor for an action should not silently rewrite unrelated plan settings.

The Stagehand editor is a local-first Vue SPA with controlled forms. It edits versioned plan JSON using the same shared JSON Schema as the runner. The editor should make valid choices easy and explain invalid or unsupported values clearly; it is not a raw JSON editing environment in the MVP.

## Apply this to Stagehand

Before building a screen, identify its plan fields, allowed values, defaults, and validation messages. Separate navigation and selection state (which case is open) from document state (what the plan contains). Preserve stable IDs for cases and steps so reordering or translating labels does not change identity.

Keep components focused: plan settings, case list/details, step editor, variables/data sets, shared steps, and localization can be separate UI pieces while sharing a typed document model. State-management libraries are a later implementation choice; do not add one just because a form has more than three fields.

## Exercise

Draw a component tree for editing one plan with two cases. Mark which component owns the current selected case, where the plan document lives, and how a step change reaches that document. List which updates should preserve a stable ID and which are merely view state.

## You are ready when

- You can trace one form change from input control to plan document and back to rendered UI.
- Each component has one clear responsibility and does not keep competing copies of plan data.
- You can explain how an editor change remains compatible with the shared schema.

## Read next

- [Vue form input bindings](https://vuejs.org/guide/essentials/forms.html)
- [Vue state management](https://vuejs.org/guide/scaling-up/state-management.html)
- [Epic E05: Local-first web editor](../../Planning/Backlog/epics/E05-web-editor/README.md)
- [Phase 2 roadmap](../../Planning/Roadmap/Phase-2-visual-authoring/README.md)

## Reinforcement quiz

1. What is the plan document model, and how is it different from which case is currently selected?
2. Why should child components avoid keeping independent copies of the same case data?
3. What should happen when the editor adds a new step to a case?
4. Why should the editor use the shared plan schema?

<details>
<summary>Answer key</summary>

1. The document model is the plan's actual editable content. Selection is temporary UI state describing which part is shown.
2. Copies can drift apart and overwrite each other. A clear owner and explicit updates make state changes traceable.
3. The change should update the authoritative plan document through a clear event/action, then the UI should render from that updated state.
4. So the editor and CLI agree on what a valid plan is and do not accept conflicting formats.

</details>
