<script setup lang="ts">
import { computed, ref } from 'vue';
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
const selectedDetailsCard = ref<'accessibility' | 'browser' | 'default'>('default');
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
  <h1 class="h2" id="plan-details-heading">{{ plan.id }}</h1>
  <ul class="nav nav-pills my-3">
    <li class="nav-item" role="presentation">
      <button
        id="plan-default-card"
        :class="['nav-link', { active: selectedDetailsCard === 'default' }]"
        type="button"
        :aria-controls="'plan-default-panel'"
        :aria-selected="selectedDetailsCard === 'default'"
        @click="selectedDetailsCard = 'default'">{{ t('editor.defaultTab') }}</button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        id="plan-browser-card"
        :class="['nav-link', { active: selectedDetailsCard === 'browser' }]"
        type="button"
        :aria-controls="'plan-browser-panel'"
        :aria-selected="selectedDetailsCard === 'browser'"
        @click="selectedDetailsCard = 'browser'">{{ t('editor.browserTab') }}</button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        id="plan-accessibility-card"
        :class="['nav-link', { active: selectedDetailsCard === 'accessibility' }]"
        type="button"
        :aria-controls="'plan-accessibility-panel'"
        :aria-selected="selectedDetailsCard === 'accessibility'"
        @click="selectedDetailsCard = 'accessibility'">{{ t('editor.accessibilityTab') }}</button>
    </li>
  </ul>
  <section aria-labelledby="plan-details-heading">
    <div v-if="selectedDetailsCard === 'default'"
      id="plan-default-panel"
      aria-labelledby="plan-default-card"
      class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
          <label
            class="form-label"
            for="plan-locale">{{ t('editor.planLocale') }}</label>
          <select
            id="plan-locale"
            :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-error' : undefined"
            :class="['form-select', { 'is-invalid': shouldShowPlanLocaleIssues }]"
            :value="plan.defaults.locale"
            @blur="validatePlanLocale"
            @change="changePlanLocale">
            <option v-if="hasUnknownPlanLocale"
              :value="plan.defaults.locale"
              disabled>{{ plan.defaults.locale }}</option>
            <option v-for="locale in localeCatalogue"
              :key="locale"
              :value="locale">{{ locale }}</option>
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
        </template>
        <template v-else>
          <p>{{ t('editor.usingStagehandDefaultStepTimeout', { timeout: effectivePlanTimeout }) }}</p>
          <dl class="mb-0">
            <dt class="form-label">{{ t('editor.planLocale') }}</dt>
            <dd>{{ plan.defaults.locale }}</dd>
            <dt>{{ t('editor.defaultStepTimeout') }}</dt>
            <dd class="mb-0">{{ effectivePlanTimeout }}</dd>
          </dl>
        </template>
      </div>
    </div>
    <div v-if="selectedDetailsCard === 'browser'" id="plan-browser-panel" aria-labelledby="plan-browser-card" class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
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
        </template>
        <template v-else>
          <dl class="mb-0">
            <dt>{{ t('editor.headless') }}</dt>
            <dd>{{ browserSettings.headless ? t('editor.enabled') : t('editor.disabled') }}</dd>
            <dt>{{ t('editor.viewport') }}</dt>
            <dd>{{ browserSettings.viewport?.width }} × {{ browserSettings.viewport?.height }}</dd>
            <dt>{{ t('editor.timeZone') }}</dt>
            <dd class="mb-0">{{ browserSettings.timeZone }}</dd>
          </dl>
        </template>
      </div>
    </div>
    <div v-if="selectedDetailsCard === 'accessibility'" id="plan-accessibility-panel" aria-labelledby="plan-accessibility-card" class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
          <div class="form-check">
            <input id="accessibility-enabled" class="form-check-input" type="checkbox" :checked="accessibilitySettings.enabled" @change="changeAccessibilitySettings({ enabled: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-enabled">{{ t('editor.accessibilityEnabled') }}</label>
          </div>
          <AccessibilityTagSelector id="plan-accessibility-tags" :model-value="accessibilitySettings.tags" @update:model-value="changeAccessibilitySettings({ tags: $event })" />
          <div class="form-check">
            <input id="accessibility-fail-on-violation" class="form-check-input" type="checkbox" :checked="accessibilitySettings.failOnViolation" @change="changeAccessibilitySettings({ failOnViolation: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-fail-on-violation">{{ t('editor.failOnViolation') }}</label>
          </div>
        </template>
        <template v-else>
          <dl class="mb-0">
            <dt>{{ t('editor.accessibilityEnabled') }}</dt>
            <dd>{{ accessibilitySettings.enabled ? t('editor.enabled') : t('editor.disabled') }}</dd>
            <dt>{{ t('editor.failOnViolation') }}</dt>
            <dd>{{ accessibilitySettings.failOnViolation ? t('editor.enabled') : t('editor.disabled') }}</dd>
            <dt>{{ t('editor.accessibilityRuleTags') }}</dt>
            <dd class="mb-0">{{ accessibilitySettings.tags?.length ? accessibilitySettings.tags.join(', ') : t('editor.allRules') }}</dd>
          </dl>
        </template>
      </div>
    </div>
    <slot />
  </section>
</template>

<style scoped>
</style>
