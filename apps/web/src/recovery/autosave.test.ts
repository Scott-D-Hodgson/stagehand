import { describe, expect, it, vi } from 'vitest'
import { createBundledPlanDraft, updatePlanLocale } from '../document/plan-draft'
import type { DraftStorage } from './draft-storage'
import { createAutosaveController } from './autosave'

describe('autosave controller', () => {
  it('saves the latest raw draft after one delay and reports success', async () => {
    vi.useFakeTimers()
    const savedRecords: Parameters<DraftStorage['save']>[0][] = []
    const save: DraftStorage['save'] = async (record) => { savedRecords.push(record); return { kind: 'saved', revision: record.revision } }
    const statuses: string[] = []
    const controller = createAutosaveController({ delayMs: 1000, onConflict: () => {}, onRevision: () => {}, onStatus: (status) => statuses.push(status), storage: { discard: async () => ({ kind: 'discarded' }), load: async () => ({ kind: 'absent' }), save } satisfies DraftStorage })
    controller.schedule(createBundledPlanDraft(), 0)
    controller.schedule(updatePlanLocale(createBundledPlanDraft(), 'not a locale'), 0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(savedRecords).toHaveLength(1)
    expect(savedRecords[0]?.draft.defaults.locale).toBe('not a locale')
    expect(statuses).toEqual(['saving', 'saved'])
    vi.useRealTimers()
  })
})
