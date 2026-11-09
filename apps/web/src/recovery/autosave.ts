import type { EditorBundleDraft } from '../document/plan-draft'
import { createDraftRecoveryRecord, type DraftRecoveryRecord, type DraftStorage } from './draft-storage'

export type RecoverySaveStatus = 'idle' | 'saving' | 'saved' | 'failed'

export interface CreateAutosaveControllerOptions {
  delayMs: number
  onRevision: (revision: number) => void
  onConflict: (record: DraftRecoveryRecord | undefined) => void
  onStatus: (status: RecoverySaveStatus) => void
  storage: DraftStorage
}

export interface AutosaveController {
  resume(): void
  schedule(draft: EditorBundleDraft, revision: number): void
  stop(): void
}

/*
Creates a debounced browser-local draft saver.
---
Inputs: A storage boundary, delay, and callbacks for save status and revision.
---
Output: A controller that schedules one latest-draft save at a time.
*/
export function createAutosaveController(options: CreateAutosaveControllerOptions): AutosaveController {
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false
  let paused = false
  return {
    resume(): void {
      paused = false
    },
    schedule(draft: EditorBundleDraft, revision: number): void {
      if (stopped || paused) {
        return
      }
      if (timer !== undefined) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        void saveDraft(options, draft, revision, () => { paused = true })
      }, options.delayMs)
    },
    stop(): void {
      stopped = true
      if (timer !== undefined) {
        clearTimeout(timer)
      }
    },
  }
}

/*
Writes one latest draft and reports its resulting local-save state.
---
Inputs: Autosave callbacks, a raw editor bundle, and its current revision.
---
Output: Completion after saved or failed status has been reported.
*/
async function saveDraft(options: CreateAutosaveControllerOptions, draft: EditorBundleDraft, revision: number, pause: () => void): Promise<void> {
  options.onStatus('saving')
  const nextRevision = revision + 1
  try {
    const result = await options.storage.save(createDraftRecoveryRecord({ draft, revision: nextRevision, savedAt: new Date().toISOString() }), revision)
    if (result.kind === 'conflict') {
      pause()
      options.onConflict(result.record)
      options.onStatus('failed')
      return
    }
    options.onRevision(result.revision)
    options.onStatus('saved')
  } catch {
    options.onStatus('failed')
  }
}
