# Lesson 3: Form-based editing

> “How can a friendly form change JSON without quietly damaging it?” — Freya “Form Focuser” Ford, Developer

[← Previous: document state](02-document-state.md) · [Phase outline](../README.md) · [Next: validation feedback →](04-validation-feedback.md)


A form should translate a person's choices into the shared Stagehand document shape. Stable identifiers and fields the form does not currently display must not disappear during an edit.

This is similar to editing one cell in a spreadsheet: changing the cell should not erase the other columns in its row.

## Try it

Choose an existing editable plan field once M8 resolves that decision. Trace it from loaded JSON, through a form control, and back to exported JSON. List the checks needed at each boundary. Do not assume a plan title exists: the current v1 plan contract has no title or description field.

## You are ready when

You can explain how forms update selected fields while preserving the rest of a validated document.

[← Previous: document state](02-document-state.md) · [Phase outline](../README.md) · [Next: validation feedback →](04-validation-feedback.md)
