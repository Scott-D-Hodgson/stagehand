# Lesson 23: Portable bundle codec

> “How can a browser understand a plan archive before it is allowed to replace someone’s draft?” — Zadie “ZIP Safety” Zhou, Developer

[← Previous: M9 integration review](22-m9-integration-review.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)

M10.1 introduces a small boundary between a ZIP archive and editable editor
state. The boundary is deliberately pure: it receives archive bytes and returns
either a validated plan/case bundle or structured issues. It does not open a
file picker, modify the active draft, or start a download.

## The portable layout

One archive contains `plan.json` at its root. Each case document appears at the
same portable relative path used in `plan.json`, such as
`cases/checkout.json`. Keeping those paths exact means a downloaded bundle can
be understood without inventing a second path mapping.

The codec first checks each archive entry path. It rejects absolute paths,
backslashes, and traversal segments such as `..`. It then parses JSON, uses the
public `@stagehand/plan-schema` reference matcher, and validates the resulting
plan/case bundle. Export performs the same contract checks before it creates ZIP
bytes, so an invalid draft stays editable and recoverable but is not presented
as a valid portable bundle.

## Why keep it separate from the UI?

Think of the codec as a customs desk and the import dialog as the arrivals
hall. The customs desk decides whether the contents are safe and internally
consistent. The dialog later explains the result, asks before replacing changed
work, and hands the accepted candidate to editor state. Separating them keeps
the important rules testable without browser permissions or a rendered form.

## Try it

For a plan that references `cases/checkout.json`, list the archive entries a
valid bundle needs. Then list the first failure reported for each of these:

- a ZIP with no `plan.json`;
- `plan.json` that is not JSON;
- a plan reference with no matching entry; and
- an extra unreferenced case entry.

## You are ready when

- You can explain why `plan.json` is fixed at the archive root.
- You can distinguish ZIP-entry safety from plan-reference validation.
- You can explain why M10.1 is safe to test without a file picker or download.

[← Previous: M9 integration review](22-m9-integration-review.md) · [Course outline](../README.md) · [Skill check →](../quiz.md)
