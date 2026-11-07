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
Copies the current supported plan-draft shape into plain browser-storable data.
---
Inputs: A possibly reactive plan draft.
---
Output: An independent plain draft snapshot for local recovery.
*/
export function copyPlanDraft(plan: PlanDraft): PlanDraft {
  return {
    version: plan.version,
    id: plan.id,
    defaults: { locale: plan.defaults.locale },
    cases: plan.cases.map((caseReference) => ({ path: caseReference.path })),
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
