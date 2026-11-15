<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { defaultAccessibilitySettings, defaultPlanBrowserSettings, type AccessibilitySettingsDraft, type PlanBrowserSettingsDraft, type PlanDraft } from '../../document/plan-draft';
import type { ValidationIssue } from '@stagehand/plan-schema';
import localeCatalogue from '../../localization/locale-catalogue.json';
import AccessibilityTagSelector from '../AccessibilityTagSelector.vue';

const props = defineProps<{
  editing: boolean;
  plan: PlanDraft;
  validationIssues: ValidationIssue[];
  validationRequested: boolean;
}>();

const emit = defineEmits<{
  'update:browser': [browser: PlanBrowserSettingsDraft];
  'update:accessibility': [accessibility: AccessibilitySettingsDraft];
  'update:locale': [locale: string];
  'update:timeout': [timeout: number | string | undefined];
  validate: [];
}>();

const { t } = useTranslation();
const selectedDetailsTab = ref<'accessibility' | 'browser' | 'default'>('default');
const viewDetailsSection = ref<'accessibility' | 'browser' | 'default' | undefined>('default');
const localeWasBlurred = ref(false);
const timeoutWasBlurred = ref(false);
const browserSettingsWereBlurred = ref(false);
const planLocaleIssues = computed(() => props.validationIssues.filter((issue) => issue.path === '/defaults/locale'));
const shouldShowPlanLocaleIssues = computed(() => planLocaleIssues.value.length > 0 && (localeWasBlurred.value || props.validationRequested));
const hasUnknownPlanLocale = computed(() => !localeCatalogue.includes(props.plan.defaults.locale));
const hasPlanTimeoutOverride = computed(() => props.plan.defaults.timeout !== undefined);
const effectivePlanTimeout = computed(() => typeof props.plan.defaults.timeout === 'number' ? props.plan.defaults.timeout : 30_000);
const planTimeoutIssues = computed(() => props.validationIssues.filter((issue) => issue.path === '/defaults/timeout'));
const shouldShowPlanTimeoutIssues = computed(() => planTimeoutIssues.value.length > 0 && (timeoutWasBlurred.value || props.validationRequested));
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
const accessibilitySettings = computed<AccessibilitySettingsDraft>(() => ({ ...defaultAccessibilitySettings, ...props.plan.defaults.accessibility }));

watch(() => props.editing, (editing) => {
  if (!editing) {
    viewDetailsSection.value = 'default';
  }
});

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
Creates or removes the plan-wide step-timeout override.
---
Inputs: The override checkbox state.
---
Output: A configured timeout or an omitted plan override.
*/
function changePlanTimeoutOverride(enabled: boolean): void {
  timeoutWasBlurred.value = false;
  emit('update:timeout', enabled ? effectivePlanTimeout.value : undefined);
}

/*
Emits a raw plan-wide step timeout from the editor control.
---
Inputs: A timeout number-input event.
---
Output: A numeric timeout or raw empty text for shared validation.
*/
function changePlanTimeout(event: Event): void {
  const input = event.target as HTMLInputElement;
  emit('update:timeout', input.value === '' ? '' : Number(input.value));
}

/*
Marks the plan timeout field as ready to show shared validation feedback.
---
Inputs: The plan timeout blur event.
---
Output: Enables field-level validation feedback.
*/
function validatePlanTimeout(): void {
  timeoutWasBlurred.value = true;
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
Emits changed plan-level accessibility defaults while retaining other fields.
---
Inputs: A partial accessibility-settings replacement from plan details.
---
Output: A complete plan-accessibility settings update.
*/
function changeAccessibilitySettings(settings: Partial<AccessibilitySettingsDraft>): void {
  emit('update:accessibility', { ...accessibilitySettings.value, ...settings });
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
        <li class="nav-item" role="presentation">
          <button id="plan-accessibility-tab" :class="['nav-link', { active: selectedDetailsTab === 'accessibility' }]" type="button" role="tab" :aria-controls="'plan-accessibility-panel'" :aria-selected="selectedDetailsTab === 'accessibility'" @click="selectedDetailsTab = 'accessibility'">{{ t('editor.accessibilityTab') }}</button>
        </li>
      </ul>
    </div>
    <div v-if="editing" class="card-body">
      <section v-if="selectedDetailsTab === 'default'" id="plan-default-panel" role="tabpanel" aria-labelledby="plan-default-tab">
        <div v-if="editing">
          <label class="form-label" for="plan-locale">{{ t('editor.planLocale') }}</label>
          <select id="plan-locale" :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-error' : undefined" :class="['form-select', { 'is-invalid': shouldShowPlanLocaleIssues }]" :value="plan.defaults.locale" @blur="validatePlanLocale" @change="changePlanLocale">
            <option v-if="hasUnknownPlanLocale" :value="plan.defaults.locale" disabled>{{ plan.defaults.locale }}</option>
            <option v-for="locale in localeCatalogue" :key="locale" :value="locale">{{ locale }}</option>
          </select>
          <div v-if="shouldShowPlanLocaleIssues" id="plan-locale-error" class="invalid-feedback d-block">{{ planLocaleIssues[0]?.message }}</div>
          <div class="form-check mt-3">
            <input id="plan-timeout-override" class="form-check-input" type="checkbox" :checked="hasPlanTimeoutOverride" @change="changePlanTimeoutOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" for="plan-timeout-override">{{ t('editor.overrideStagehandDefaultStepTimeout') }}</label>
          </div>
          <template v-if="hasPlanTimeoutOverride">
            <label class="form-label mt-3" for="plan-timeout">{{ t('editor.defaultStepTimeout') }}</label>
            <input id="plan-timeout" :aria-describedby="shouldShowPlanTimeoutIssues ? 'plan-timeout-error' : undefined" :class="['form-control', { 'is-invalid': shouldShowPlanTimeoutIssues }]" min="1" type="number" :value="plan.defaults.timeout" @blur="validatePlanTimeout" @input="changePlanTimeout" />
            <div v-if="shouldShowPlanTimeoutIssues" id="plan-timeout-error" class="invalid-feedback d-block">{{ planTimeoutIssues[0]?.message }}</div>
          </template>
          <p v-else class="mt-3 mb-0 text-body-secondary">{{ t('editor.usingStagehandDefaultStepTimeout', { timeout: effectivePlanTimeout }) }}</p>
        </div>
        <dl v-else class="mb-0">
          <dt class="form-label">{{ t('editor.planLocale') }}</dt>
          <dd>{{ plan.defaults.locale }}</dd>
          <dt>{{ t('editor.defaultStepTimeout') }}</dt>
          <dd class="mb-0">{{ effectivePlanTimeout }}</dd>
        </dl>
      </section>
      <section v-else-if="selectedDetailsTab === 'browser'" id="plan-browser-panel" role="tabpanel" aria-labelledby="plan-browser-tab browser-settings-heading">
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
      <section v-else id="plan-accessibility-panel" role="tabpanel" aria-labelledby="plan-accessibility-tab">
        <div v-if="editing" class="d-grid gap-3">
          <div class="form-check">
            <input id="accessibility-enabled" class="form-check-input" type="checkbox" :checked="accessibilitySettings.enabled" @change="changeAccessibilitySettings({ enabled: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-enabled">{{ t('editor.accessibilityEnabled') }}</label>
          </div>
          <AccessibilityTagSelector id="plan-accessibility-tags" :model-value="accessibilitySettings.tags" @update:model-value="changeAccessibilitySettings({ tags: $event })" />
          <div class="form-check">
            <input id="accessibility-fail-on-violation" class="form-check-input" type="checkbox" :checked="accessibilitySettings.failOnViolation" @change="changeAccessibilitySettings({ failOnViolation: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-fail-on-violation">{{ t('editor.failOnViolation') }}</label>
          </div>
        </div>
        <dl v-else class="mb-0">
          <dt>{{ t('editor.accessibilityEnabled') }}</dt>
          <dd>{{ accessibilitySettings.enabled ? t('editor.enabled') : t('editor.disabled') }}</dd>
          <dt>{{ t('editor.failOnViolation') }}</dt>
          <dd>{{ accessibilitySettings.failOnViolation ? t('editor.enabled') : t('editor.disabled') }}</dd>
          <dt>{{ t('editor.accessibilityRuleTags') }}</dt>
          <dd class="mb-0">{{ accessibilitySettings.tags?.length ? accessibilitySettings.tags.join(', ') : t('editor.allRules') }}</dd>
        </dl>
      </section>
    </div>
    <div v-else class="card-body">
      <div class="accordion" id="plan-view-details">
        <div class="accordion-item">
          <h3 id="plan-view-default-heading" class="accordion-header">
            <button :class="['accordion-button', { collapsed: viewDetailsSection !== 'default' }]" type="button" :aria-expanded="viewDetailsSection === 'default'" aria-controls="plan-view-default-panel" @click="viewDetailsSection = viewDetailsSection === 'default' ? undefined : 'default'">{{ t('editor.defaultTab') }}</button>
          </h3>
          <div id="plan-view-default-panel" :class="['accordion-collapse', 'collapse', { show: viewDetailsSection === 'default' }]" aria-labelledby="plan-view-default-heading">
            <div class="accordion-body">
              <dl class="mb-0">
                <dt>{{ t('editor.planLocale') }}</dt>
                <dd>{{ plan.defaults.locale }}</dd>
                <dt>{{ t('editor.defaultStepTimeout') }}</dt>
                <dd class="mb-0">{{ effectivePlanTimeout }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h3 id="plan-view-browser-heading" class="accordion-header">
            <button :class="['accordion-button', { collapsed: viewDetailsSection !== 'browser' }]" type="button" :aria-expanded="viewDetailsSection === 'browser'" aria-controls="plan-view-browser-panel" @click="viewDetailsSection = viewDetailsSection === 'browser' ? undefined : 'browser'">{{ t('editor.browserTab') }}</button>
          </h3>
          <div id="plan-view-browser-panel" :class="['accordion-collapse', 'collapse', { show: viewDetailsSection === 'browser' }]" aria-labelledby="plan-view-browser-heading">
            <div class="accordion-body">
              <dl class="mb-0">
                <dt>{{ t('editor.headless') }}</dt>
                <dd>{{ browserSettings.headless ? t('editor.enabled') : t('editor.disabled') }}</dd>
                <dt>{{ t('editor.viewport') }}</dt>
                <dd>{{ browserSettings.viewport?.width }} × {{ browserSettings.viewport?.height }}</dd>
                <dt>{{ t('editor.timeZone') }}</dt>
                <dd class="mb-0">{{ browserSettings.timeZone }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h3 id="plan-view-accessibility-heading" class="accordion-header">
            <button :class="['accordion-button', { collapsed: viewDetailsSection !== 'accessibility' }]" type="button" :aria-expanded="viewDetailsSection === 'accessibility'" aria-controls="plan-view-accessibility-panel" @click="viewDetailsSection = viewDetailsSection === 'accessibility' ? undefined : 'accessibility'">{{ t('editor.accessibilityTab') }}</button>
          </h3>
          <div id="plan-view-accessibility-panel" :class="['accordion-collapse', 'collapse', { show: viewDetailsSection === 'accessibility' }]" aria-labelledby="plan-view-accessibility-heading">
            <div class="accordion-body">
              <dl class="mb-0">
                <dt>{{ t('editor.accessibilityEnabled') }}</dt>
                <dd>{{ accessibilitySettings.enabled ? t('editor.enabled') : t('editor.disabled') }}</dd>
                <dt>{{ t('editor.failOnViolation') }}</dt>
                <dd>{{ accessibilitySettings.failOnViolation ? t('editor.enabled') : t('editor.disabled') }}</dd>
                <dt>{{ t('editor.accessibilityRuleTags') }}</dt>
                <dd class="mb-0">{{ accessibilitySettings.tags?.length ? accessibilitySettings.tags.join(', ') : t('editor.allRules') }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
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
