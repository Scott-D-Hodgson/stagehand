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
  <section class="card mb-4 shadow-sm" aria-labelledby="plan-details-heading">
    <div class="card-header plan-header bg-body py-2">
      <h2 id="plan-details-heading" class="h5 mb-0">
        {{ plan.id }}
      </h2>
    </div>
    <div class="card-body">
      <form @submit.prevent="emit('validate')">
        <label class="form-label" for="plan-locale">{{ t('editor.planLocale') }}</label>
        <input id="plan-locale" :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-help plan-locale-error' : 'plan-locale-help'" :class="['form-control', { 'is-invalid': shouldShowPlanLocaleIssues }]" :value="plan.defaults.locale" @blur="validatePlanLocale" @input="changePlanLocale" />
        <div id="plan-locale-help" class="form-text">
          <span>{{ t('guidance.neutral.planLocaleHelpBefore') }}</span>
          <abbr :title="t('guidance.neutral.bcpExpansion')">BCP</abbr> 47<span>{{ t('guidance.neutral.planLocaleHelpAfter') }}</span>
        </div>
        <div v-if="shouldShowPlanLocaleIssues" id="plan-locale-error" class="invalid-feedback d-block">{{ planLocaleIssues[0]?.message }}</div>
        <button class="btn btn-primary mt-3" type="submit">{{ t('editor.validate') }}</button>
      </form>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.plan-header {
  position: sticky;
  top: 7rem;
  z-index: 1010;
}
</style>
