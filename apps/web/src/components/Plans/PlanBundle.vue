<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import type { ValidationIssue } from '@stagehand/plan-schema';
import { addCaseReference, createBundledEditorDraft, createCaseDraft, moveCaseReference, removeCaseReference, updateCaseAccessibilitySettings, updateCaseBrowserSettings, updateCaseReference, updateCaseTimeout, updatePlanAccessibilitySettings, updatePlanBrowserSettings, updatePlanLocale, updatePlanTimeout, type AccessibilitySettingsDraft, type CaseBrowserSettingsDraft, type CaseDraft, type PlanBrowserSettingsDraft, type PlanDraft } from '../../document/plan-draft';
import { validateEditorPlan } from '../../document/validation';
import { preparePortableBundleExport, type PreparedPortableBundleExport } from '../../portable-bundle/export';
import { readPortableBundleFile } from '../../portable-bundle/import';
import CasePage from '../Cases/CasePage.vue';
import StepPage from '../Steps/StepPage.vue';
import ConfirmationModal from '../dialogs/ConfirmationModal.vue';
import BundleIssuesModal from '../dialogs/BundleIssuesModal.vue';
import ExportBundleDialog from '../dialogs/ExportBundleDialog.vue';
import NewPlanDialog from '../dialogs/NewPlanDialog.vue';
import IconOnlyButton from '../IconOnlyButton.vue';
import PlanPage from './PlanPage.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  plan: PlanDraft;
}>();

const emit = defineEmits<{
  'update:case-drafts': [caseDrafts: Record<string, CaseDraft>];
  'update:plan': [plan: PlanDraft];
  'export': [bundle: PreparedPortableBundleExport];
  'import-bundle': [bundle: { cases: Record<string, CaseDraft>; plan: PlanDraft }];
  'new-plan': [id: string];
}>();

const { t } = useTranslation();
const route = useRoute();
const router = useRouter();
const validationRequested = ref(false);
const planValidation = computed(() => validateEditorPlan(props.plan));
const validationIssues = computed(() => planValidation.value.valid ? [] : planValidation.value.issues);
const hasUnexportedChanges = computed(() => JSON.stringify(props.plan) !== JSON.stringify(createBundledEditorDraft().plan) || JSON.stringify(props.caseDrafts) !== JSON.stringify(createBundledEditorDraft().cases));
const confirmation = ref<{ bundle?: { cases: Record<string, CaseDraft>; plan: PlanDraft }; id?: string; index?: number; kind: 'import-bundle' | 'new-plan' | 'remove-reference' }>();
const newPlanDialogOpen = ref(false);
const selectedCasePath = ref(props.plan.cases[0]?.path ?? '');
const importInput = ref<HTMLInputElement>();
const bundleIssues = ref<{ messages: string[]; message: string; title: string }>();
const pendingExportBundle = ref<PreparedPortableBundleExport>();
const editing = ref(true);
const selectedCaseIndex = computed(() => Number(route.params.cardIndex));
const selectedCaseReference = computed(() => props.plan.cases[selectedCaseIndex.value]);

watch(() => props.plan.cases, (references) => {
  if (!references.some((reference) => reference.path === selectedCasePath.value)) {
    selectedCasePath.value = references[0]?.path ?? '';
  }
}, { deep: true });

watch(() => route.params.cardIndex, (routeIndex) => {
  const index = Number(routeIndex);
  const reference = props.plan.cases[index];
  if (reference !== undefined) {
    selectedCasePath.value = reference.path;
  }
}, { immediate: true });

/*
Emits a draft with the raw plan-locale text preserved.
---
Inputs: A new locale value from plan details.
---
Output: An updated plan draft.
*/
function changePlanLocale(locale: string): void {
  emit('update:plan', updatePlanLocale(props.plan, locale));
}

/*
Updates plan-level browser defaults from plan details.
---
Inputs: A replacement plan-browser settings value.
---
Output: An immutable plan draft update.
*/
function changePlanBrowserSettings(browser: PlanBrowserSettingsDraft): void {
  emit('update:plan', updatePlanBrowserSettings(props.plan, browser));
}

/*
Updates plan-level accessibility defaults from plan details.
---
Inputs: A replacement plan-accessibility settings value.
---
Output: An immutable plan draft update.
*/
function changePlanAccessibilitySettings(accessibility: AccessibilitySettingsDraft): void {
  emit('update:plan', updatePlanAccessibilitySettings(props.plan, accessibility));
}

/*
Updates the plan-wide step timeout from plan details.
---
Inputs: A raw timeout value.
---
Output: An immutable plan draft update.
*/
function changePlanTimeout(timeout: number | string | undefined): void {
  emit('update:plan', updatePlanTimeout(props.plan, timeout));
}

/*
Sets the plan workspace display mode.
---
Inputs: Whether authoring controls should be available.
---
Output: The selected View or Edit mode is shown.
*/
function setEditing(editingMode: boolean): void {
  editing.value = editingMode;
}

/*
Adds a new case reference to the plan draft.
---
Inputs: The reference path supplied by the case-reference dialog.
---
Output: An updated plan draft.
*/
function addReference(path: string): void {
  emit('update:plan', addCaseReference(props.plan, path));
  emit('update:case-drafts', { ...props.caseDrafts, [path]: createCaseDraft(path) });
}

/*
Updates an existing case reference in the plan draft.
---
Inputs: The reference index and replacement path supplied by the dialog.
---
Output: An updated plan draft.
*/
function changeReference(index: number, path: string): void {
  const previousPath = props.plan.cases[index]?.path;
  emit('update:plan', updateCaseReference(props.plan, index, path));
  if (previousPath !== undefined) {
    const { [previousPath]: previousCase, ...remainingCases } = props.caseDrafts;
    emit('update:case-drafts', { ...remainingCases, [path]: previousCase ?? createCaseDraft(path) });
  }
}

/*
Moves one case reference by one valid adjacent position.
---
Inputs: A case-reference index and an adjacent movement direction.
---
Output: An updated plan draft while retaining the selected reference path.
*/
function moveReference(index: number, direction: -1 | 1): void {
  emit('update:plan', moveCaseReference(props.plan, index, index + direction));
}

/*
Updates one case-document identifier without changing its other data.
---
Inputs: A case-reference path and replacement raw identifier.
---
Output: An immutable case-draft collection update.
*/
function changeCaseId(path: string, id: string): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: { ...caseDraft, id } });
  }
}

/*
Updates or clears browser overrides for one case document.
---
Inputs: A case-reference path and optional case-browser settings.
---
Output: An immutable case-draft collection update.
*/
function changeCaseBrowserSettings(path: string, browser: CaseBrowserSettingsDraft | undefined): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: updateCaseBrowserSettings(caseDraft, browser) });
  }
}

/*
Updates or clears accessibility overrides for one case document.
---
Inputs: A case-reference path and optional accessibility settings.
---
Output: An immutable case-draft collection update.
*/
function changeCaseAccessibilitySettings(path: string, accessibility: AccessibilitySettingsDraft | undefined): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: updateCaseAccessibilitySettings(caseDraft, accessibility) });
  }
}

/*
Updates or clears a step-timeout override for one case document.
---
Inputs: A case-reference path and optional timeout override.
---
Output: An immutable case-draft collection update.
*/
function changeCaseTimeout(path: string, timeout: unknown | undefined): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: updateCaseTimeout(caseDraft, timeout) });
  }
}

/*
Updates ordered step data for one selected case document.
---
Inputs: A case-reference path and replacement raw steps.
---
Output: An immutable case-draft collection update.
*/
function changeCaseSteps(path: string, steps: unknown[]): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: { ...caseDraft, steps } });
  }
}

/*
Removes one step from a case document.
---
Inputs: A case-reference path and the selected step index.
---
Output: An immutable case-draft collection update without that step.
*/
function removeCaseStep(path: string, index: number): void {
  const caseDraft = props.caseDrafts[path];
  if (caseDraft !== undefined) {
    emit('update:case-drafts', { ...props.caseDrafts, [path]: { ...caseDraft, steps: caseDraft.steps.filter((_, candidateIndex) => candidateIndex !== index) } });
  }
}

/*
Selects the case document associated with a clicked plan reference.
---
Inputs: A case-reference path selected in the case-reference panel.
---
Output: The matching case details become visible.
*/
function selectCase(path: string): void {
  const index = props.plan.cases.findIndex((reference) => reference.path === path);
  if (index < 0) {
    return;
  }
  selectedCasePath.value = path;
  void router.push({ name: 'case', params: { cardIndex: index } });
}

/*
Opens a confirmation modal before removing a case reference.
---
Inputs: The index of the case reference selected for removal.
---
Output: A pending removal confirmation.
*/
function requestReferenceRemoval(index: number): void {
  confirmation.value = { kind: 'remove-reference', index };
}

/*
Marks shared plan validation as explicitly requested.
---
Inputs: The plan-details validation request.
---
Output: Enables validation feedback in child components.
*/
function requestPlanValidation(): void {
  validationRequested.value = true;
}

/*
Opens the dialog used to collect a new plan identifier.
---
Inputs: A New plan action.
---
Output: A visible new-plan dialog.
*/
function requestNewPlan(): void {
  newPlanDialogOpen.value = true;
}

/*
Opens the browser file chooser for a portable ZIP bundle.
---
Inputs: An Import action from the plan toolbar.
---
Output: A browser-managed ZIP-file selection request.
*/
function requestImport(): void {
  importInput.value?.click();
}

/*
Reads a selected ZIP candidate before any active editor data is changed.
---
Inputs: The file-input change event and its optional selected file.
---
Output: Import issues or a replacement confirmation for a valid candidate.
*/
async function importSelectedFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.item(0);
  input.value = '';
  if (file === null || file === undefined) {
    return;
  }
  const result = await readPortableBundleFile(file);
  if (!result.valid) {
    bundleIssues.value = {
      messages: [...new Set(result.issues.map(getImportIssueMessage))],
      message: t('editor.importFailed'),
      title: t('editor.importErrorTitle'),
    };
    return;
  }
  bundleIssues.value = undefined;
  confirmation.value = { bundle: result.draft, kind: 'import-bundle' };
}

/*
Prepares a valid portable bundle for browser download without changing editor state.
---
Inputs: An Export action from the plan toolbar.
---
Output: An export event or a blocking validation dialog for an invalid draft.
*/
function requestExport(): void {
  const result = preparePortableBundleExport({ cases: props.caseDrafts, plan: props.plan });
  if (!result.valid) {
    bundleIssues.value = {
      messages: [...new Set(result.issues.map(getExportIssueMessage))],
      message: t('editor.exportFailed'),
      title: t('editor.exportErrorTitle'),
    };
    return;
  }
  pendingExportBundle.value = result.bundle;
}

/*
Starts a browser download using the filename confirmed in the export dialog.
---
Inputs: The author-selected portable ZIP filename.
---
Output: An export event for the prepared bundle and a cleared pending dialog.
*/
function downloadExport(filename: string): void {
  if (pendingExportBundle.value === undefined) {
    return;
  }
  emit('export', { ...pendingExportBundle.value, filename });
  pendingExportBundle.value = undefined;
}

/*
Replaces the active editor bundle with a validated imported candidate.
---
Inputs: A detached bundle produced by the portable bundle reader.
---
Output: An imported-bundle event and cleared explicit validation state.
*/
function importBundle(bundle: { cases: Record<string, CaseDraft>; plan: PlanDraft }): void {
  emit('import-bundle', bundle);
  validationRequested.value = false;
}

/*
Chooses localized wording for one portable-import issue.
---
Inputs: A codec or shared-contract validation issue.
---
Output: A localized author-facing description of the rejected candidate.
*/
function getImportIssueMessage(issue: ValidationIssue): string {
  if (issue.keyword === 'invalidArchive' || issue.keyword === 'readFailure') {
    return t('editor.importUnreadable');
  }
  if (issue.keyword === 'invalidJson') {
    return t('editor.importInvalidJson');
  }
  if (issue.keyword === 'missingReference') {
    return t('editor.importMissingReference');
  }
  if (issue.keyword === 'duplicateReference' || issue.keyword === 'ambiguousMatch') {
    return t('editor.importDuplicateReference');
  }
  return t('editor.importInvalidDocument');
}

/*
Chooses localized wording for one invalid export condition.
---
Inputs: A shared-contract validation issue from export preparation.
---
Output: A localized author-facing description of the blocked download.
*/
function getExportIssueMessage(issue: ValidationIssue): string {
  if (issue.keyword === 'missingReference') {
    return t('editor.exportMissingReference');
  }
  return t('editor.exportInvalidDocument');
}

/*
Requests replacement of the active bundle after collecting a plan identifier.
---
Inputs: A non-empty identifier from the new-plan dialog.
---
Output: An immediate new-plan event or a replacement confirmation.
*/
function createNewPlan(id: string): void {
  newPlanDialogOpen.value = false;
  if (hasUnexportedChanges.value) {
    confirmation.value = { id, kind: 'new-plan' };
    return;
  }
  emit('new-plan', id);
}

/*
Applies the action accepted in the active confirmation modal.
---
Inputs: The pending confirmation action.
---
Output: A removed reference, replacement bundle, or new plan.
*/
function confirmAction(): void {
  const action = confirmation.value;
  confirmation.value = undefined;
  if (action?.kind === 'remove-reference' && action.index !== undefined) {
    const path = props.plan.cases[action.index]?.path;
    emit('update:plan', removeCaseReference(props.plan, action.index));
    if (path !== undefined) {
      const { [path]: _, ...remainingCases } = props.caseDrafts;
      emit('update:case-drafts', remainingCases);
    }
  }
  if (action?.kind === 'new-plan' && action.id !== undefined) {
    emit('new-plan', action.id);
  }
  if (action?.kind === 'import-bundle' && action.bundle !== undefined) {
    importBundle(action.bundle);
  }
}

/*
Clears the pending confirmation without changing the plan.
---
Inputs: A cancellation from the confirmation modal.
---
Output: No draft change.
*/
function cancelConfirmation(): void {
  confirmation.value = undefined;
}
</script>

<template>
  <div class="btn-toolbar flex-wrap gap-2 my-3" role="toolbar" :aria-label="t('editor.planActions')">
    <div class="btn-group" role="group" :aria-label="t('editor.planActions')">
      <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-sparkles" :label="t('editor.new')" @click="requestNewPlan" />
    </div>
    <div class="btn-group" role="group" :aria-label="t('editor.planActions')">
      <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-upload" :label="t('editor.import')" @click="requestImport" />
      <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-download" :label="t('editor.export')" @click="requestExport" />
      <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-ballot-check" :label="t('editor.validate')" @click="requestPlanValidation" />
    </div>
    <div class="btn-group" role="group" :aria-label="t('editor.planActions')">
      <IconOnlyButton v-if="editing" class="btn btn-outline-secondary" icon="fa-solid fa-eye" :label="t('editor.viewMode')" @click="setEditing(false)" />
      <IconOnlyButton v-if="!editing" class="btn btn-outline-secondary" icon="fa-solid fa-pen" :label="t('editor.editMode')" @click="setEditing(true)" />
    </div>
    <input ref="importInput" class="d-none" type="file" accept=".zip,application/zip" @change="importSelectedFile" />
  </div>
  <PlanPage
    v-if="route.name === 'plan'"
    :case-drafts="caseDrafts"
    :editing="editing"
    :plan="plan"
    :selected-case-path="selectedCasePath"
    :validation-issues="validationIssues"
    :validation-requested="validationRequested"
    @add="addReference"
    @move="moveReference"
    @remove="requestReferenceRemoval"
    @remove:step="removeCaseStep"
    @select="selectCase"
    @update="changeReference"
    @update:accessibility="changeCaseAccessibilitySettings"
    @update:browser="changeCaseBrowserSettings"
    @update:case-id="changeCaseId"
    @update:plan-accessibility="changePlanAccessibilitySettings"
    @update:plan-browser="changePlanBrowserSettings"
    @update:plan-locale="changePlanLocale"
    @update:plan-timeout="changePlanTimeout"
    @update:steps="changeCaseSteps"
    @update:timeout="changeCaseTimeout"
    @validate="requestPlanValidation"
  />
  <CasePage
    v-else-if="route.name === 'case' && selectedCaseReference"
    :case-count="plan.cases.length"
    :case-drafts="caseDrafts"
    :case-index="selectedCaseIndex"
    :case-path="selectedCaseReference.path"
    :editing="editing"
    :plan-accessibility="plan.defaults.accessibility"
    :plan-browser="plan.defaults.browser"
    :plan-locale="plan.defaults.locale"
    :plan-timeout="plan.defaults.timeout"
    @move="moveReference"
    @remove="requestReferenceRemoval"
    @remove:step="removeCaseStep"
    @select="selectCase"
    @update:accessibility="changeCaseAccessibilitySettings"
    @update:browser="changeCaseBrowserSettings"
    @update:case-id="changeCaseId"
    @update:steps="changeCaseSteps"
    @update:timeout="changeCaseTimeout"
  />
  <StepPage
    v-else-if="(route.name === 'step' || route.name === 'wait') && selectedCaseReference"
    :case-count="plan.cases.length"
    :case-drafts="caseDrafts"
    :case-index="selectedCaseIndex"
    :case-path="selectedCaseReference.path"
    :editing="editing"
    :plan-accessibility="plan.defaults.accessibility"
    :plan-browser="plan.defaults.browser"
    :plan-locale="plan.defaults.locale"
    :plan-timeout="plan.defaults.timeout"
    @remove:step="removeCaseStep"
    @update:steps="changeCaseSteps"
  />
  <ConfirmationModal
    v-if="confirmation"
    :cancel-label="t('editor.cancel')"
    :confirm-label="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReference') : confirmation.kind === 'new-plan' ? t('editor.create') : t('editor.import')"
    :message="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReferenceConfirmation') : confirmation.kind === 'new-plan' ? t('editor.newPlanConfirmation') : t('editor.importConfirmation')"
    :title="t('editor.confirmationTitle')"
    @cancel="cancelConfirmation"
    @confirm="confirmAction"
  />
  <BundleIssuesModal v-if="bundleIssues" :close-label="t('editor.close')" :issues="bundleIssues.messages" :message="bundleIssues.message" :title="bundleIssues.title" @close="bundleIssues = undefined" />
  <ExportBundleDialog v-if="pendingExportBundle" :suggested-filename="pendingExportBundle.filename" @close="pendingExportBundle = undefined" @download="downloadExport" />
  <NewPlanDialog v-if="newPlanDialogOpen" @close="newPlanDialogOpen = false" @create="createNewPlan" />
</template>

<style scoped>
</style>
