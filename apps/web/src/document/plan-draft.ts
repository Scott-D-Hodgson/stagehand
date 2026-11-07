export interface PlanDraft {
  version: 1
  id: string
  defaults: {
    locale: string
  }
  cases: Array<{
    path: string
  }>
}

/*
Creates the bundled plan used to begin editor-state work.
---
Inputs: None.
---
Output: A fresh editable plan draft with one associated case reference.
*/
export function createBundledPlanDraft(): PlanDraft {
  return {
    version: 1,
    id: 'editor-foundation',
    defaults: {
      locale: 'en-CA',
    },
    cases: [
      { path: 'cases/landing-page.json' },
    ],
  }
}

/*
Replaces the plan locale while preserving the rest of the draft.
---
Inputs: An existing plan draft and raw locale input.
---
Output: A new draft containing the raw locale value.
*/
export function updatePlanLocale(plan: PlanDraft, locale: string): PlanDraft {
  return {
    ...plan,
    defaults: {
      ...plan.defaults,
      locale,
    },
  }
}
