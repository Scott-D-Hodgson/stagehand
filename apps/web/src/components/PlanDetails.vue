<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { PlanDraft } from '../document/plan-draft';
import type { ValidationIssue } from '@stagehand/plan-schema';
import localeCatalogue from '../localization/locale-catalogue.json';

const props = defineProps<{
  plan: PlanDraft;
  validationIssues: ValidationIssue[];
  validationRequested: boolean;
}>();

const emit = defineEmits<{
  'update:locale': [locale: string];
  validate: [];
}>();

const { t } = useTranslation();
const localeWasBlurred = ref(false);
const planLocaleIssues = computed(() => props.validationIssues.filter((issue) => issue.path === '/defaults/locale'));
const shouldShowPlanLocaleIssues = computed(() => planLocaleIssues.value.length > 0 && (localeWasBlurred.value || props.validationRequested));
const hasUnknownPlanLocale = computed(() => !localeCatalogue.includes(props.plan.defaults.locale));

/*
Emits a selected locale from the maintained application catalogue.
---
Inputs: A plan-locale select event.
---
Output: The selected locale code.
*/
function changePlanLocale(event: Event): void {
  emit('update:locale', (event.target as HTMLSelectElement).value);
}

/*
Marks the plan-locale field as ready to show shared validation feedback.
---
Inputs: The plan-locale blur event.
---
Output: Enables field-level validation feedback.
*/
function validatePlanLocale(): void {
  localeWasBlurred.value = true;
}
</script>

<template>
  <section class="card mb-4 shadow-sm" aria-labelledby="plan-details-heading">
    <div class="card-header bg-body py-2">
      <h2 id="plan-details-heading" class="h5 mb-0">
        {{ plan.id }}
      </h2>
    </div>
    <div class="card-body">
      <form @submit.prevent="emit('validate')">
        <label class="form-label" for="plan-locale">{{ t('editor.planLocale') }}</label>
        <select id="plan-locale" :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-error' : undefined" :class="['form-select', { 'is-invalid': shouldShowPlanLocaleIssues }]" :value="plan.defaults.locale" @blur="validatePlanLocale" @change="changePlanLocale">
          <option v-if="hasUnknownPlanLocale" :value="plan.defaults.locale" disabled>{{ plan.defaults.locale }}</option>
          <option v-for="locale in localeCatalogue" :key="locale" :value="locale">{{ locale }}</option>
        </select>
        <div v-if="shouldShowPlanLocaleIssues" id="plan-locale-error" class="invalid-feedback d-block">{{ planLocaleIssues[0]?.message }}</div>
        <button class="btn btn-primary mt-3" type="submit">{{ t('editor.validate') }}</button>
      </form>
      <slot />
    </div>
  </section>
</template>

<style scoped>
</style>
