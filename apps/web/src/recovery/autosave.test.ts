import { describe, expect, it, vi } from 'vitest'
import { createBundledEditorDraft, updatePlanLocale } from '../document/plan-draft'
import type { DraftStorage } from './draft-storage'
import { createAutosaveController } from './autosave'

describe('autosave controller', () => {
  it('saves the latest raw draft after one delay and reports success', async () => {
    vi.useFakeTimers()
    const savedRecords: Parameters<DraftStorage['save']>[0][] = []
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision } }
    const statuses: string[] = []
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: (status) => statuses.push(status), storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage })
    controller.schedule(createBundledEditorDraft(), 0)
    controller.schedule({ ...createBundledEditorDraft(), plan: updatePlanLocale(createBundledEditorDraft().plan, 'not a locale') }, 0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(savedRecords).toHaveLength(1)
    expect(savedRecords[0]?.draft.plan.defaults.locale).toBe('not a locale')
    expect(statuses).toEqual(['saving', 'saved'])
    vi.useRealTimers()
  })

  it('saves a changed case identifier with its associated case document', async () => {
    vi.useFakeTimers()
    const savedRecords: Parameters<DraftStorage['save']>[0][] = []
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision } }
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage })
    const draft = createBundledEditorDraft()
    draft.cases['cases/landing-page.json']!.id = 'changed-case'
    controller.schedule(draft, 0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.id).toBe('changed-case')
    vi.useRealTimers()
  })

  it('saves a nested Click locator as plain recovery data', async () => {
    vi.useFakeTimers()
    const savedRecords: Parameters<DraftStorage['save']>[0][] = []
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision } }
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage })
    const draft = createBundledEditorDraft()
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'click', locator: { name: 'Continue', role: 'button' } }]
    controller.schedule(draft, 0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.steps).toEqual([{ action: 'click', locator: { name: 'Continue', role: 'button' } }])
    vi.useRealTimers()
  })

  it('saves a Type step as plain recovery data', async () => {
    vi.useFakeTimers();
    const savedRecords: Parameters<DraftStorage['save']>[0][] = [];
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision }; };
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage });
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'type', locator: { name: 'Email', role: 'textbox' }, text: 'author@example.com' }];
    controller.schedule(draft, 0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.steps).toEqual([{ action: 'type', locator: { name: 'Email', role: 'textbox' }, text: 'author@example.com' }]);
    vi.useRealTimers();
  });

  it('saves a Fill step as plain recovery data', async () => {
    vi.useFakeTimers();
    const savedRecords: Parameters<DraftStorage['save']>[0][] = [];
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision }; };
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage });
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'fill', locator: { name: 'Email', role: 'textbox' }, value: 'author@example.com' }];
    controller.schedule(draft, 0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.steps).toEqual([{ action: 'fill', locator: { name: 'Email', role: 'textbox' }, value: 'author@example.com' }]);
    vi.useRealTimers();
  });

  it('saves a Select option value as plain recovery data', async () => {
    vi.useFakeTimers();
    const savedRecords: Parameters<DraftStorage['save']>[0][] = [];
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision }; };
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage });
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'selectOption', locator: { name: 'Country', role: 'combobox' }, value: 'CA' }];
    controller.schedule(draft, 0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.steps).toEqual([{ action: 'selectOption', locator: { name: 'Country', role: 'combobox' }, value: 'CA' }]);
    vi.useRealTimers();
  });

  it('saves an Assert text step as plain recovery data', async () => {
    vi.useFakeTimers();
    const savedRecords: Parameters<DraftStorage['save']>[0][] = [];
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision }; };
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: () => {}, storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage });
    const draft = createBundledEditorDraft();
    draft.cases['cases/landing-page.json']!.steps = [{ action: 'assertText', expected: { default: 'Welcome' }, locator: { name: 'Welcome', role: 'heading' } }];
    controller.schedule(draft, 0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(savedRecords[0]?.draft.cases['cases/landing-page.json']?.steps).toEqual([{ action: 'assertText', expected: { default: 'Welcome' }, locator: { name: 'Welcome', role: 'heading' } }]);
    vi.useRealTimers();
  });
})
