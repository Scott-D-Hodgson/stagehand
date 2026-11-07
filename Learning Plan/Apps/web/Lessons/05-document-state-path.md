# Lesson 5: Document-state delivery path

> “What can the editor safely do next without pretending the hard parts are done?” — Dana “Draft” Ellis, Developer

[← Previous: focused editor tests](04-focused-editor-tests.md) · [Course outline](../README.md) · [Next: recovery storage →](06-recovery-storage-foundation.md)

M8.2 begins document state and basic editing. The owner selected the existing
`defaults.locale` contract field as its first editable field; identifiers remain
read-only. The v1 plan schema has no title or description field, so an editor
must not invent one as a convenient label.

The initial raw text input intentionally accepts what the user types, including
an invalid BCP 47 language tag. A shared-contract validation result then
explains the problem. This prevents a UI convenience from silently changing the
document. A searchable locale combobox backed by a maintained catalogue is a
future focused slice, not a reason to limit plan locales to the editor's two
interface languages.

The current component boundary is deliberately small: `App` owns application
preferences and the active draft, `AppHeader` owns shell controls, `PlanBundle`
coordinates the plan view, and its children present plan details, read-only case
references, and the shared-contract assessment. Its initial automated and
forwarded-browser checks have passed, but that evidence does not complete later
M8 document, recovery, or accessibility work.

The subsequent M8 slices add localization and Neutral guidance (M8.3), one recoverable IndexedDB draft (M8.4), and multiple-tab conflict handling (M8.5). The accepted recovery scope is in [ADR-005](../../../../Planning/Backlog/decisions/ADR-005-editor-draft-recovery.md); technology and language baselines are in [ADR-006](../../../../Planning/Backlog/decisions/ADR-006-editor-technology-and-ui-baselines.md).

Keep four kinds of information separate: contract data that can eventually be exported, temporary incomplete form values, interface state such as the open panel, and local preferences such as the selected interface language. A storage snapshot must preserve incomplete values without claiming that they are a valid portable plan.

## Try it

Open the M8 work plan and list one acceptance check for each remaining M8 slice. Then explain why preserving a raw invalid locale is safer than silently replacing it with `en-CA`.

## You are ready when

- You can name the remaining M8 slices and their boundaries.
- You will not add a plan name or description without a contract decision.
- You can distinguish an invalid draft from valid exportable document data.

[← Previous: focused editor tests](04-focused-editor-tests.md) · [Course outline](../README.md) · [Next: recovery storage →](06-recovery-storage-foundation.md)
