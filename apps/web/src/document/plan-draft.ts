export interface ViewportDraft {
  height?: unknown;
  width?: unknown;
}

export interface PlanBrowserSettingsDraft {
  headless?: boolean;
  timeZone?: string;
  type?: 'chromium';
  viewport?: ViewportDraft;
}

export interface CaseBrowserSettingsDraft {
  timeZone?: string;
  type?: 'chromium';
  viewport?: ViewportDraft;
}

export interface AccessibilitySettingsDraft {
  enabled?: boolean;
  failOnViolation?: boolean;
}

export interface PlanDraft {
  version: 1;
  id: string;
  defaults: {
    accessibility?: AccessibilitySettingsDraft;
    browser?: PlanBrowserSettingsDraft;
    locale: string;
  };
  cases: Array<{
    path: string;
  }>;
}

export interface CaseDraft {
  id: string;
  settings?: Record<string, unknown> & {
    accessibility?: AccessibilitySettingsDraft;
    browser?: CaseBrowserSettingsDraft;
  };
  steps: unknown[];
  version: 1;
}

export interface EditorBundleDraft {
  cases: Record<string, CaseDraft>;
  plan: PlanDraft;
}

export const defaultPlanBrowserSettings: PlanBrowserSettingsDraft = {
  headless: true,
  timeZone: 'America/Toronto',
  viewport: {
    height: 720,
    width: 1280,
  },
};

export const defaultAccessibilitySettings: AccessibilitySettingsDraft = {
  enabled: false,
  failOnViolation: false,
};

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
      accessibility: copyAccessibilitySettings(defaultAccessibilitySettings),
      browser: copyPlanBrowserSettings(defaultPlanBrowserSettings),
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
      defaults: { accessibility: copyAccessibilitySettings(defaultAccessibilitySettings), browser: copyPlanBrowserSettings(defaultPlanBrowserSettings), locale: 'en-CA' },
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
    defaults: {
      ...(plan.defaults.accessibility === undefined ? {} : { accessibility: copyAccessibilitySettings(plan.defaults.accessibility) }),
      ...(plan.defaults.browser === undefined ? {} : { browser: copyPlanBrowserSettings(plan.defaults.browser) }),
      locale: plan.defaults.locale,
    },
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
    cases: Object.fromEntries(Object.entries(draft.cases).map(([path, caseDraft]) => [path, {
      ...caseDraft,
      ...(caseDraft.settings === undefined ? {} : { settings: copyPlainValue(caseDraft.settings) as CaseDraft['settings'] }),
      steps: caseDraft.steps.map(copyPlainValue),
    }])),
    plan: copyPlanDraft(draft.plan),
  };
}

/*
Copies nested step data into browser-cloneable plain values.
---
Inputs: A primitive, array, or object held in a possibly reactive case step.
---
Output: An independent plain value suitable for IndexedDB storage.
*/
function copyPlainValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(copyPlainValue);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, copyPlainValue(nestedValue)]));
  }
  return value;
}

/*
Copies browser defaults into independent plain editable data.
---
Inputs: Plan-level browser settings from an editor draft.
---
Output: An independent browser-settings value.
*/
function copyPlanBrowserSettings(settings: PlanBrowserSettingsDraft): PlanBrowserSettingsDraft {
  return {
    ...(settings.headless === undefined ? {} : { headless: settings.headless }),
    ...(settings.timeZone === undefined ? {} : { timeZone: settings.timeZone }),
    ...(settings.type === undefined ? {} : { type: settings.type }),
    ...(settings.viewport === undefined ? {} : {
      viewport: {
        ...(settings.viewport.height === undefined ? {} : { height: settings.viewport.height }),
        ...(settings.viewport.width === undefined ? {} : { width: settings.viewport.width }),
      },
    }),
  };
}

/*
Copies supported accessibility settings into independent plain editable data.
---
Inputs: Plan or case accessibility settings from an editor draft.
---
Output: An independent accessibility-settings value.
*/
function copyAccessibilitySettings(settings: AccessibilitySettingsDraft): AccessibilitySettingsDraft {
  return {
    ...(settings.enabled === undefined ? {} : { enabled: settings.enabled }),
    ...(settings.failOnViolation === undefined ? {} : { failOnViolation: settings.failOnViolation }),
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
Replaces plan-level browser defaults while preserving other plan data.
---
Inputs: An existing plan draft and replacement browser settings.
---
Output: A new draft containing independent browser-default data.
*/
export function updatePlanBrowserSettings(plan: PlanDraft, browser: PlanBrowserSettingsDraft): PlanDraft {
  return {
    ...plan,
    defaults: {
      ...plan.defaults,
      browser: copyPlanBrowserSettings(browser),
    },
  };
}

/*
Replaces plan-level accessibility defaults while preserving other plan data.
---
Inputs: An existing plan draft and replacement accessibility settings.
---
Output: A new draft containing independent accessibility-default data.
*/
export function updatePlanAccessibilitySettings(plan: PlanDraft, accessibility: AccessibilitySettingsDraft): PlanDraft {
  return {
    ...plan,
    defaults: {
      ...plan.defaults,
      accessibility: copyAccessibilitySettings(accessibility),
    },
  };
}

/*
Replaces optional case-level browser overrides without changing case steps.
---
Inputs: A case draft and an optional replacement browser override.
---
Output: A case draft with browser settings added, replaced, or omitted.
*/
export function updateCaseBrowserSettings(caseDraft: CaseDraft, browser: CaseBrowserSettingsDraft | undefined): CaseDraft {
  if (browser === undefined) {
    const { browser: _, ...remainingSettings } = caseDraft.settings ?? {};
    if (Object.keys(remainingSettings).length === 0) {
      const { settings: _, ...caseWithoutSettings } = caseDraft;
      return caseWithoutSettings;
    }
    return { ...caseDraft, settings: remainingSettings };
  }
  return {
    ...caseDraft,
    settings: {
      ...caseDraft.settings,
      browser: {
        ...(browser.timeZone === undefined ? {} : { timeZone: browser.timeZone }),
        ...(browser.type === undefined ? {} : { type: browser.type }),
        ...(browser.viewport === undefined ? {} : {
          viewport: {
            ...(browser.viewport.height === undefined ? {} : { height: browser.viewport.height }),
            ...(browser.viewport.width === undefined ? {} : { width: browser.viewport.width }),
          },
        }),
      },
    },
  };
}

/*
Replaces optional case accessibility overrides without changing case steps.
---
Inputs: A case draft and an optional replacement accessibility override.
---
Output: A case draft with accessibility settings added, replaced, or omitted.
*/
export function updateCaseAccessibilitySettings(caseDraft: CaseDraft, accessibility: AccessibilitySettingsDraft | undefined): CaseDraft {
  if (accessibility === undefined) {
    const { accessibility: _, ...remainingSettings } = caseDraft.settings ?? {};
    if (Object.keys(remainingSettings).length === 0) {
      const { settings: _, ...caseWithoutSettings } = caseDraft;
      return caseWithoutSettings;
    }
    return { ...caseDraft, settings: remainingSettings };
  }
  return {
    ...caseDraft,
    settings: {
      ...caseDraft.settings,
      accessibility: copyAccessibilitySettings(accessibility),
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

/*
Moves one case reference to another valid position without changing the source draft.
---
Inputs: A plan draft, source reference index, and destination reference index.
---
Output: A draft with reordered references, or an unchanged-copy for an invalid move.
*/
export function moveCaseReference(plan: PlanDraft, fromIndex: number, toIndex: number): PlanDraft {
  if (fromIndex < 0 || fromIndex >= plan.cases.length || toIndex < 0 || toIndex >= plan.cases.length) {
    return { ...plan, cases: [...plan.cases] };
  }
  const cases = [...plan.cases];
  const [caseReference] = cases.splice(fromIndex, 1);
  if (caseReference === undefined) {
    return { ...plan, cases: [...plan.cases] };
  }
  cases.splice(toIndex, 0, caseReference);
  return { ...plan, cases };
}

/*
Moves one step to another valid position without changing the source list.
---
Inputs: A step list, source index, and destination index.
---
Output: A reordered copy, or an unchanged copy for an invalid move.
*/
export function moveCaseStep(steps: unknown[], fromIndex: number, toIndex: number): unknown[] {
  if (fromIndex < 0 || fromIndex >= steps.length || toIndex < 0 || toIndex >= steps.length) {
    return [...steps];
  }
  const reordered = [...steps];
  const [step] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, step);
  return reordered;
}
