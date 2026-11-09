<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { addCaseReference, createBundledEditorDraft, createCaseDraft, removeCaseReference, updateCaseReference, updatePlanLocale, type CaseDraft, type PlanDraft } from '../document/plan-draft';
import { validateEditorPlan } from '../document/validation';
import CaseReferences from './CaseReferences.vue';
import CaseDetails from './CaseDetails.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import NewPlanDialog from './NewPlanDialog.vue';
import PlanDetails from './PlanDetails.vue';
import SharedContractAssessment from './SharedContractAssessment.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  plan: PlanDraft;
}>();

const emit = defineEmits<{
  'update:case-drafts': [caseDrafts: Record<string, CaseDraft>];
  'update:plan': [plan: PlanDraft];
  'new-plan': [id: string];
}>();

const { t } = useTranslation();
const validationRequested = ref(false);
const planValidation = computed(() => validateEditorPlan(props.plan));
const validationIssues = computed(() => planValidation.value.valid ? [] : planValidation.value.issues);
const hasUnexportedChanges = computed(() => JSON.stringify(props.plan) !== JSON.stringify(createBundledEditorDraft().plan) || JSON.stringify(props.caseDrafts) !== JSON.stringify(createBundledEditorDraft().cases));
const confirmation = ref<{ id?: string; index?: number; kind: 'new-plan' | 'remove-reference' | 'reset-sample' }>();
const newPlanDialogOpen = ref(false);
const selectedCasePath = ref(props.plan.cases[0]?.path ?? '');

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
  selectedCasePath.value = path;
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
  <nav class="sticky-top border-bottom bg-body py-2 mb-3" :aria-label="t('editor.planActions')">
    <div class="d-flex flex-wrap align-items-center gap-2">
      <button class="btn btn-primary" type="button" @click="requestNewPlan">{{ t('editor.newPlan') }}</button>
      <button class="btn btn-outline-secondary" type="button" @click="resetPlanDraft">{{ t('editor.resetSample') }}</button>
    </div>
  </nav>
  <PlanDetails :plan="plan" :validation-issues="validationIssues" :validation-requested="validationRequested" @update:locale="changePlanLocale" @validate="requestPlanValidation">
    <CaseReferences :cases="plan.cases" @add="addReference" @remove="requestReferenceRemoval" @select="selectCase" @update="changeReference" />
  </PlanDetails>
  <CaseDetails :case-drafts="caseDrafts" :selected-path="selectedCasePath" @remove:step="removeCaseStep" @update:case-id="changeCaseId" @update:steps="changeCaseSteps" />
  <SharedContractAssessment :validation="planValidation" />
  <ConfirmationModal
    v-if="confirmation"
    :cancel-label="t('editor.cancel')"
    :confirm-label="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReference') : confirmation.kind === 'new-plan' ? t('editor.create') : t('editor.reset')"
    :message="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReferenceConfirmation') : confirmation.kind === 'new-plan' ? t('editor.newPlanConfirmation') : t('editor.resetConfirmation')"
    :title="t('editor.confirmationTitle')"
    @cancel="cancelConfirmation"
    @confirm="confirmAction"
  />
  <NewPlanDialog v-if="newPlanDialogOpen" @create="createNewPlan" />
</template>
