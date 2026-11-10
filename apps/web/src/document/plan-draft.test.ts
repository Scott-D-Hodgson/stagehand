import { describe, expect, it } from 'vitest';
import { addCaseReference, copyEditorBundleDraft, copyPlanDraft, createBundledEditorDraft, createBundledPlanDraft, createEmptyEditorDraft, removeCaseReference, updateCaseReference, updatePlanLocale } from './plan-draft';

describe('plan draft', () => {
  it('creates a fresh bundled plan with its case reference', () => {
    expect(createBundledPlanDraft()).toEqual({
      version: 1,
      id: 'editor-foundation',
      defaults: { locale: 'en-CA' },
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

  it('creates a new empty plan bundle with the supplied identifier', () => {
    expect(createEmptyEditorDraft('new-plan')).toEqual({
      cases: {},
      plan: { cases: [], defaults: { locale: 'en-CA' }, id: 'new-plan', version: 1 },
    });
  });

  it('adds, updates, and removes case references without mutating the source', () => {
    const draft = createBundledPlanDraft();
    const added = addCaseReference(draft, '');
    const updated = updateCaseReference(added, 1, 'cases/second.json');
    expect(removeCaseReference(updated, 0).cases).toEqual([{ path: 'cases/second.json' }]);
    expect(draft.cases).toEqual([{ path: 'cases/landing-page.json' }]);
  });
});
