import { describe, expect, it } from 'vitest';
import { addCaseReference, copyEditorBundleDraft, copyPlanDraft, createBundledEditorDraft, createBundledPlanDraft, createEmptyEditorDraft, moveCaseReference, moveCaseStep, removeCaseReference, updateCaseAccessibilitySettings, updateCaseAssertionSoft, updateCaseBrowserSettings, updateCaseInteractionScrollIntoView, updateCaseReference, updateCaseStepTimeout, updateCaseStepWaitList, updateCaseTimeout, updatePlanAccessibilitySettings, updatePlanBrowserSettings, updatePlanLocale, updatePlanTimeout } from './plan-draft';

describe('plan draft', () => {
  it('creates a fresh bundled plan with its case reference', () => {
    expect(createBundledPlanDraft()).toEqual({
      version: 1,
      id: 'editor-foundation',
      defaults: {
        accessibility: { enabled: false, failOnViolation: false },
        browser: {
          headless: true,
          timeZone: 'America/Toronto',
          viewport: { height: 720, width: 1280 },
        },
        locale: 'en-CA',
      },
      cases: [{ path: 'cases/landing-page.json' }],
    });
  });

  it('preserves unrelated plan data and raw invalid locale input', () => {
    const draft = createBundledPlanDraft();
    const updated = updatePlanLocale(draft, 'not a locale');
    expect(updated.defaults.locale).toBe('not a locale');
    expect(updated.id).toBe(draft.id);
    expect(updated.cases).toEqual(draft.cases);
    expect(draft.defaults.locale).toBe('en-CA');
  });

  it('updates plan browser defaults without changing the source draft', () => {
    const draft = createBundledPlanDraft();
    const updated = updatePlanBrowserSettings(draft, { headless: false, timeZone: 'UTC', viewport: { height: 1080, width: 1920 } });
    expect(updated.defaults.browser).toEqual({ headless: false, timeZone: 'UTC', viewport: { height: 1080, width: 1920 } });
    expect(draft.defaults.browser).toEqual({ headless: true, timeZone: 'America/Toronto', viewport: { height: 720, width: 1280 } });
  });

  it('updates the plan-wide step timeout without changing the source draft', () => {
    const draft = createBundledPlanDraft();
    const updated = updatePlanTimeout(draft, 5_000);
    expect(updated.defaults.timeout).toBe(5_000);
    expect(updatePlanTimeout(updated, undefined).defaults.timeout).toBeUndefined();
    expect(draft.defaults.timeout).toBeUndefined();
  });

  it('updates plan accessibility defaults without changing the source draft', () => {
    const draft = createBundledPlanDraft();
    const updated = updatePlanAccessibilitySettings(draft, { enabled: true, failOnViolation: true });
    expect(updated.defaults.accessibility).toEqual({ enabled: true, failOnViolation: true });
    expect(draft.defaults.accessibility).toEqual({ enabled: false, failOnViolation: false });
  });

  it('adds and clears an independent case browser override', () => {
    const caseDraft = createBundledEditorDraft().cases['cases/landing-page.json']!;
    const updated = updateCaseBrowserSettings(caseDraft, { timeZone: 'UTC', viewport: { height: 1080, width: 1920 } });
    const cleared = updateCaseBrowserSettings(updated, undefined);
    expect(updated.settings).toEqual({ browser: { timeZone: 'UTC', viewport: { height: 1080, width: 1920 } } });
    expect(cleared.settings).toBeUndefined();
    expect(caseDraft.settings).toBeUndefined();
  });

  it('adds and clears an independent case timeout override', () => {
    const caseDraft = createBundledEditorDraft().cases['cases/landing-page.json']!;
    const updated = updateCaseTimeout(caseDraft, 5_000);
    const cleared = updateCaseTimeout(updated, undefined);
    expect(updated.settings).toEqual({ timeout: 5_000 });
    expect(cleared.settings).toBeUndefined();
    expect(caseDraft.settings).toBeUndefined();
  });

  it('retains unrelated case settings when clearing a browser override', () => {
    const caseDraft = { ...createBundledEditorDraft().cases['cases/landing-page.json']!, settings: { accessibility: { enabled: false }, browser: { timeZone: 'UTC' } } };
    expect(updateCaseBrowserSettings(caseDraft, undefined).settings).toEqual({ accessibility: { enabled: false } });
  });

  it('adds and clears an accessibility override without changing browser settings', () => {
    const caseDraft = { ...createBundledEditorDraft().cases['cases/landing-page.json']!, settings: { browser: { timeZone: 'UTC' } } };
    const updated = updateCaseAccessibilitySettings(caseDraft, { enabled: true, failOnViolation: false });
    const cleared = updateCaseAccessibilitySettings(updated, undefined);
    expect(updated.settings).toEqual({ accessibility: { enabled: true, failOnViolation: false }, browser: { timeZone: 'UTC' } });
    expect(cleared.settings).toEqual({ browser: { timeZone: 'UTC' } });
  });

  it('copies accessibility rule tags without sharing the selected array', () => {
    const draft = updatePlanAccessibilitySettings(createBundledPlanDraft(), { enabled: true, tags: ['wcag2a'] });
    const snapshot = copyPlanDraft(draft);
    snapshot.defaults.accessibility!.tags!.push('wcag2aa');
    expect(draft.defaults.accessibility!.tags).toEqual(['wcag2a']);
  });

  it('creates an independent plain snapshot for local recovery', () => {
    const draft = createBundledPlanDraft();
    const snapshot = copyPlanDraft(draft);
    snapshot.defaults.locale = 'fr-CA';
    snapshot.cases[0]!.path = 'cases/changed.json';
    expect(draft).toEqual(createBundledPlanDraft());
  });

  it('creates an independent plan and case-document bundle', () => {
    const draft = createBundledEditorDraft();
    const snapshot = copyEditorBundleDraft(draft);
    snapshot.plan.defaults.locale = 'fr-CA';
    snapshot.cases['cases/landing-page.json']!.id = 'changed';
    expect(draft).toEqual(createBundledEditorDraft());
  });

  it('copies plan defaults and case browser overrides into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.settings = { browser: { timeZone: 'UTC', viewport: { height: 1080, width: 1920 } } };
    const snapshot = copyEditorBundleDraft(draft);
    snapshot.plan.defaults.browser!.viewport!.width = 1440;
    (snapshot.cases['cases/landing-page.json']!.settings!.browser as { viewport: { width: number } }).viewport.width = 1440;
    expect(draft.plan.defaults.browser!.viewport!.width).toBe(1280);
    expect((draft.cases['cases/landing-page.json']!.settings!.browser as { viewport: { width: number } }).viewport.width).toBe(1920);
  });

  it('copies nested Click locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'click', locator: { name: 'Continue', role: 'button' } }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string } }).locator.name = 'Changed';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'click', locator: { name: 'Continue', role: 'button' } }]);
  });

  it('copies Type text and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'type', locator: { name: 'Email', role: 'textbox' }, text: 'author@example.com' }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string }; text: string }).locator.name = 'Changed';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { text: string }).text = 'changed@example.com';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'type', locator: { name: 'Email', role: 'textbox' }, text: 'author@example.com' }]);
  });

  it('copies Fill value and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'fill', locator: { name: 'Email', role: 'textbox' }, value: 'author@example.com' }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string }; value: string }).locator.name = 'Changed';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { value: string }).value = 'changed@example.com';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'fill', locator: { name: 'Email', role: 'textbox' }, value: 'author@example.com' }]);
  });

  it('copies Select option label and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'selectOption', label: 'Canada', locator: { name: 'Country', role: 'combobox' } }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { label: string; locator: { name: string } }).label = 'France';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string } }).locator.name = 'Changed';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'selectOption', label: 'Canada', locator: { name: 'Country', role: 'combobox' } }]);
  });

  it('copies Assert text expected locale overrides and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'assertText', expected: { default: 'Welcome', locales: { 'fr-CA': 'Bienvenue' } }, locator: { name: 'Welcome', role: 'heading' } }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { expected: { default: string; locales: Record<string, string> }; locator: { name: string } }).expected.locales['fr-CA'] = 'Bonjour';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string } }).locator.name = 'Changed';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'assertText', expected: { default: 'Welcome', locales: { 'fr-CA': 'Bienvenue' } }, locator: { name: 'Welcome', role: 'heading' } }]);
  });

  it('copies Assert HTML expected locale overrides and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'assertHtml', expected: { default: '<strong>Welcome</strong>', locales: { 'fr-CA': '<strong>Bienvenue</strong>' } }, locator: { name: 'Welcome', role: 'heading' } }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { expected: { default: string; locales: Record<string, string> }; locator: { name: string } }).expected.locales['fr-CA'] = '<em>Bonjour</em>';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string } }).locator.name = 'Changed';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'assertHtml', expected: { default: '<strong>Welcome</strong>', locales: { 'fr-CA': '<strong>Bienvenue</strong>' } }, locator: { name: 'Welcome', role: 'heading' } }]);
  });

  it('copies Assert value expected locale overrides and nested locator data into an independent recovery snapshot', () => {
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'assertValue', expected: { default: 'author@example.com', locales: { 'fr-CA': 'auteur@example.com' } }, locator: { name: 'Email', role: 'textbox' } }];
    const snapshot = copyEditorBundleDraft(draft);
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { expected: { default: string; locales: Record<string, string> }; locator: { name: string } }).expected.locales['fr-CA'] = 'modifie@example.com';
    (snapshot.cases['cases/landing-page.json']!.steps[0] as { locator: { name: string } }).locator.name = 'Changed';
    expect(draft.cases['cases/landing-page.json']!.steps).toEqual([{ action: 'assertValue', expected: { default: 'author@example.com', locales: { 'fr-CA': 'auteur@example.com' } }, locator: { name: 'Email', role: 'textbox' } }]);
  });

  it('creates a new empty plan bundle with the supplied identifier', () => {
    expect(createEmptyEditorDraft('new-plan')).toEqual({
      cases: {},
      plan: {
        cases: [],
        defaults: {
          accessibility: { enabled: false, failOnViolation: false },
          browser: {
            headless: true,
            timeZone: 'America/Toronto',
            viewport: { height: 720, width: 1280 },
          },
          locale: 'en-CA',
        },
        id: 'new-plan',
        version: 1,
      },
    });
  });

  it('adds, updates, and removes case references without mutating the source', () => {
    const draft = createBundledPlanDraft();
    const added = addCaseReference(draft, '');
    const updated = updateCaseReference(added, 1, 'cases/second.json');
    expect(removeCaseReference(updated, 0).cases).toEqual([{ path: 'cases/second.json' }]);
    expect(draft.cases).toEqual([{ path: 'cases/landing-page.json' }]);
  });

  it('moves a case step without changing the source list', () => {
    const steps = [{ action: 'navigate', url: 'https://example.com' }, { action: 'click', locator: { role: 'button' } }];
    expect(moveCaseStep(steps, 1, 0)).toEqual([{ action: 'click', locator: { role: 'button' } }, { action: 'navigate', url: 'https://example.com' }]);
    expect(moveCaseStep(steps, 0, 2)).toEqual(steps);
    expect(steps).toEqual([{ action: 'navigate', url: 'https://example.com' }, { action: 'click', locator: { role: 'button' } }]);
  });

  it('updates and clears a case step timeout without changing the source list', () => {
    const steps = [{ action: 'navigate', url: 'https://example.com' }, { action: 'click', locator: { role: 'button' } }];
    const withTimeout = updateCaseStepTimeout(steps, 0, 5_000);
    expect(withTimeout).toEqual([{ action: 'navigate', url: 'https://example.com', timeout: 5_000 }, { action: 'click', locator: { role: 'button' } }]);
    expect(updateCaseStepTimeout(withTimeout, 0, '')).toEqual(steps);
    expect(steps).toEqual([{ action: 'navigate', url: 'https://example.com' }, { action: 'click', locator: { role: 'button' } }]);
  });

  it('updates assertion soft behaviour without storing the hard default', () => {
    const steps = [
      { action: 'assertText', expected: { default: 'Welcome' }, locator: { role: 'heading' } },
      { action: 'assertHtml', expected: { default: '<h1>Welcome</h1>' }, locator: { role: 'heading' }, soft: true },
      { action: 'assertValue', expected: { default: 'author@example.com' }, locator: { role: 'textbox' }, soft: true },
      { action: 'navigate', url: 'https://example.com' },
    ];
    const softText = updateCaseAssertionSoft(steps, 0, true);
    const hardHtml = updateCaseAssertionSoft(softText, 1, false);
    expect(hardHtml).toEqual([
      { action: 'assertText', expected: { default: 'Welcome' }, locator: { role: 'heading' }, soft: true },
      { action: 'assertHtml', expected: { default: '<h1>Welcome</h1>' }, locator: { role: 'heading' } },
      { action: 'assertValue', expected: { default: 'author@example.com' }, locator: { role: 'textbox' }, soft: true },
      { action: 'navigate', url: 'https://example.com' },
    ]);
    expect(updateCaseAssertionSoft(hardHtml, 3, true)).toEqual(hardHtml);
    expect(steps).toEqual([
      { action: 'assertText', expected: { default: 'Welcome' }, locator: { role: 'heading' } },
      { action: 'assertHtml', expected: { default: '<h1>Welcome</h1>' }, locator: { role: 'heading' }, soft: true },
      { action: 'assertValue', expected: { default: 'author@example.com' }, locator: { role: 'textbox' }, soft: true },
      { action: 'navigate', url: 'https://example.com' },
    ]);
  });

  it('updates interaction scrolling without storing the enabled default', () => {
    const steps = [{ action: 'click', locator: { role: 'button' } }, { action: 'fill', locator: { role: 'textbox' }, value: 'Name' }, { action: 'selectOption', label: 'Canada', locator: { role: 'combobox' } }, { action: 'type', locator: { role: 'textbox' }, text: 'Name' }, { action: 'navigate', url: 'https://example.com' }];
    const disabled = updateCaseInteractionScrollIntoView(steps, 1, false);
    expect(disabled[1]).toEqual({ action: 'fill', locator: { role: 'textbox' }, scrollIntoView: false, value: 'Name' });
    expect(updateCaseInteractionScrollIntoView(disabled, 1, true)).toEqual(steps);
    expect(updateCaseInteractionScrollIntoView(steps, 4, false)).toEqual(steps);
    expect(steps[1]).toEqual({ action: 'fill', locator: { role: 'textbox' }, value: 'Name' });
  });

  it('updates and clears a wait list on every waitable step without changing its source data', () => {
    const steps = [{ action: 'click', after: [{ delay: 20 }], locator: { role: 'button' } }, { action: 'navigate', url: 'https://example.com' }, { action: 'assertText', expected: { default: 'Welcome' }, locator: { role: 'heading' } }, { action: 'assertHtml', expected: { default: '<h1>Welcome</h1>' }, locator: { role: 'main' } }, { action: 'assertValue', expected: { default: 'tester@example.test' }, locator: { role: 'textbox' } }];
    const before = [{ timeout: 2_000, waitFor: { name: 'Continue', role: 'button' } }];
    const updated = updateCaseStepWaitList(steps, 0, 'before', before);
    expect(updated).toEqual([{ action: 'click', after: [{ delay: 20 }], before, locator: { role: 'button' } }, ...steps.slice(1)]);
    expect(updated[0]).not.toBe(steps[0]);
    expect((updated[0] as { before: unknown[] }).before).not.toBe(before);
    expect(updateCaseStepWaitList(updated, 0, 'before', [])).toEqual(steps);
    for (const index of [1, 2, 3, 4]) {
      expect(updateCaseStepWaitList(steps, index, 'after', [{ delay: 10 }])[index]).toMatchObject({ after: [{ delay: 10 }] });
    }
    expect(steps).toEqual([{ action: 'click', after: [{ delay: 20 }], locator: { role: 'button' } }, { action: 'navigate', url: 'https://example.com' }, { action: 'assertText', expected: { default: 'Welcome' }, locator: { role: 'heading' } }, { action: 'assertHtml', expected: { default: '<h1>Welcome</h1>' }, locator: { role: 'main' } }, { action: 'assertValue', expected: { default: 'tester@example.test' }, locator: { role: 'textbox' } }]);
  });

  it('moves a case reference without changing the source draft', () => {
    const draft = addCaseReference(createBundledPlanDraft(), 'cases/second.json');
    expect(moveCaseReference(draft, 1, 0).cases).toEqual([{ path: 'cases/second.json' }, { path: 'cases/landing-page.json' }]);
    expect(moveCaseReference(draft, 0, 2)).toEqual(draft);
    expect(draft.cases).toEqual([{ path: 'cases/landing-page.json' }, { path: 'cases/second.json' }]);
  });
});
