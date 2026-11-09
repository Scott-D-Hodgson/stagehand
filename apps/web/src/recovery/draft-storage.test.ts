import { IDBFactory } from 'fake-indexeddb'
import { describe, expect, it } from 'vitest'
import { createBundledEditorDraft, createBundledPlanDraft, updatePlanLocale } from '../document/plan-draft'
import {
  createDraftRecoveryRecord,
  createIndexedDbDraftStorage,
  DraftStorageUnavailableError,
} from './draft-storage'

let databaseNumber = 0

/*
Creates isolated IndexedDB-backed storage for one test.
---
Inputs: None.
---
Output: A storage boundary using a new in-memory IndexedDB factory.
*/
function createTestStorage() {
  databaseNumber += 1
  const databaseName = `stagehand-recovery-test-${databaseNumber}`
  const indexedDb = new IDBFactory()
  return {
    databaseName,
    indexedDb,
    storage: createIndexedDbDraftStorage({ databaseName, indexedDb }),
  }
}

/*
Writes an unsupported v2 record directly so the adapter can preserve it.
---
Inputs: An in-memory IndexedDB factory and an isolated database name.
---
Output: Completion after the unsupported record is committed.
*/
function writeUnsupportedRecord(indexedDb: IDBFactory, databaseName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(databaseName, 1)
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('success', () => {
      const database = request.result
      const transaction = database.transaction('drafts', 'readwrite')
      transaction.addEventListener('abort', () => reject(transaction.error))
      transaction.addEventListener('complete', () => {
        database.close()
        resolve()
      })
      transaction.addEventListener('error', () => reject(transaction.error))
      transaction.objectStore('drafts').put({ formatVersion: 2, key: 'active-plan' })
    })
    request.addEventListener('upgradeneeded', () => {
      request.result.createObjectStore('drafts', { keyPath: 'key' })
    })
  })
}

/*
Writes a plan-only recovery record that predates case-document drafts.
---
Inputs: An initialized IndexedDB factory and database name.
---
Output: Completion after the legacy record replaces the active recovery record.
*/
function writeLegacyRecord(indexedDb: IDBFactory, databaseName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(databaseName, 1)
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('success', () => {
      const database = request.result
      const transaction = database.transaction('drafts', 'readwrite')
      transaction.addEventListener('abort', () => reject(transaction.error))
      transaction.addEventListener('complete', () => {
        database.close()
        resolve()
      })
      transaction.addEventListener('error', () => reject(transaction.error))
      transaction.objectStore('drafts').put({ draft: createBundledPlanDraft(), formatVersion: 1, key: 'active-plan', revision: 3, savedAt: '2026-11-08T22:00:00.000Z' })
    })
  })
}

describe('draft recovery storage', () => {
  it('reports an absent recovery record for a new database', async () => {
    const { storage } = createTestStorage()
    await expect(storage.load()).resolves.toEqual({ kind: 'absent' })
  })

  it('saves and reads a raw invalid plan locale without mutating the saved snapshot', async () => {
    const { storage } = createTestStorage()
    const record = createDraftRecoveryRecord({
      draft: { ...createBundledEditorDraft(), plan: updatePlanLocale(createBundledEditorDraft().plan, 'not a locale') },
      revision: 4,
      savedAt: '2026-11-07T20:00:00.000Z',
    })
    await storage.save(record, 0)
    const loaded = await storage.load()
    expect(loaded).toEqual({ kind: 'available', record })
    if (loaded.kind === 'available') {
      loaded.record.draft.plan.defaults.locale = 'changed after load'
    }
    await expect(storage.load()).resolves.toEqual({ kind: 'available', record })
  })

  it('removes the active recovery record only after explicit discard', async () => {
    const { storage } = createTestStorage()
    await storage.save(createDraftRecoveryRecord({
      draft: createBundledEditorDraft(),
      revision: 0,
      savedAt: '2026-11-07T20:00:00.000Z',
    }), 0)
    await storage.discard()
    await expect(storage.load()).resolves.toEqual({ kind: 'absent' })
  })

  it('rejects creation when IndexedDB is unavailable', () => {
    expect(() => createIndexedDbDraftStorage({ indexedDb: null })).toThrow(DraftStorageUnavailableError)
  })

  it('reports an unsupported recovery record as unreadable without discarding it', async () => {
    const { databaseName, indexedDb, storage } = createTestStorage()
    await writeUnsupportedRecord(indexedDb, databaseName)
    await expect(storage.load()).resolves.toEqual({ kind: 'unreadable' })
    await expect(storage.load()).resolves.toEqual({ kind: 'unreadable' })
  })

  it('migrates a legacy plan-only record without losing its case reference', async () => {
    const { databaseName, indexedDb, storage } = createTestStorage()
    await storage.save(createDraftRecoveryRecord({ draft: createBundledEditorDraft(), revision: 1, savedAt: '2026-11-08T21:00:00.000Z' }), 0)
    await writeLegacyRecord(indexedDb, databaseName)
    await expect(storage.load()).resolves.toEqual({
      kind: 'available',
      record: {
        draft: createBundledEditorDraft(),
        formatVersion: 1,
        revision: 3,
        savedAt: '2026-11-08T22:00:00.000Z',
      },
    })
  })

  it('rejects a stale writer without replacing the newer draft', async () => {
    const { databaseName, indexedDb, storage } = createTestStorage()
    const otherStorage = createIndexedDbDraftStorage({ databaseName, indexedDb })
    const first = createDraftRecoveryRecord({ draft: { ...createBundledEditorDraft(), plan: updatePlanLocale(createBundledEditorDraft().plan, 'fr-CA') }, revision: 1, savedAt: '2026-11-07T20:00:00.000Z' })
    const second = createDraftRecoveryRecord({ draft: { ...createBundledEditorDraft(), plan: updatePlanLocale(createBundledEditorDraft().plan, 'de-DE') }, revision: 1, savedAt: '2026-11-07T20:00:01.000Z' })
    await expect(storage.save(first, 0)).resolves.toEqual({ kind: 'saved', revision: 1 })
    await expect(otherStorage.save(second, 0)).resolves.toEqual({ kind: 'conflict', record: first })
    await expect(storage.load()).resolves.toEqual({ kind: 'available', record: first })
  })

  it('rejects a stale discard without deleting the newer draft', async () => {
    const { databaseName, indexedDb, storage } = createTestStorage()
    const otherStorage = createIndexedDbDraftStorage({ databaseName, indexedDb })
    const record = createDraftRecoveryRecord({ draft: createBundledEditorDraft(), revision: 1, savedAt: '2026-11-08T20:00:00.000Z' })
    await storage.save(record, 0)
    await expect(otherStorage.discard({ revision: 0, savedAt: '2026-11-08T19:00:00.000Z' })).resolves.toEqual({ kind: 'conflict', record })
    await expect(storage.load()).resolves.toEqual({ kind: 'available', record })
  })
})
