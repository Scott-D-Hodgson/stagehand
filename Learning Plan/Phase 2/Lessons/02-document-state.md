# Lesson 2: Plan document state

> “Which information belongs in the saved plan, and which belongs only to the editor?” — Stella “State Steward” Stone, Developer

**Document state** is information that belongs in the saved Stagehand file. **Interface state** helps operate the editor but is not part of that file, such as the open panel or current cursor position.

Keeping them separate is like keeping a recipe separate from the sticky note that marks your current step. Saving the sticky note into the recipe would change the document by accident.

## Try it

Classify these as document or interface state: plan ID, selected tab, case reference, validation error, and unsaved-change indicator.

## You are ready when

You can design an editor state model that preserves the validated plan while keeping temporary screen details out of exported JSON.
