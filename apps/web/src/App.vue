<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import AppHeader from './components/AppHeader.vue'
import PlanBundle from './components/PlanBundle.vue'
import RecoveryGate from './components/RecoveryGate.vue'
import { copyPlanDraft, createBundledPlanDraft } from './document/plan-draft'
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

const { i18next, t } = useTranslation()
const interfaceLanguage = ref<InterfaceLanguage>(i18next.language as InterfaceLanguage)
const planDraft = ref(createBundledPlanDraft())
const recoveryState = ref<RecoveryGateState>({ kind: 'loading' })
let draftStorage: DraftStorage | undefined
const recoverySaveStatus = ref<RecoverySaveStatus>('idle')
const recoveryRevision = ref(0)
const recoveryActionPending = ref(false)
const conflictRecord = ref<DraftRecoveryRecord | undefined>()
let autosaveController: AutosaveController | undefined
let skipNextAutosave = false

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
  planDraft.value = recoveryState.value.draft
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

function discardLocalEdits(): void {
  if (conflictRecord.value === undefined) return
  skipNextAutosave = true
  planDraft.value = copyPlanDraft(conflictRecord.value.draft)
  recoveryRevision.value = conflictRecord.value.revision
  conflictRecord.value = undefined
  autosaveController?.resume()
}

async function replaceSavedDraft(): Promise<void> {
  if (draftStorage === undefined || conflictRecord.value === undefined) return
  const record = createDraftRecoveryRecord({ draft: copyPlanDraft(planDraft.value), revision: conflictRecord.value.revision + 1, savedAt: new Date().toISOString() })
  const result = await draftStorage.save(record, conflictRecord.value.revision)
  if (result.kind === 'saved') {
    recoveryRevision.value = result.revision
    conflictRecord.value = undefined
    autosaveController?.resume()
  } else {
    conflictRecord.value = result.record
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
watch(planDraft, (draft) => {
  if (skipNextAutosave) {
    skipNextAutosave = false
    return
  }
  autosaveController?.schedule(copyPlanDraft(draft), recoveryRevision.value)
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
    <main class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-3">{{ t('editor.title') }}</h1>
          <p class="lead">
            {{ t('guidance.neutral.introduction') }}
          </p>
          <RecoveryGate v-if="recoveryState.kind !== 'ready'" :pending="recoveryActionPending" :state="recoveryState" @continue="continueWithoutRecovery" @discard="discardRecovery" @restore="restoreRecovery" />
          <template v-else>
            <PlanBundle v-model:plan="planDraft" />
            <div v-if="conflictRecord" class="alert alert-warning mt-3"><p>{{ t('editor.conflictDetected') }}</p><button class="btn btn-outline-secondary me-2" type="button" @click="discardLocalEdits">{{ t('editor.discardLocalEdits') }}</button><button class="btn btn-warning" type="button" @click="replaceSavedDraft">{{ t('editor.replaceSavedDraft') }}</button></div>
            <p class="mt-3 text-body-secondary" aria-live="polite">{{ recoverySaveStatus === 'saving' ? t('editor.savingLocally') : recoverySaveStatus === 'saved' ? t('editor.savedLocally') : recoverySaveStatus === 'failed' ? t('editor.saveFailed') : '' }}</p>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
