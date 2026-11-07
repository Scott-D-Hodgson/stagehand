import type { PlanDraft } from '../document/plan-draft'
import { createDraftRecoveryRecord, type DraftStorage } from './draft-storage'

export type RecoverySaveStatus = 'idle' | 'saving' | 'saved' | 'failed'

export interface CreateAutosaveControllerOptions {
  delayMs: number
  onRevision: (revision: number) => void
  onStatus: (status: RecoverySaveStatus) => void
  storage: DraftStorage
}

export interface AutosaveController {
  schedule(draft: PlanDraft, revision: number): void
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
  return {
    schedule(draft: PlanDraft, revision: number): void {
      if (stopped) {
        return
      }
      if (timer !== undefined) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        void saveDraft(options, draft, revision)
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
Inputs: Autosave callbacks, a raw plan draft, and its current revision.
---
Output: Completion after saved or failed status has been reported.
*/
async function saveDraft(options: CreateAutosaveControllerOptions, draft: PlanDraft, revision: number): Promise<void> {
  options.onStatus('saving')
  const nextRevision = revision + 1
  try {
    await options.storage.save(createDraftRecoveryRecord({ draft, revision: nextRevision, savedAt: new Date().toISOString() }))
    options.onRevision(nextRevision)
    options.onStatus('saved')
  } catch {
    options.onStatus('failed')
  }
}
