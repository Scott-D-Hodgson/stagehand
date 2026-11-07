import type { PlanDraft } from '../document/plan-draft'

const databaseVersion = 1
const recoveryRecordVersion = 1
const recoveryStoreName = 'drafts'
const activeDraftKey = 'active-plan'

export interface DraftRecoveryRecord {
  formatVersion: typeof recoveryRecordVersion
  draft: PlanDraft
  revision: number
  savedAt: string
}

export type DraftRecoveryLoadResult =
  | { kind: 'absent' }
  | { kind: 'available'; record: DraftRecoveryRecord }
  | { kind: 'unreadable' }

export interface DraftStorage {
  discard(): Promise<void>
  load(): Promise<DraftRecoveryLoadResult>
  save(record: DraftRecoveryRecord): Promise<void>
}

export interface CreateDraftRecoveryRecordOptions {
  draft: PlanDraft
  revision: number
  savedAt: string
}

export interface CreateIndexedDbDraftStorageOptions {
  databaseName?: string
  indexedDb?: IDBFactory | null
}

interface StoredDraftRecoveryRecord extends DraftRecoveryRecord {
  key: typeof activeDraftKey
}

export class DraftStorageUnavailableError extends Error {
  constructor() {
    super('IndexedDB is unavailable for draft recovery.')
    this.name = 'DraftStorageUnavailableError'
  }
}

/*
Creates a versioned recovery record without changing the editable draft.
---
Inputs: A draft, its expected saved revision, and an ISO 8601 saved time.
---
Output: A recovery record ready for browser-local storage.
*/
export function createDraftRecoveryRecord(options: CreateDraftRecoveryRecordOptions): DraftRecoveryRecord {
  return {
    formatVersion: recoveryRecordVersion,
    draft: options.draft,
    revision: options.revision,
    savedAt: options.savedAt,
  }
}

/*
Creates one browser-local storage boundary for the active editor draft.
---
Inputs: An optional IndexedDB factory and database name for the browser or a test.
---
Output: Asynchronous load, save, and discard operations for one recovery record.
*/
export function createIndexedDbDraftStorage(options: CreateIndexedDbDraftStorageOptions = {}): DraftStorage {
  const indexedDb = options.indexedDb === undefined ? globalThis.indexedDB : options.indexedDb
  const databaseName = options.databaseName ?? 'stagehand-editor-recovery'
  if (indexedDb === undefined || indexedDb === null) {
    throw new DraftStorageUnavailableError()
  }
  return {
    async discard(): Promise<void> {
      const database = await openDatabase(indexedDb, databaseName)
      try {
        const transaction = database.transaction(recoveryStoreName, 'readwrite')
        const completion = completeTransaction(transaction)
        transaction.objectStore(recoveryStoreName).delete(activeDraftKey)
        await completion
      } finally {
        database.close()
      }
    },
    async load(): Promise<DraftRecoveryLoadResult> {
      const database = await openDatabase(indexedDb, databaseName)
      try {
        const transaction = database.transaction(recoveryStoreName, 'readonly')
        const completion = completeTransaction(transaction)
        const request = transaction.objectStore(recoveryStoreName).get(activeDraftKey)
        const storedRecord = await completeRequest<unknown>(request)
        await completion
        if (storedRecord === undefined) {
          return { kind: 'absent' }
        }
        if (!isDraftRecoveryRecord(storedRecord)) {
          return { kind: 'unreadable' }
        }
        return { kind: 'available', record: toDraftRecoveryRecord(storedRecord) }
      } finally {
        database.close()
      }
    },
    async save(record: DraftRecoveryRecord): Promise<void> {
      const database = await openDatabase(indexedDb, databaseName)
      try {
        const transaction = database.transaction(recoveryStoreName, 'readwrite')
        const completion = completeTransaction(transaction)
        const storedRecord: StoredDraftRecoveryRecord = { ...record, key: activeDraftKey }
        transaction.objectStore(recoveryStoreName).put(storedRecord)
        await completion
      } finally {
        database.close()
      }
    },
  }
}

/*
Identifies a supported recovery record without changing unknown stored data.
---
Inputs: A value read from IndexedDB.
---
Output: Whether the value can safely be treated as the v1 recovery record.
*/
function isDraftRecoveryRecord(value: unknown): value is DraftRecoveryRecord {
  if (!isRecord(value) || value.formatVersion !== recoveryRecordVersion || !isRecord(value.draft)) {
    return false
  }
  if (typeof value.revision !== 'number' || typeof value.savedAt !== 'string') {
    return false
  }
  const draft = value.draft
  return typeof draft.id === 'string'
    && draft.version === 1
    && isRecord(draft.defaults)
    && typeof draft.defaults.locale === 'string'
    && Array.isArray(draft.cases)
    && draft.cases.every((caseReference) => isRecord(caseReference) && typeof caseReference.path === 'string')
    && Number.isSafeInteger(value.revision)
    && value.revision >= 0
    && !Number.isNaN(Date.parse(value.savedAt))
}

/*
Removes IndexedDB's internal key before returning a record to the editor.
---
Inputs: A validated stored recovery record.
---
Output: The public recovery-record shape without storage metadata.
*/
function toDraftRecoveryRecord(record: DraftRecoveryRecord): DraftRecoveryRecord {
  return {
    draft: record.draft,
    formatVersion: record.formatVersion,
    revision: record.revision,
    savedAt: record.savedAt,
  }
}

/*
Opens the recovery database and creates its only object store when needed.
---
Inputs: An IndexedDB factory and database name.
---
Output: An open database with the recovery store available.
*/
function openDatabase(indexedDb: IDBFactory, databaseName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(databaseName, databaseVersion)
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('upgradeneeded', () => {
      const database = request.result
      if (!database.objectStoreNames.contains(recoveryStoreName)) {
        database.createObjectStore(recoveryStoreName, { keyPath: 'key' })
      }
    })
  })
}

/*
Waits for an IndexedDB request and preserves its browser-provided error.
---
Inputs: An IndexedDB request with a result value.
---
Output: The request result after success.
*/
function completeRequest<Result>(request: IDBRequest<Result>): Promise<Result> {
  return new Promise((resolve, reject) => {
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('success', () => resolve(request.result))
  })
}

/*
Waits for an IndexedDB transaction to commit or abort.
---
Inputs: An active IndexedDB transaction.
---
Output: Completion after commit or a rejection carrying the transaction error.
*/
function completeTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener('abort', () => reject(transaction.error))
    transaction.addEventListener('complete', () => resolve())
    transaction.addEventListener('error', () => reject(transaction.error))
  })
}

/*
Checks that a value is an object record before reading its properties.
---
Inputs: An unknown value.
---
Output: Whether the value is a non-null object record.
*/
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
