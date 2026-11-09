import { describe, expect, it } from 'vitest'
import { createBundledEditorDraft } from '../document/plan-draft'
import type { DraftStorage } from './draft-storage'
import { loadRecoveryGateState } from './recovery-gate'

/*
Creates a storage double with the supplied load operation.
---
Inputs: A load operation result or rejection.
---
Output: A draft-storage boundary for recovery-gate tests.
*/
function createStorage(load: DraftStorage['load']): DraftStorage {
  return { discard: async () => ({ kind: 'discarded' }), load, save: async () => ({ kind: 'saved', revision: 0 }) }
}

describe('recovery gate', () => {
  it('continues when no recovery record exists', async () => {
    await expect(loadRecoveryGateState(createStorage(async () => ({ kind: 'absent' })))).resolves.toEqual({ kind: 'ready' })
  })

  it('offers restore or discard for a readable recovery record', async () => {
    const draft = createBundledEditorDraft()
    await expect(loadRecoveryGateState(createStorage(async () => ({ kind: 'available', record: { draft, formatVersion: 1, revision: 2, savedAt: '2026-11-07T20:00:00.000Z' } })))).resolves.toEqual({ kind: 'restore-or-discard', draft, revision: 2, savedAt: '2026-11-07T20:00:00.000Z' })
  })

  it('blocks automatic replacement when recovery data is unreadable', async () => {
    await expect(loadRecoveryGateState(createStorage(async () => ({ kind: 'unreadable' })))).resolves.toEqual({ kind: 'unreadable' })
  })

  it('allows in-memory editing when browser storage cannot be read', async () => {
    await expect(loadRecoveryGateState(createStorage(async () => { throw new Error('blocked') }))).resolves.toEqual({ kind: 'unavailable' })
  })
})
