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

export interface CaseDraft {
  id: string;
  steps: unknown[];
  version: 1;
}

export interface EditorBundleDraft {
  cases: Record<string, CaseDraft>;
  plan: PlanDraft;
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
Creates the bundled plan together with its in-memory case document drafts.
---
Inputs: None.
---
Output: A fresh editor bundle with one empty version 1 case document.
*/
export function createBundledEditorDraft(): EditorBundleDraft {
  const plan = createBundledPlanDraft();
  return {
    cases: {
      'cases/landing-page.json': { id: 'landing-page', steps: [], version: 1 },
    },
    plan,
  };
}

/*
Creates a new empty version 1 editor bundle for a supplied plan identifier.
---
Inputs: A raw plan identifier entered by the author.
---
Output: A plan with default locale and no case references or case documents.
*/
export function createEmptyEditorDraft(id: string): EditorBundleDraft {
  return {
    cases: {},
    plan: {
      cases: [],
      defaults: { locale: 'en-CA' },
      id,
      version: 1,
    },
  };
}

/*
Migrates a legacy plan-only draft into a bundle with empty case documents.
---
Inputs: A version 1 plan draft whose case documents were not stored separately.
---
Output: A bundle that preserves every reference path and supplies derived case IDs.
*/
export function migratePlanDraftToEditorBundle(plan: PlanDraft): EditorBundleDraft {
  return {
    cases: Object.fromEntries(plan.cases.map((caseReference) => [caseReference.path, createCaseDraft(caseReference.path)])),
    plan: copyPlanDraft(plan),
  };
}

/*
Creates an empty version 1 case document for a reference path.
---
Inputs: A case-reference path.
---
Output: A new case draft with a filename-derived identifier.
*/
export function createCaseDraft(path: string): CaseDraft {
  return { id: deriveCaseId(path), steps: [], version: 1 };
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
Copies a bundle into independent plain data for browser-local recovery.
---
Inputs: A possibly reactive editor bundle draft.
---
Output: A detached plan and case-document snapshot.
*/
export function copyEditorBundleDraft(draft: EditorBundleDraft): EditorBundleDraft {
  return {
    cases: Object.fromEntries(Object.entries(draft.cases).map(([path, caseDraft]) => [path, { ...caseDraft, steps: [...caseDraft.steps] }])),
    plan: copyPlanDraft(draft.plan),
  };
}

/*
Derives a safe initial case identifier from a case-reference path.
---
Inputs: A relative case-reference path.
---
Output: A non-empty identifier suitable for a new version 1 case document.
*/
function deriveCaseId(path: string): string {
  const filename = path.split('/').at(-1)?.replace(/\.json$/i, '') ?? '';
  return filename.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new-case';
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
