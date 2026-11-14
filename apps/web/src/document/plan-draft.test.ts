import { describe, expect, it } from 'vitest';
import { addCaseReference, copyEditorBundleDraft, copyPlanDraft, createBundledEditorDraft, createBundledPlanDraft, createEmptyEditorDraft, moveCaseReference, moveCaseStep, removeCaseReference, updateCaseBrowserSettings, updateCaseReference, updatePlanBrowserSettings, updatePlanLocale } from './plan-draft';

describe('plan draft', () => {
  it('creates a fresh bundled plan with its case reference', () => {
    expect(createBundledPlanDraft()).toEqual({
      version: 1,
      id: 'editor-foundation',
      defaults: {
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

  it('adds and clears an independent case browser override', () => {
    const caseDraft = createBundledEditorDraft().cases['cases/landing-page.json']!;
    const updated = updateCaseBrowserSettings(caseDraft, { timeZone: 'UTC', viewport: { height: 1080, width: 1920 } });
    const cleared = updateCaseBrowserSettings(updated, undefined);
    expect(updated.settings).toEqual({ browser: { timeZone: 'UTC', viewport: { height: 1080, width: 1920 } } });
    expect(cleared.settings).toBeUndefined();
    expect(caseDraft.settings).toBeUndefined();
  });

  it('retains unrelated case settings when clearing a browser override', () => {
    const caseDraft = { ...createBundledEditorDraft().cases['cases/landing-page.json']!, settings: { accessibility: { enabled: false }, browser: { timeZone: 'UTC' } } };
    expect(updateCaseBrowserSettings(caseDraft, undefined).settings).toEqual({ accessibility: { enabled: false } });
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

  it('moves a case reference without changing the source draft', () => {
    const draft = addCaseReference(createBundledPlanDraft(), 'cases/second.json');
    expect(moveCaseReference(draft, 1, 0).cases).toEqual([{ path: 'cases/second.json' }, { path: 'cases/landing-page.json' }]);
    expect(moveCaseReference(draft, 0, 2)).toEqual(draft);
    expect(draft.cases).toEqual([{ path: 'cases/landing-page.json' }, { path: 'cases/second.json' }]);
  });
});
