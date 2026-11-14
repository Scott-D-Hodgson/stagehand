<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { defaultPlanBrowserSettings, type PlanBrowserSettingsDraft, type PlanDraft } from '../../document/plan-draft';
import type { ValidationIssue } from '@stagehand/plan-schema';
import localeCatalogue from '../../localization/locale-catalogue.json';

const props = defineProps<{
  editing: boolean;
  plan: PlanDraft;
  validationIssues: ValidationIssue[];
  validationRequested: boolean;
}>();

const emit = defineEmits<{
  'update:browser': [browser: PlanBrowserSettingsDraft];
  'update:locale': [locale: string];
  validate: [];
}>();

const { t } = useTranslation();
const selectedDetailsTab = ref<'browser' | 'default'>('default');
const localeWasBlurred = ref(false);
const browserSettingsWereBlurred = ref(false);
const planLocaleIssues = computed(() => props.validationIssues.filter((issue) => issue.path === '/defaults/locale'));
const shouldShowPlanLocaleIssues = computed(() => planLocaleIssues.value.length > 0 && (localeWasBlurred.value || props.validationRequested));
const hasUnknownPlanLocale = computed(() => !localeCatalogue.includes(props.plan.defaults.locale));
const browserSettings = computed<PlanBrowserSettingsDraft>(() => ({
  ...defaultPlanBrowserSettings,
  ...props.plan.defaults.browser,
  viewport: {
    ...defaultPlanBrowserSettings.viewport,
    ...props.plan.defaults.browser?.viewport,
  },
}));
const browserSettingIssues = computed(() => props.validationIssues.filter((issue) => issue.path.startsWith('/defaults/browser')));
const shouldShowBrowserSettingIssues = computed(() => browserSettingIssues.value.length > 0 && (browserSettingsWereBlurred.value || props.validationRequested));

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

/*
Emits changed plan-level browser defaults while retaining the current fields.
---
Inputs: A partial browser-settings replacement from a plan-details field.
---
Output: A complete plan-browser settings update.
*/
function changeBrowserSettings(settings: Partial<PlanBrowserSettingsDraft>): void {
  emit('update:browser', {
    ...browserSettings.value,
    ...settings,
    viewport: {
      ...browserSettings.value.viewport,
      ...settings.viewport,
    },
  });
}

/*
Converts a browser numeric input into raw draft data.
---
Inputs: A viewport number-input event.
---
Output: A numeric value or raw empty text for shared validation.
*/
function readViewportValue(event: Event): number | string {
  const input = event.target as HTMLInputElement;
  return input.value === '' ? '' : Number(input.value);
}

/*
Marks plan browser settings as ready for shared validation feedback.
---
Inputs: A blur event from a browser-settings control.
---
Output: Enables browser-settings validation feedback.
*/
function validateBrowserSettings(): void {
  browserSettingsWereBlurred.value = true;
}
</script>

<template>
  <section class="card mb-4 shadow-sm" aria-labelledby="plan-details-heading">
    <div v-if="!editing" class="card-header">
      <h2 id="plan-details-heading" class="h5">{{ plan.id }}</h2>
    </div>
    <div v-if="editing" class="card-header">
      <h2 id="plan-details-heading" class="h5">{{ plan.id }}</h2>
      <ul class="nav nav-tabs card-header-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button id="plan-default-tab" :class="['nav-link', { active: selectedDetailsTab === 'default' }]" type="button" role="tab" :aria-controls="'plan-default-panel'" :aria-selected="selectedDetailsTab === 'default'" @click="selectedDetailsTab = 'default'">{{ t('editor.defaultTab') }}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button id="plan-browser-tab" :class="['nav-link', { active: selectedDetailsTab === 'browser' }]" type="button" role="tab" :aria-controls="'plan-browser-panel'" :aria-selected="selectedDetailsTab === 'browser'" @click="selectedDetailsTab = 'browser'">{{ t('editor.browserTab') }}</button>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <section v-if="selectedDetailsTab === 'default'" id="plan-default-panel" role="tabpanel" aria-labelledby="plan-default-tab">
        <div v-if="editing">
          <label class="form-label" for="plan-locale">{{ t('editor.planLocale') }}</label>
          <select id="plan-locale" :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-error' : undefined" :class="['form-select', { 'is-invalid': shouldShowPlanLocaleIssues }]" :value="plan.defaults.locale" @blur="validatePlanLocale" @change="changePlanLocale">
            <option v-if="hasUnknownPlanLocale" :value="plan.defaults.locale" disabled>{{ plan.defaults.locale }}</option>
            <option v-for="locale in localeCatalogue" :key="locale" :value="locale">{{ locale }}</option>
          </select>
          <div v-if="shouldShowPlanLocaleIssues" id="plan-locale-error" class="invalid-feedback d-block">{{ planLocaleIssues[0]?.message }}</div>
        </div>
        <dl v-else class="mb-0">
          <dt class="form-label">{{ t('editor.planLocale') }}</dt>
          <dd class="mb-0">{{ plan.defaults.locale }}</dd>
        </dl>
      </section>
      <section v-else id="plan-browser-panel" role="tabpanel" aria-labelledby="plan-browser-tab browser-settings-heading">
        <div v-if="editing" class="row g-3">
          <div class="col-12">
            <div class="form-check">
              <input id="browser-headless" class="form-check-input" type="checkbox" :checked="browserSettings.headless" @blur="validateBrowserSettings" @change="changeBrowserSettings({ headless: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" for="browser-headless">{{ t('editor.headless') }}</label>
            </div>
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="browser-viewport-width">{{ t('editor.viewportWidth') }}</label>
            <input id="browser-viewport-width" class="form-control" min="1" type="number" :value="browserSettings.viewport?.width" @blur="validateBrowserSettings" @input="changeBrowserSettings({ viewport: { width: readViewportValue($event) } })" />
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="browser-viewport-height">{{ t('editor.viewportHeight') }}</label>
            <input id="browser-viewport-height" class="form-control" min="1" type="number" :value="browserSettings.viewport?.height" @blur="validateBrowserSettings" @input="changeBrowserSettings({ viewport: { height: readViewportValue($event) } })" />
          </div>
          <div class="col-12">
            <label class="form-label" for="browser-time-zone">{{ t('editor.timeZone') }}</label>
            <input id="browser-time-zone" class="form-control" :value="browserSettings.timeZone" @blur="validateBrowserSettings" @input="changeBrowserSettings({ timeZone: ($event.target as HTMLInputElement).value })" />
          </div>
          <div v-if="shouldShowBrowserSettingIssues" class="invalid-feedback d-block">{{ browserSettingIssues[0]?.message }}</div>
        </div>
        <dl v-else class="mb-0">
          <dt>{{ t('editor.headless') }}</dt>
          <dd>{{ browserSettings.headless ? t('editor.enabled') : t('editor.disabled') }}</dd>
          <dt>{{ t('editor.viewport') }}</dt>
          <dd>{{ browserSettings.viewport?.width }} × {{ browserSettings.viewport?.height }}</dd>
          <dt>{{ t('editor.timeZone') }}</dt>
          <dd class="mb-0">{{ browserSettings.timeZone }}</dd>
        </dl>
      </section>
    </div>
    <div class="card-body border-top">
      <slot />
    </div>
    <div v-if="editing" class="card-footer">
      <div class="d-flex gap-2 justify-content-end">
        <button class="btn btn-secondary btn-sm" type="button" @click="emit('validate')">{{ t('editor.validate') }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
