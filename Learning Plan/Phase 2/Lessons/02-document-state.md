# Lesson 2: Plan document state

> “Which information belongs in the saved plan, and which belongs only to the editor?” — Stella “State Steward” Stone, Developer

[← Previous: vue foundations](01-vue-foundations.md) · [Phase outline](../README.md) · [Next: form editing →](03-form-editing.md)


**Document state** is information that belongs in the saved Stagehand file. **Interface state** helps operate the editor but is not part of that file, such as the open panel or current cursor position. M8 also keeps a browser-local recovery snapshot and preferences such as interface language outside exported JSON.

Keeping them separate is like keeping a recipe separate from the sticky note that marks your current step. Saving the sticky note into the recipe would change the document by accident.

## Try it

Classify these as document state, interface state, or browser-local recovery/preference data: plan ID, selected tab, case reference, validation error, unsaved-change indicator, interface language, and a draft revision number.

## You are ready when

You can design an editor state model that preserves the plan and incomplete form input for recovery while keeping temporary screen details and preferences out of exported JSON.

[← Previous: vue foundations](01-vue-foundations.md) · [Phase outline](../README.md) · [Next: form editing →](03-form-editing.md)
