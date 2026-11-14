<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { ValidationIssue } from '@stagehand/plan-schema';
import { addCaseReference, createBundledEditorDraft, createCaseDraft, moveCaseReference, removeCaseReference, updateCaseReference, updatePlanLocale, type CaseDraft, type PlanDraft } from '../document/plan-draft';
import { validateEditorPlan } from '../document/validation';
import { preparePortableBundleExport, type PreparedPortableBundleExport } from '../portable-bundle/export';
import { readPortableBundleFile } from '../portable-bundle/import';
import CaseReferences from './CaseReferences.vue';
import CaseDetails from './CaseDetails.vue';
import ConfirmationModal from './dialogs/ConfirmationModal.vue';
import BundleIssuesModal from './dialogs/BundleIssuesModal.vue';
import ExportBundleDialog from './dialogs/ExportBundleDialog.vue';
import NewPlanDialog from './dialogs/NewPlanDialog.vue';
import PlanDetails from './PlanDetails.vue';
import SharedContractAssessment from './SharedContractAssessment.vue';

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
const validationRequested = ref(false);
const planValidation = computed(() => validateEditorPlan(props.plan));
const validationIssues = computed(() => planValidation.value.valid ? [] : planValidation.value.issues);
const hasUnexportedChanges = computed(() => JSON.stringify(props.plan) !== JSON.stringify(createBundledEditorDraft().plan) || JSON.stringify(props.caseDrafts) !== JSON.stringify(createBundledEditorDraft().cases));
const confirmation = ref<{ bundle?: { cases: Record<string, CaseDraft>; plan: PlanDraft }; id?: string; index?: number; kind: 'import-bundle' | 'new-plan' | 'remove-reference' | 'reset-sample' }>();
const newPlanDialogOpen = ref(false);
const selectedCasePath = ref(props.plan.cases[0]?.path ?? '');
const importInput = ref<HTMLInputElement>();
const bundleIssues = ref<{ messages: string[]; message: string; title: string }>();
const pendingExportBundle = ref<PreparedPortableBundleExport>();

watch(() => props.plan.cases, (references) => {
  if (!references.some((reference) => reference.path === selectedCasePath.value)) {
    selectedCasePath.value = references[0]?.path ?? '';
  }
}, { deep: true });

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
  selectedCasePath.value = selectedCasePath.value === path ? '' : path;
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
Restores the bundled plan after confirmation when it has unexported changes.
---
Inputs: A reset-button activation.
---
Output: A fresh bundled plan or the existing plan when cancelled.
*/
function resetPlanDraft(): void {
  if (hasUnexportedChanges.value) {
    confirmation.value = { kind: 'reset-sample' };
    return;
  }
  restoreBundledPlan();
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
Restores the bundled sample as the current plan draft.
---
Inputs: A reset that does not require confirmation.
---
Output: A fresh bundled plan and cleared validation request.
*/
function restoreBundledPlan(): void {
  const bundle = createBundledEditorDraft();
  emit('update:plan', bundle.plan);
  emit('update:case-drafts', bundle.cases);
  validationRequested.value = false;
}

/*
Applies the action accepted in the active confirmation modal.
---
Inputs: The pending confirmation action.
---
Output: A removed reference or restored bundled plan.
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
  if (action?.kind === 'reset-sample') {
    restoreBundledPlan();
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
  <nav class="plan-actions bg-body py-2 mb-3" :aria-label="t('editor.planActions')">
    <div class="d-flex flex-wrap align-items-center gap-2">
      <button class="btn btn-primary" type="button" @click="requestNewPlan">{{ t('editor.newPlan') }}</button>
      <button class="btn btn-outline-primary" type="button" @click="requestImport">{{ t('editor.import') }}</button>
      <button class="btn btn-outline-success" type="button" @click="requestExport">{{ t('editor.export') }}</button>
      <button class="btn btn-outline-secondary" type="button" @click="resetPlanDraft">{{ t('editor.resetSample') }}</button>
      <input ref="importInput" class="d-none" type="file" accept=".zip,application/zip" @change="importSelectedFile" />
    </div>
  </nav>
  <PlanDetails :plan="plan" :validation-issues="validationIssues" :validation-requested="validationRequested" @update:locale="changePlanLocale" @validate="requestPlanValidation">
    <CaseReferences :case-drafts="caseDrafts" :cases="plan.cases" :selected-path="selectedCasePath" @add="addReference" @move="moveReference" @remove="requestReferenceRemoval" @select="selectCase" @update="changeReference">
      <template #case-details="{ path }">
        <CaseDetails :case-drafts="caseDrafts" :plan-locale="plan.defaults.locale" :selected-path="path" @remove:step="removeCaseStep" @update:case-id="changeCaseId" @update:steps="changeCaseSteps" />
      </template>
    </CaseReferences>
  </PlanDetails>
  <SharedContractAssessment :validation="planValidation" />
  <ConfirmationModal
    v-if="confirmation"
    :cancel-label="t('editor.cancel')"
    :confirm-label="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReference') : confirmation.kind === 'new-plan' ? t('editor.create') : confirmation.kind === 'import-bundle' ? t('editor.import') : t('editor.reset')"
    :message="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReferenceConfirmation') : confirmation.kind === 'new-plan' ? t('editor.newPlanConfirmation') : confirmation.kind === 'import-bundle' ? t('editor.importConfirmation') : t('editor.resetConfirmation')"
    :title="t('editor.confirmationTitle')"
    @cancel="cancelConfirmation"
    @confirm="confirmAction"
  />
  <BundleIssuesModal v-if="bundleIssues" :close-label="t('editor.close')" :issues="bundleIssues.messages" :message="bundleIssues.message" :title="bundleIssues.title" @close="bundleIssues = undefined" />
  <ExportBundleDialog v-if="pendingExportBundle" :suggested-filename="pendingExportBundle.filename" @close="pendingExportBundle = undefined" @download="downloadExport" />
  <NewPlanDialog v-if="newPlanDialogOpen" @close="newPlanDialogOpen = false" @create="createNewPlan" />
</template>

<style scoped>
.plan-actions {
  position: sticky;
  top: 3.5rem;
  z-index: 1020;
}
</style>
