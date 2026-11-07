<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from 'i18next-vue'
import { createBundledPlanDraft, updatePlanLocale, type PlanDraft } from '../document/plan-draft'
import { validateEditorPlan } from '../document/validation'
import CaseReferences from './CaseReferences.vue'
import PlanDetails from './PlanDetails.vue'
import SharedContractAssessment from './SharedContractAssessment.vue'

const props = defineProps<{
  plan: PlanDraft
}>()

const emit = defineEmits<{
  'update:plan': [plan: PlanDraft]
}>()

const { t } = useTranslation()
const validationRequested = ref(false)
const planValidation = computed(() => validateEditorPlan(props.plan))
const validationIssues = computed(() => planValidation.value.valid ? [] : planValidation.value.issues)
const hasUnexportedChanges = computed(() => props.plan.defaults.locale !== 'en-CA')

/*
Emits a draft with the raw plan-locale text preserved.
---
Inputs: A new locale value from plan details.
---
Output: An updated plan draft.
*/
function changePlanLocale(locale: string): void {
  emit('update:plan', updatePlanLocale(props.plan, locale))
}

/*
Marks shared plan validation as explicitly requested.
---
Inputs: The plan-details validation request.
---
Output: Enables validation feedback in child components.
*/
function requestPlanValidation(): void {
  validationRequested.value = true
}

/*
Restores the bundled plan after confirmation when it has unexported changes.
---
Inputs: A reset-button activation.
---
Output: A fresh bundled plan or the existing plan when cancelled.
*/
function resetPlanDraft(): void {
  if (hasUnexportedChanges.value && !window.confirm(t('editor.resetConfirmation'))) {
    return
  }
  emit('update:plan', createBundledPlanDraft())
  validationRequested.value = false
}
</script>

<template>
  <PlanDetails :plan="plan" :validation-issues="validationIssues" :validation-requested="validationRequested" @update:locale="changePlanLocale" @validate="requestPlanValidation" />
  <CaseReferences :cases="plan.cases" />
  <SharedContractAssessment :validation="planValidation" />
  <div class="d-flex flex-wrap align-items-center gap-2 mt-3">
    <button class="btn btn-outline-secondary" type="button" @click="resetPlanDraft">{{ t('editor.resetSample') }}</button>
    <p class="mb-0 text-body-secondary">{{ hasUnexportedChanges ? t('editor.changesNotExported') : t('editor.noUnexportedChanges') }}</p>
  </div>
</template>
