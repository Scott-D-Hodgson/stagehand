<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import AppHeader from './components/AppHeader.vue'
import ConflictResolutionModal from './components/dialogs/ConflictResolutionModal.vue';
import PlanBundle from './components/PlanBundle.vue'
import RecoveryGate from './components/RecoveryGate.vue'
import { copyEditorBundleDraft, createBundledEditorDraft, createEmptyEditorDraft, type EditorBundleDraft } from './document/plan-draft'
import { saveInterfaceLanguage } from './localization/preferences'
import { type InterfaceLanguage } from './localization/resources'
import {
  parseThemePreference,
  resolveTheme,
  themePreferenceStorageKey,
  type ResolvedTheme,
  type ThemePreference,
} from './preferences/theme'
import { createDraftRecoveryRecord, createIndexedDbDraftStorage, type DraftRecoveryRecord, type DraftStorage } from './recovery/draft-storage'
import { loadRecoveryGateState, type RecoveryGateState } from './recovery/recovery-gate'
import { createAutosaveController, type AutosaveController, type RecoverySaveStatus } from './recovery/autosave'
import type { PreparedPortableBundleExport } from './portable-bundle/export';

const { i18next, t } = useTranslation()
const interfaceLanguage = ref<InterfaceLanguage>(i18next.language as InterfaceLanguage)
const editorDraft = ref(createBundledEditorDraft())
const recoveryState = ref<RecoveryGateState>({ kind: 'loading' })
let draftStorage: DraftStorage | undefined
const recoverySaveStatus = ref<RecoverySaveStatus>('idle')
const recoveryRevision = ref(0)
const recoveryActionPending = ref(false)
const conflictRecord = ref<DraftRecoveryRecord | undefined>()
const exportedDraft = ref<string | undefined>()
const exportDownloadFailed = ref(false)
let autosaveController: AutosaveController | undefined
let skipNextAutosave = false
const saveStatusMessage = computed(() => recoverySaveStatus.value === 'saving'
  ? t('editor.savingLocally')
  : recoverySaveStatus.value === 'saved'
    ? t('editor.savedLocally')
    : recoverySaveStatus.value === 'failed'
      ? t('editor.saveFailed')
      : t('editor.localSaveIdle'));
const exportStatusMessage = computed(() => {
  if (exportDownloadFailed.value) {
    return t('editor.exportDownloadFailed');
  }
  if (exportedDraft.value === JSON.stringify(editorDraft.value)) {
    return t('editor.noUnexportedChanges');
  }
  return t('editor.changesNotExported');
});

/*
Reads a saved theme preference without making storage availability mandatory.
---
Inputs: The browser local-storage preference value.
---
Output: A supported preference or the System default.
*/
function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(themePreferenceStorageKey))
  } catch {
    return 'system'
  }
}

/*
Reads the browser's current colour-scheme preference.
---
Inputs: The browser colour-scheme media query.
---
Output: The matching light or dark theme.
*/
function readSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themePreference = ref<ThemePreference>(readThemePreference())
const systemTheme = ref<ResolvedTheme>(readSystemTheme())
const resolvedTheme = computed(() => resolveTheme(themePreference.value, systemTheme.value === 'dark'))
let colourSchemeQuery: MediaQueryList | undefined

/*
Applies a changed browser colour-scheme preference when System is selected.
---
Inputs: A browser media-query change event.
---
Output: Updates the reactive system theme.
*/
function updateSystemTheme(event: MediaQueryListEvent): void {
  systemTheme.value = event.matches ? 'dark' : 'light'
}

/*
Stores an explicit theme preference or removes the System default override.
---
Inputs: The preference selected in the editor.
---
Output: A best-effort local preference update.
*/
function saveThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(themePreferenceStorageKey)
      return
    }
    window.localStorage.setItem(themePreferenceStorageKey, preference)
  } catch {
    // Theme preference is optional when browser storage is unavailable.
  }
}

/*
Loads local recovery before making the editable plan available.
---
Inputs: The browser's IndexedDB availability and stored recovery record.
---
Output: A non-destructive recovery-gate state.
*/
async function initialiseRecovery(): Promise<void> {
  try {
    draftStorage = createIndexedDbDraftStorage()
    recoveryState.value = await loadRecoveryGateState(draftStorage)
  } catch {
    recoveryState.value = { kind: 'unavailable' }
  }
}

/*
Restores the accepted browser-local draft into the editor.
---
Inputs: A readable recovery-gate state.
---
Output: The recovered draft becomes the active plan.
*/
function restoreRecovery(): void {
  if (recoveryState.value.kind !== 'restore-or-discard') {
    return
  }
  editorDraft.value = recoveryState.value.draft
  recoveryRevision.value = recoveryState.value.revision
  recoveryState.value = { kind: 'ready' }
}

/*
Discards a stored recovery record only after the user requests it.
---
Inputs: A discard action from the recovery gate.
---
Output: The editor opens only after successful local deletion.
*/
async function discardRecovery(): Promise<void> {
  if (draftStorage === undefined || recoveryActionPending.value) {
    return
  }
  recoveryActionPending.value = true
  try {
    const expected = recoveryState.value.kind === 'restore-or-discard' ? { revision: recoveryState.value.revision, savedAt: recoveryState.value.savedAt } : undefined
    const result = await draftStorage.discard(expected)
    if (result.kind === 'conflict') {
      recoveryState.value = await loadRecoveryGateState(draftStorage)
      return
    }
    recoveryState.value = { kind: 'ready' }
  } catch {
    recoveryState.value = { kind: 'unavailable' }
  } finally {
    recoveryActionPending.value = false
  }
}

/*
Continues with the in-memory sample when browser recovery is unavailable.
---
Inputs: An acknowledgement of unavailable browser storage.
---
Output: The editor opens without a recovery snapshot.
*/
function continueWithoutRecovery(): void {
  recoveryState.value = { kind: 'ready' }
}

/*
Replaces the active editor bundle with a new empty plan.
---
Inputs: A confirmed plan identifier.
---
Output: A new recoverable editor bundle using the current saved revision.
*/
function createNewPlan(id: string): void {
  editorDraft.value = createEmptyEditorDraft(id);
}

/*
Replaces editor state with a validated portable bundle selected by the author.
---
Inputs: A plan/case bundle that has passed portable archive validation.
---
Output: One detached active editor draft for the existing autosave flow.
*/
function importEditorBundle(bundle: EditorBundleDraft): void {
  editorDraft.value = copyEditorBundleDraft(bundle);
}

/*
Starts a browser download for an already validated portable ZIP bundle.
---
Inputs: ZIP bytes and their plan-derived portable filename.
---
Output: An export-status update after the browser download request succeeds or fails.
*/
function downloadPortableBundle(bundle: PreparedPortableBundleExport): void {
  try {
    const contents = bundle.bytes.buffer.slice(bundle.bytes.byteOffset, bundle.bytes.byteOffset + bundle.bytes.byteLength) as ArrayBuffer;
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/zip' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = bundle.filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    exportedDraft.value = JSON.stringify(editorDraft.value);
    exportDownloadFailed.value = false;
  } catch {
    exportDownloadFailed.value = true;
  }
}

/*
Starts autosave only after recovery has been resolved for this editor session.
---
Inputs: The resolved recovery-gate state and an available storage boundary.
---
Output: A controller that reports local-save status for future plan changes.
*/
function startAutosave(): void {
  if (autosaveController !== undefined || draftStorage === undefined) {
    return
  }
  autosaveController = createAutosaveController({
    delayMs: 1000,
    onRevision: (revision) => { recoveryRevision.value = revision },
    onConflict: (record) => { conflictRecord.value = record },
    onStatus: (status) => { recoverySaveStatus.value = status },
    storage: draftStorage,
  })
}

/*
Adopts the newer saved draft after the user resolves a tab conflict.
---
Inputs: The stored draft attached to the detected recovery conflict.
---
Output: A resumed autosave controller using the newer saved revision.
*/
function discardLocalEdits(): void {
  if (conflictRecord.value === undefined) {
    return;
  }
  skipNextAutosave = true;
  editorDraft.value = copyEditorBundleDraft(conflictRecord.value.draft);
  recoveryRevision.value = conflictRecord.value.revision;
  conflictRecord.value = undefined;
  autosaveController?.resume();
}

/*
Replaces the newer saved draft with paused local edits after confirmation.
---
Inputs: The stored conflict revision and the current editor draft.
---
Output: A resumed autosave controller with a newly saved local revision.
*/
async function replaceSavedDraft(): Promise<void> {
  if (draftStorage === undefined || conflictRecord.value === undefined) {
    return;
  }
  const record = createDraftRecoveryRecord({ draft: copyEditorBundleDraft(editorDraft.value), revision: conflictRecord.value.revision + 1, savedAt: new Date().toISOString() });
  const result = await draftStorage.save(record, conflictRecord.value.revision);
  if (result.kind === 'saved') {
    recoveryRevision.value = result.revision;
    conflictRecord.value = undefined;
    autosaveController?.resume();
  } else {
    conflictRecord.value = result.record;
  }
}

onMounted(() => {
  colourSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.value = colourSchemeQuery.matches ? 'dark' : 'light'
  colourSchemeQuery.addEventListener('change', updateSystemTheme)
  void initialiseRecovery()
})

onBeforeUnmount(() => {
  colourSchemeQuery?.removeEventListener('change', updateSystemTheme)
  autosaveController?.stop()
})

watch(themePreference, saveThemePreference)
watch(recoveryState, (state) => {
  if (state.kind === 'ready') {
    startAutosave()
  }
})
watch(editorDraft, (draft) => {
  if (skipNextAutosave) {
    skipNextAutosave = false
    return
  }
  autosaveController?.schedule(copyEditorBundleDraft(draft), recoveryRevision.value)
}, { deep: true })
watch(interfaceLanguage, (language) => {
  saveInterfaceLanguage(language)
  document.documentElement.lang = language
  void i18next.changeLanguage(language)
}, { immediate: true })
watch(resolvedTheme, (theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme)
}, { immediate: true })
</script>

<template>
  <div class="min-vh-100 bg-body">
    <AppHeader v-model:interface-language="interfaceLanguage" v-model:theme-preference="themePreference" />
    <main class="container-fluid px-4 py-4 pb-5">
      <RecoveryGate v-if="recoveryState.kind !== 'ready'" :pending="recoveryActionPending" :state="recoveryState" @continue="continueWithoutRecovery" @discard="discardRecovery" @restore="restoreRecovery" />
      <template v-else>
        <PlanBundle v-model:case-drafts="editorDraft.cases" v-model:plan="editorDraft.plan" @export="downloadPortableBundle" @import-bundle="importEditorBundle" @new-plan="createNewPlan" />
        <ConflictResolutionModal v-if="conflictRecord" :key="conflictRecord.revision" :discard-label="t('editor.discardLocalEdits')" :message="t('editor.conflictDetected')" :replace-label="t('editor.replaceSavedDraft')" :title="t('editor.conflictTitle')" @discard="discardLocalEdits" @replace="replaceSavedDraft" />
      </template>
    </main>
    <footer class="fixed-bottom border-top bg-body-tertiary px-4 py-2 text-body-secondary" aria-live="polite">
      <div class="d-flex flex-wrap gap-3">
        <span>{{ exportStatusMessage }}</span>
        <span>{{ saveStatusMessage }}</span>
      </div>
    </footer>
  </div>
</template>
