<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { addCaseReference, createBundledPlanDraft, removeCaseReference, updateCaseReference, updatePlanLocale, type PlanDraft } from '../document/plan-draft';
import { validateEditorPlan } from '../document/validation';
import CaseReferences from './CaseReferences.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import PlanDetails from './PlanDetails.vue';
import SharedContractAssessment from './SharedContractAssessment.vue';

const props = defineProps<{
  plan: PlanDraft;
}>();

const emit = defineEmits<{
  'update:plan': [plan: PlanDraft];
}>();

const { t } = useTranslation();
const validationRequested = ref(false);
const planValidation = computed(() => validateEditorPlan(props.plan));
const validationIssues = computed(() => planValidation.value.valid ? [] : planValidation.value.issues);
const hasUnexportedChanges = computed(() => JSON.stringify(props.plan) !== JSON.stringify(createBundledPlanDraft()));
const confirmation = ref<{ index?: number; kind: 'remove-reference' | 'reset-sample' }>();

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
}

/*
Updates an existing case reference in the plan draft.
---
Inputs: The reference index and replacement path supplied by the dialog.
---
Output: An updated plan draft.
*/
function changeReference(index: number, path: string): void {
  emit('update:plan', updateCaseReference(props.plan, index, path));
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
Restores the bundled sample as the current plan draft.
---
Inputs: A reset that does not require confirmation.
---
Output: A fresh bundled plan and cleared validation request.
*/
function restoreBundledPlan(): void {
  emit('update:plan', createBundledPlanDraft());
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
    emit('update:plan', removeCaseReference(props.plan, action.index));
  }
  if (action?.kind === 'reset-sample') {
    restoreBundledPlan();
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
  <PlanDetails :plan="plan" :validation-issues="validationIssues" :validation-requested="validationRequested" @update:locale="changePlanLocale" @validate="requestPlanValidation" />
  <CaseReferences :cases="plan.cases" @add="addReference" @remove="requestReferenceRemoval" @update="changeReference" />
  <SharedContractAssessment :validation="planValidation" />
  <div class="d-flex flex-wrap align-items-center gap-2 mt-3">
    <button class="btn btn-outline-secondary" type="button" @click="resetPlanDraft">{{ t('editor.resetSample') }}</button>
    <p class="mb-0 text-body-secondary">{{ hasUnexportedChanges ? t('editor.changesNotExported') : t('editor.noUnexportedChanges') }}</p>
  </div>
  <ConfirmationModal
    v-if="confirmation"
    :cancel-label="t('editor.cancel')"
    :confirm-label="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReference') : t('editor.reset')"
    :message="confirmation.kind === 'remove-reference' ? t('editor.removeCaseReferenceConfirmation') : t('editor.resetConfirmation')"
    :title="t('editor.confirmationTitle')"
    @cancel="cancelConfirmation"
    @confirm="confirmAction"
  />
</template>
