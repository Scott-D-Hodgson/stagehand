<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { useTranslation } from 'i18next-vue'
import AppHeader from './components/controls/AppHeader.vue'
import HeroPage from './components/pages/HeroPage.vue'
import ConflictResolutionModal from './components/controls/dialogs/ConflictResolutionModal.vue';
import NewPlanDialog from './components/plans/dialogs/NewPlanDialog.vue';
import RecoveryConfirmationModal from './modules/recovery/controls/RecoveryConfirmationModal.vue';
import PlanBundle from './components/plans/PlanBundle.vue'
import RecoveryGate from './modules/recovery/controls/RecoveryGate.vue'
import { copyEditorBundleDraft, createBundledEditorDraft, createEmptyEditorDraft, updatePlanLocale, type EditorBundleDraft } from './services/planDraftService'
import { saveInterfaceLanguage } from './localization/interfaceLanguagePreferenceService'
import { type InterfaceLanguage } from './localization/interfaceLanguageResources'
import {
  readThemePreference,
  resolveTheme,
  saveThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './modules/preferences/themePreferenceService'
import { createDraftRecoveryRecord, createIndexedDbDraftStorage, type DraftRecoveryRecord, type DraftStorage } from './modules/recovery/draftRecoveryStorageService'
import { loadRecoveryGateState, type RecoveryGateState } from './modules/recovery/recoveryGateService'
import { resolveRecoveryRoute } from './modules/recovery/recoveryRouteService';
import { createAutosaveController, type AutosaveController, type RecoverySaveStatus } from './modules/recovery/autosaveService'
import type { PreparedPortableBundleExport } from './modules/portableBundle/exportService';
import { readPortableBundleFile } from './modules/portableBundle/importService';
import ApplyToast from './components/controls/ApplyToast.vue';
import { appliedChangesVisible } from './modules/feedback/applyFeedback';

const { i18next, t } = useTranslation()
const route = useRoute()
const router = useRouter()
const interfaceLanguage = ref<InterfaceLanguage>(i18next.language as InterfaceLanguage)
const editorDraft = ref(createBundledEditorDraft())
const recoveryState = ref<RecoveryGateState>({ kind: 'loading' })
const isPlanOpen = ref(false)
let draftStorage: DraftStorage | undefined
const recoverySaveStatus = ref<RecoverySaveStatus>('idle')
const recoveryRevision = ref(0)
const recoveryActionPending = ref(false)
const conflictRecord = ref<DraftRecoveryRecord | undefined>()
const exportedDraft = ref<string | undefined>()
const exportDownloadFailed = ref(false)
const newPlanDialogOpen = ref(false)
let autosaveController: AutosaveController | undefined
let skipNextAutosave = false

/*
Determines the localized status of IndexedDB draft saving.
---
Inputs: The current recovery-save status.
---
Output: A localized status message for the application footer.
*/
const saveStatusMessage = computed(
  () =>
    recoverySaveStatus.value === 'saving'
      ? t('editor.savingLocally')
      : recoverySaveStatus.value === 'saved'
        ? t('editor.savedLocally')
        : recoverySaveStatus.value === 'failed'
          ? t('editor.saveFailed')
          : t('editor.localSaveIdle')
);

/*
Determines whether the active bundle has been exported successfully.
---
Inputs: The current editor draft and most recently exported draft snapshot.
---
Output: A localized export-status message for the application footer.
*/
const exportStatusMessage = computed(
  () => {
    if (exportDownloadFailed.value) {
      return t('editor.exportDownloadFailed');
    }
    if (exportedDraft.value === JSON.stringify(editorDraft.value)) {
      return t('editor.noUnexportedChanges');
    }
    return t('editor.changesNotExported');
  }
);

/*
Determines whether an active plan can expose route-specific application UI.
---
Inputs: The open-plan flag, current route, and recovery state.
---
Output: Whether the footer and other open-plan content can be shown.
*/
const hasOpenPlan = computed(
  () =>
    isPlanOpen.value && route.name !== 'home' &&
    recoveryState.value.kind === 'ready'
);

/*
Builds the localized question shown before a saved recovery copy is restored.
---
Inputs: The pending recovery record and selected interface language.
---
Output: A dated localized confirmation message or an empty string.
*/
const recoveryConfirmationMessage = computed(
  () =>
    recoveryState.value.kind === 'restore-or-discard'
      ? t('editor.restoreRecoveryConfirmation', { savedAt: new Date(recoveryState.value.savedAt).toLocaleString(interfaceLanguage.value) })
      : ''
);

/*
Collects plan locales that an author may select from the breadcrumb menu.
---
Inputs: The active plan locale and locale overrides in loaded case steps.
---
Output: A sorted unique list of supported and currently authored locale tags.
*/
const availablePlanLocales = computed(
  () => {
    const locales = new Set<string>(['en-CA', 'fr-CA', editorDraft.value.plan.defaults.locale]);
    for (const variable of Object.values(editorDraft.value.plan.variables ?? {})) {
      for (const locale of Object.keys(variable.locales ?? {})) {
        locales.add(locale);
      }
    }
    for (const caseDraft of Object.values(editorDraft.value.cases)) {
      for (const step of caseDraft.steps) {
        if (typeof step !== 'object' || step === null || !('expected' in step)) {
          continue;
        }
        const expected = (step as { expected?: unknown }).expected;
        if (typeof expected !== 'object' || expected === null || !('locales' in expected) || typeof expected.locales !== 'object' || expected.locales === null) {
          continue;
        }
        for (const locale of Object.keys(expected.locales)) {
          locales.add(locale);
        }
      }
    }
    return [...locales].sort();
  }
);

/*
Builds the breadcrumb trail for the active Plan, Case, Step, or Wait route.
---
Inputs: The current route, active draft, and localized wait labels.
---
Output: Ordered breadcrumb labels with navigation targets where available.
*/
const breadcrumbs = computed<Array<{ label: string; to?: RouteLocationRaw }>>(
  () => {
    if (route.name === 'home') {
      return [];
    }
    const items: Array<{ label: string; to?: RouteLocationRaw }> = [{ label: editorDraft.value.plan.id, to: { name: 'plan' } }];
    if (route.name === 'variable') {
      const variableName = String(route.params.variableName);
      if (editorDraft.value.plan.variables?.[variableName] !== undefined) {
        items.push({ label: variableName });
      }
      return items;
    }
    const caseIndex = Number(route.params.cardIndex);
    const caseReference = editorDraft.value.plan.cases[caseIndex];
    const stepIndex = Number(route.params.stepIndex);
    const step = editorDraft.value.cases[caseReference?.path ?? '']?.steps[stepIndex] as { action?: string } | undefined;
    if (caseReference !== undefined) {
      items.push({ label: `${caseIndex + 1}. ${editorDraft.value.cases[caseReference.path]?.id ?? caseReference.path}`, to: { name: 'case', params: { cardIndex: caseIndex } } });
    }
    if (route.name === 'step' || route.name === 'wait') {
      const action = step?.action?.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()) ?? 'Step';
      items.push({ label: `${stepIndex + 1}. ${action}`, to: { name: 'step', params: { cardIndex: caseIndex, stepIndex: route.params.stepIndex } } });
    }
    if (route.name === 'wait') {
      const position = route.params.position === 'before' ? t('editor.before') : t('editor.after');
      const waitIndex = Number(route.params.waitIndex);
      const waits = route.params.position === 'before' ? (step as { before?: unknown[] } | undefined)?.before : (step as { after?: unknown[] } | undefined)?.after;
      const wait = Array.isArray(waits) ? waits[waitIndex] : undefined;
      const waitLabel = typeof wait === 'object' && wait !== null && 'delay' in wait
        ? t('editor.waitForDelay')
        : typeof wait === 'object' && wait !== null && 'waitFor' in wait
          ? t('editor.waitForLocator')
          : typeof wait === 'object' && wait !== null && 'waitForState' in wait
            ? t('editor.waitForState')
            : t('editor.wait');
      items.push({ label: position });
      items.push({ label: `${waitIndex + 1}. ${waitLabel}` });
    }
    return items;
  }
);

/*
Changes the plan locale from the contextual breadcrumb menu.
---
Inputs: A locale found in the currently loaded plan's assertion overrides.
---
Output: A replacement plan draft with that active locale.
*/
function changeBreadcrumbPlanLocale(locale: string): void {
  editorDraft.value = { ...editorDraft.value, plan: updatePlanLocale(editorDraft.value.plan, locale) };
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

/*
Resolves the concrete Bootstrap colour theme from the stored preference.
---
Inputs: The selected theme preference and current browser colour scheme.
---
Output: The light or dark theme applied to the document.
*/
const resolvedTheme = computed(
  () => resolveTheme(themePreference.value, systemTheme.value === 'dark')
)
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
    if (recoveryState.value.kind === 'ready' && route.name !== 'home') {
      await router.replace({ name: 'home' })
    }
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
  const recovery = recoveryState.value;
  editorDraft.value = recovery.draft;
  recoveryRevision.value = recovery.revision;
  isPlanOpen.value = true;
  recoveryState.value = { kind: 'ready' }
  void router.replace(getRecoveredRouteLocation(recovery.draft));
}

/*
Builds the deepest valid router location after accepting a local recovery record.
---
Inputs: The recovered editor bundle and the route that existed before recovery.
---
Output: A valid Plan, Case, Step, or Wait location for Vue Router.
*/
function getRecoveredRouteLocation(draft: EditorBundleDraft): RouteLocationRaw {
  const target = resolveRecoveryRoute({
    cardIndex: route.params.cardIndex,
    draft,
    position: route.params.position,
    routeName: route.name,
    stepIndex: route.params.stepIndex,
    waitIndex: route.params.waitIndex,
  });
  if (target.name === 'plan') {
    return { name: 'plan' };
  }
  if (target.name === 'case') {
    return { name: 'case', params: { cardIndex: target.cardIndex } };
  }
  if (target.name === 'step') {
    return { name: 'step', params: { cardIndex: target.cardIndex, stepIndex: target.stepIndex } };
  }
  return { name: 'wait', params: { cardIndex: target.cardIndex, position: target.position, stepIndex: target.stepIndex, waitIndex: target.waitIndex } };
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
    if (!isPlanOpen.value) {
      await router.replace({ name: 'home' });
    }
  } catch {
    recoveryState.value = { kind: 'unavailable' }
  } finally {
    recoveryActionPending.value = false
  }
}

/*
Declines the available recovery copy and returns the author to the welcome page.
---
Inputs: A No action from the recovery confirmation dialog.
---
Output: The local record is discarded and the Home route becomes active.
*/
async function declineRecovery(): Promise<void> {
  await discardRecovery();
  if (recoveryState.value.kind === 'ready') {
    await router.replace({ name: 'home' });
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
  if (!isPlanOpen.value) {
    void router.replace({ name: 'home' });
  }
}

/*
Replaces the active editor bundle with a new empty plan.
---
Inputs: A confirmed plan identifier.
---
Output: A new recoverable editor bundle at the Plan route.
*/
async function createNewPlan(id: string): Promise<void> {
  editorDraft.value = createEmptyEditorDraft(id);
  isPlanOpen.value = true;
  await router.replace({ name: 'plan' });
}

/*
Opens the plan-identifier dialog from the route-level welcome page.
---
Inputs: A user activation of the New option.
---
Output: The New-plan dialog becomes visible without creating a plan.
*/
function requestNewPlanFromHero(): void {
  newPlanDialogOpen.value = true;
}

/*
Creates an author-named plan from the route-level welcome page.
---
Inputs: A validated plan identifier entered in the New-plan dialog.
---
Output: A new plan is opened at the Plan route.
*/
async function createNewPlanFromHero(id: string): Promise<void> {
  newPlanDialogOpen.value = false;
  editorDraft.value = createEmptyEditorDraft(id);
  isPlanOpen.value = true;
  recoveryState.value = { kind: 'ready' };
  await router.replace({ name: 'plan' });
}

/*
Imports a portable bundle selected from the route-level welcome page.
---
Inputs: One browser-selected ZIP file.
---
Output: A validated imported plan is opened at the plan route.
*/
async function importFromHero(file: File): Promise<void> {
  const result = await readPortableBundleFile(file);
  if (!result.valid) {
    return;
  }
  importEditorBundle(result.draft);
  isPlanOpen.value = true;
  recoveryState.value = { kind: 'ready' };
  await router.push({ name: 'plan' });
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
  isPlanOpen.value = true;
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
  <div
    class="d-flex flex-column min-vh-100 bg-body"
  >
    <div
      class="app-navigation"
    >
      <AppHeader
        v-model:interface-language="interfaceLanguage"
        v-model:theme-preference="themePreference"
      />
      <div
        v-if="isPlanOpen && recoveryState.kind === 'ready' && breadcrumbs.length > 0"
        class="container-fluid border-bottom py-1 bg-body-tertiary"
      >
        <nav
          class="my-1"
          aria-label="Breadcrumb"
        >
          <ol
            class="breadcrumb mb-0"
          >
            <li
              v-for="(breadcrumb, index) in breadcrumbs"
              :key="breadcrumb.label"
              :class="['breadcrumb-item', { active: index === breadcrumbs.length - 1 }]"
              :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
            >
              <span
                v-if="index === breadcrumbs.length - 1"
              >{{ breadcrumb.label }}</span>
              <RouterLink
                v-else-if="breadcrumb.to"
                :to="breadcrumb.to"
              >{{ breadcrumb.label }}</RouterLink>
              <span
                v-else
              >{{ breadcrumb.label }}</span>
              <div
                v-if="index === 0"
                class="dropdown d-inline-block ms-2"
              >
                <button
                  class="badge rounded-pill text-bg-secondary border-0 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ><span class="visually-hidden">{{ t('editor.planLocale') }}: </span>{{ editorDraft.plan.defaults.locale }}</button>
                <ul
                  class="dropdown-menu"
                >
                  <li
                    v-for="locale in availablePlanLocales"
                    :key="locale"
                  ><button :class="['dropdown-item', { active: locale === editorDraft.plan.defaults.locale }]" type="button" @click="changeBreadcrumbPlanLocale(locale)">{{ locale }}</button></li>
                </ul>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <main
      class="container-fluid flex-grow-1 pt-1 bg-body"
    >
      <RecoveryGate
        v-if="recoveryState.kind === 'loading' || recoveryState.kind === 'unreadable' || recoveryState.kind === 'unavailable'"
        :pending="recoveryActionPending"
        :state="recoveryState"
        @continue="continueWithoutRecovery"
        @discard="discardRecovery"
      />
      <HeroPage
        v-else-if="route.name === 'home' || !isPlanOpen"
        @import="importFromHero"
        @new="requestNewPlanFromHero"
      />
      <template
        v-else-if="recoveryState.kind === 'ready'"
      >
        <PlanBundle
          v-model:case-drafts="editorDraft.cases"
          v-model:plan="editorDraft.plan"
          @export="downloadPortableBundle"
          @import-bundle="importEditorBundle"
          @new-plan="createNewPlan"
        />
        <ConflictResolutionModal
          v-if="conflictRecord"
          :key="conflictRecord.revision"
          :discard-label="t('editor.discardLocalEdits')"
          :message="t('editor.conflictDetected')"
          :replace-label="t('editor.replaceSavedDraft')"
          :title="t('editor.conflictTitle')"
          @discard="discardLocalEdits"
          @replace="replaceSavedDraft"
        />
      </template>
    </main>
    <NewPlanDialog v-if="newPlanDialogOpen" @close="newPlanDialogOpen = false" @create="createNewPlanFromHero" />
    <RecoveryConfirmationModal
      v-if="recoveryState.kind === 'restore-or-discard'"
      :message="recoveryConfirmationMessage"
      :no-label="t('editor.no')"
      :title="t('editor.confirmationTitle')"
      :yes-label="t('editor.yes')"
      @no="declineRecovery"
      @yes="restoreRecovery"
    />
    <footer v-if="hasOpenPlan" class="border-top bg-body-tertiary px-4 py-2 text-body-secondary" aria-live="polite">
      <div class="d-flex flex-wrap gap-3">
        <span>{{ exportStatusMessage }}</span>
        <span>{{ saveStatusMessage }}</span>
      </div>
    </footer>
    <ApplyToast v-if="appliedChangesVisible" @close="appliedChangesVisible = false" />
  </div>
</template>

<style scoped>
.app-navigation {
  position: sticky;
  top: 0;
  z-index: 1030;
}
</style>
