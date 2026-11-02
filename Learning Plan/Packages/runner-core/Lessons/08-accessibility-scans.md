# Lesson 8: Accessibility settings and scans

> “How does runner-core decide whether and how to ask axe to assess a page?” — Sasha “Scan Scout” Singh, Developer

`resolveAccessibilitySettings` combines plan and case settings one field at a time. Defaults are disabled, non-failing, and no tag restriction. Omitted case fields inherit; explicit values replace them. `[]` means no tag filter, so axe uses its default rule selection.

`scanAccessibility()` returns `disabled` without analysis when scanning is off, or `completed` with raw observations when axe resolves. **Completed does not mean passed**; violations or incomplete observations may still exist. Adapter rejection throws `AccessibilityScanError` with its cause.

Automatic scans use the same operation after eligible dispatched steps. `failOnViolation` does not yet decide case/run status; that belongs to M6.

## Try it

Resolve plan `{ enabled: true, failOnViolation: true, tags: ["wcag2a"] }` with case `{ enabled: false, tags: [] }`.

## You are ready when

- You can distinguish disabled, completed, violations, incomplete observations, and rejection.
- You can explain tag inheritance/replacement without implying it enables scanning.

