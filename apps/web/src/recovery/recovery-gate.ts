import type { EditorBundleDraft } from '../document/plan-draft'
import type { DraftStorage } from './draft-storage'

export type RecoveryGateState =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'restore-or-discard'; draft: EditorBundleDraft; revision: number; savedAt: string }
  | { kind: 'unreadable' }
  | { kind: 'unavailable' }

/*
Loads the recovery state needed before the editor can safely begin editing.
---
Inputs: The browser-local draft-storage boundary.
---
Output: A non-destructive startup state for the editor.
*/
export async function loadRecoveryGateState(storage: DraftStorage): Promise<RecoveryGateState> {
  try {
    const result = await storage.load()
    if (result.kind === 'absent') {
      return { kind: 'ready' }
    }
    if (result.kind === 'unreadable') {
      return { kind: 'unreadable' }
    }
    return { kind: 'restore-or-discard', draft: result.record.draft, revision: result.record.revision, savedAt: result.record.savedAt }
  } catch {
    return { kind: 'unavailable' }
  }
}
