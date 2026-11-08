export interface PlanDraft {
  version: 1;
  id: string;
  defaults: {
    locale: string;
  };
  cases: Array<{
    path: string;
  }>;
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
  };
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
  };
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
  };
}

/*
Adds a supplied case reference without changing existing references.
---
Inputs: An existing editable plan draft.
---
Output: A new draft with one empty case-reference path.
*/
export function addCaseReference(plan: PlanDraft, path: string): PlanDraft {
  return { ...plan, cases: [...plan.cases, { path }] };
}

/*
Replaces one raw case-reference path by its current index.
---
Inputs: A draft, reference index, and entered path.
---
Output: A new draft preserving all other references.
*/
export function updateCaseReference(plan: PlanDraft, index: number, path: string): PlanDraft {
  return { ...plan, cases: plan.cases.map((reference, candidateIndex) => candidateIndex === index ? { path } : reference) };
}

/*
Removes one case reference after the caller has confirmed the action.
---
Inputs: A draft and reference index.
---
Output: A new draft without the selected reference.
*/
export function removeCaseReference(plan: PlanDraft, index: number): PlanDraft {
  return { ...plan, cases: plan.cases.filter((_, candidateIndex) => candidateIndex !== index) };
}
