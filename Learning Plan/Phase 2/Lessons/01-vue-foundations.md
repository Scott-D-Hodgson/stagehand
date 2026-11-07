# Lesson 1: Vue application foundations

> “How does Vue turn changing information into an editor people can see and use?” — Violet “Vue Viewer” Vincent, Developer

[← Previous: phase outline](../README.md) · [Phase outline](../README.md) · [Next: document state →](02-document-state.md)


Vue builds a screen from **components**: small, reusable pieces such as a plan form or validation message. **Reactive state** is information Vue watches; when it changes, Vue refreshes the affected screen.

Think of a component as a labelled drawer and reactive state as its contents. Vue keeps the label on the drawer in step with what is inside.

Stagehand's Vue editor is planned work. M8 will use Vite, Vue, and TypeScript, with the owner running the initial setup commands as a learning exercise. It should provide a local interface over the shared document contracts, not replace them. Bootstrap 5 CDN styling is an initial presentation aid; it must not determine document rules or application state.

The first editor ships with Canadian English and Canadian French Neutral guidance. User-facing text belongs in translation resources from the start, even when the first screen has only a small amount of text.

## Try it

Sketch components for a plan-details area, read-only case list, validation summary, and language selector. Mark which information each component reads and changes.

## You are ready when

You can explain components, properties, events, and reactive state without treating Vue, Bootstrap, or translation text as the source of Stagehand's document rules.

[← Previous: phase outline](../README.md) · [Phase outline](../README.md) · [Next: document state →](02-document-state.md)
