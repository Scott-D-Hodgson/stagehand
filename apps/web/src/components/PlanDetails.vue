<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from 'i18next-vue'
import type { PlanDraft } from '../document/plan-draft'
import type { ValidationIssue } from '@stagehand/plan-schema'

const props = defineProps<{
  plan: PlanDraft
  validationIssues: ValidationIssue[]
  validationRequested: boolean
}>()

const emit = defineEmits<{
  'update:locale': [locale: string]
  validate: []
}>()

const { t } = useTranslation()
const localeWasBlurred = ref(false)
const planLocaleIssues = computed(() => props.validationIssues.filter((issue) => issue.path === '/defaults/locale'))
const shouldShowPlanLocaleIssues = computed(() => planLocaleIssues.value.length > 0 && (localeWasBlurred.value || props.validationRequested))

/*
Emits raw locale input without coercing it into a valid value.
---
Inputs: A plan-locale input event.
---
Output: The entered locale text.
*/
function changePlanLocale(event: Event): void {
  emit('update:locale', (event.target as HTMLInputElement).value)
}

/*
Marks the plan-locale field as ready to show shared validation feedback.
---
Inputs: The plan-locale blur event.
---
Output: Enables field-level validation feedback.
*/
function validatePlanLocale(): void {
  localeWasBlurred.value = true
}
</script>

<template>
  <section class="card mb-3 shadow-sm" aria-labelledby="plan-details-heading">
    <div class="card-body">
      <h2 id="plan-details-heading" class="h5">{{ t('editor.planDetails') }}</h2>
      <dl class="row mb-3">
        <dt class="col-sm-3">{{ t('editor.planId') }}</dt>
        <dd class="col-sm-9 font-monospace">{{ plan.id }}</dd>
      </dl>
      <form @submit.prevent="emit('validate')">
        <label class="form-label" for="plan-locale">{{ t('editor.planLocale') }}</label>
        <input id="plan-locale" :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-help plan-locale-error' : 'plan-locale-help'" :class="['form-control', { 'is-invalid': shouldShowPlanLocaleIssues }]" :value="plan.defaults.locale" @blur="validatePlanLocale" @input="changePlanLocale" />
        <div id="plan-locale-help" class="form-text">{{ t('guidance.neutral.planLocaleHelp') }}</div>
        <div v-if="shouldShowPlanLocaleIssues" id="plan-locale-error" class="invalid-feedback d-block">{{ planLocaleIssues[0]?.message }}</div>
        <button class="btn btn-primary mt-3" type="submit">{{ t('editor.validate') }}</button>
      </form>
    </div>
  </section>
</template>
