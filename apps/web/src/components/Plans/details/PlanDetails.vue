<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { defaultAccessibilitySettings, defaultPlanBrowserSettings, type AccessibilitySettingsDraft, type PlanBrowserSettingsDraft, type PlanDraft } from '../../../services/planDraftService';
import type { ValidationIssue } from '@stagehand/plan-schema';
import localeCatalogue from '../../../modules/localization/localeCatalogue.json';
import AccessibilityTagSelector from '../../controls/AccessibilityTagSelector.vue';

interface BrowserFormSettings {
  headless?: boolean;
  timeZone?: string;
  type?: 'chromium';
  viewport: {
    height: number | string;
    width: number | string;
  };
}

interface BrowserFormSettingsUpdate {
  headless?: boolean;
  timeZone?: string;
  type?: 'chromium';
  viewport?: Partial<BrowserFormSettings['viewport']>;
}

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
const selectedDetailsCard = ref<'accessibility' | 'browser' | 'default' | 'overrides'>('default');
const localeWasBlurred = ref(false);
const formLocale = ref(props.plan.defaults.locale);
const timeoutWasBlurred = ref(false);
const browserSettingsWereBlurred = ref(false);
const formTimeout = ref<number | string | undefined>(readTimeoutValue(props.plan.defaults.timeout));

/*
Determines validation issues for the plan locale.
---
Inputs: The plan validation issues.
---
Output: Locale-specific validation issues.
*/
const planLocaleIssues = computed(
  () => props.validationIssues.filter((issue) => issue.path === '/defaults/locale')
);

/*
Determines whether plan locale validation feedback is visible.
---
Inputs: Locale issues, blur state, and validation-request state.
---
Output: Whether locale feedback should be shown.
*/
const shouldShowPlanLocaleIssues = computed(
  () => planLocaleIssues.value.length > 0 && (localeWasBlurred.value || props.validationRequested)
);

/*
Determines whether the plan locale is absent from the catalogue.
---
Inputs: The configured plan locale and locale catalogue.
---
Output: Whether the configured locale is unknown.
*/
const hasUnknownPlanLocale = computed(
  () => !localeCatalogue.includes(props.plan.defaults.locale)
);

/*
Determines whether the plan overrides the default step timeout.
---
Inputs: The plan default timeout.
---
Output: Whether a timeout override is configured.
*/
const hasPlanTimeoutOverride = computed(
  () => props.plan.defaults.timeout !== undefined
);

/*
Determines the effective plan step timeout.
---
Inputs: The optional plan timeout.
---
Output: The configured timeout or the 30,000 ms default.
*/
const effectivePlanTimeout = computed(
  () => typeof props.plan.defaults.timeout === 'number' ? props.plan.defaults.timeout : 30_000
);

/*
Determines validation issues for the plan timeout.
---
Inputs: The plan validation issues.
---
Output: Timeout-specific validation issues.
*/
const planTimeoutIssues = computed(
  () => props.validationIssues.filter((issue) => issue.path === '/defaults/timeout')
);

/*
Determines whether plan timeout validation feedback is visible.
---
Inputs: Timeout issues, blur state, and validation-request state.
---
Output: Whether timeout feedback should be shown.
*/
const shouldShowPlanTimeoutIssues = computed(
  () => planTimeoutIssues.value.length > 0 && (timeoutWasBlurred.value || props.validationRequested)
);

/*
Determines the effective plan browser settings.
---
Inputs: Default browser settings and optional plan browser settings.
---
Output: A complete browser settings object for editing and display.
*/
const browserSettings = computed<PlanBrowserSettingsDraft>(
  () => ({
    ...defaultPlanBrowserSettings,
    ...props.plan.defaults.browser,
    viewport: {
      ...defaultPlanBrowserSettings.viewport,
      ...props.plan.defaults.browser?.viewport,
    },
  })
);
const formBrowserSettings = ref<BrowserFormSettings>(createBrowserFormSettings(browserSettings.value));

/*
Determines validation issues for plan browser settings.
---
Inputs: The plan validation issues.
---
Output: Browser-setting validation issues.
*/
const browserSettingIssues = computed(
  () => props.validationIssues.filter((issue) => issue.path.startsWith('/defaults/browser'))
);

/*
Determines whether plan browser validation feedback is visible.
---
Inputs: Browser issues, blur state, and validation-request state.
---
Output: Whether browser feedback should be shown.
*/
const shouldShowBrowserSettingIssues = computed(
  () => browserSettingIssues.value.length > 0 && (browserSettingsWereBlurred.value || props.validationRequested)
);

/*
Determines time-zone validation issues for plan browser settings.
---
Inputs: Plan browser validation issues.
---
Output: Time-zone-specific validation issues.
*/
const timeZoneIssues = computed(
  () => browserSettingIssues.value.filter((issue) => issue.path === '/defaults/browser/timeZone')
);

/*
Determines the effective plan accessibility settings.
---
Inputs: Default accessibility settings and plan accessibility overrides.
---
Output: A complete accessibility settings object.
*/
const accessibilitySettings = computed<AccessibilitySettingsDraft>(
  () => ({ ...defaultAccessibilitySettings, ...props.plan.defaults.accessibility })
);
const formAccessibilitySettings = ref<AccessibilitySettingsDraft>({ ...accessibilitySettings.value, tags: accessibilitySettings.value.tags === undefined ? undefined : [...accessibilitySettings.value.tags] });

/*
Determines whether the local locale form value is supported.
---
Inputs: The locale form value and locale catalogue.
---
Output: Whether the locale can be applied.
*/
const isFormLocaleValid = computed(
  () => localeCatalogue.includes(formLocale.value)
);

/*
Determines whether both browser viewport form values are positive.
---
Inputs: The browser viewport form fields.
---
Output: Whether browser settings can be applied.
*/
const isFormBrowserSettingsValid = computed(
  () => isPositiveViewportValue(formBrowserSettings.value.viewport.width) && isPositiveViewportValue(formBrowserSettings.value.viewport.height)
);

/*
Determines whether invalid browser settings should show feedback.
---
Inputs: Browser blur state and browser form validity.
---
Output: Whether viewport feedback is visible.
*/
const shouldShowFormBrowserSettingsIssues = computed(
  () => browserSettingsWereBlurred.value && !isFormBrowserSettingsValid.value
);

/*
Determines whether the browser viewport width is invalid.
---
Inputs: The browser viewport width form value.
---
Output: Whether the width must be corrected.
*/
const hasInvalidFormViewportWidth = computed(
  () => !isPositiveViewportValue(formBrowserSettings.value.viewport.width)
);

/*
Determines whether the browser viewport height is invalid.
---
Inputs: The browser viewport height form value.
---
Output: Whether the height must be corrected.
*/
const hasInvalidFormViewportHeight = computed(
  () => !isPositiveViewportValue(formBrowserSettings.value.viewport.height)
);

/*
Determines whether the timeout form value can be applied.
---
Inputs: The optional timeout form value.
---
Output: Whether the value is omitted or a positive integer.
*/
const isFormTimeoutValid = computed(
  () => formTimeout.value === undefined || (typeof formTimeout.value === 'number' && Number.isInteger(formTimeout.value) && formTimeout.value >= 1)
);

watch(() => props.plan.defaults.locale, (locale) => {
  formLocale.value = locale;
  localeWasBlurred.value = false;
});

watch(browserSettings, (settings) => {
  formBrowserSettings.value = createBrowserFormSettings(settings);
});

watch(() => props.plan.defaults.timeout, (timeout) => {
  formTimeout.value = readTimeoutValue(timeout);
  timeoutWasBlurred.value = false;
});

/*
Narrows raw draft timeout data for its editable number control.
---
Inputs: An unvalidated timeout value from the editable plan draft.
---
Output: A number, raw text, or omitted form timeout.
*/
function readTimeoutValue(value: unknown): number | string | undefined {
  return typeof value === 'number' || typeof value === 'string' ? value : undefined;
}

/*
Creates browser form fields with concrete editable viewport values.
---
Inputs: Raw plan browser settings and their merged defaults.
---
Output: Browser form data with numeric or textual viewport fields.
*/
function createBrowserFormSettings(settings: PlanBrowserSettingsDraft): BrowserFormSettings {
  return {
    headless: settings.headless,
    timeZone: settings.timeZone,
    type: settings.type,
    viewport: {
      height: readViewportField(settings.viewport?.height),
      width: readViewportField(settings.viewport?.width),
    },
  };
}

/*
Narrows one raw viewport field for an editable number control.
---
Inputs: An unvalidated viewport dimension.
---
Output: A number or raw text, defaulting to empty text when unsupported.
*/
function readViewportField(value: unknown): number | string {
  return typeof value === 'number' || typeof value === 'string' ? value : '';
}

/*
Determines whether one editable viewport dimension is valid.
---
Inputs: A numeric or textual viewport form value.
---
Output: Whether the value is a positive number.
*/
function isPositiveViewportValue(value: number | string): boolean {
  return typeof value === 'number' && value >= 1;
}

watch(accessibilitySettings, (settings) => {
  formAccessibilitySettings.value = { ...settings, tags: settings.tags === undefined ? undefined : [...settings.tags] };
});

/*
Emits a selected locale from the maintained application catalogue.
---
Inputs: A plan-locale select event.
---
Output: The selected locale code.
*/
function changePlanLocale(event: Event): void {
  formLocale.value = (event.target as HTMLSelectElement).value;
}

/*
Applies the valid local Plan Locale form to the active plan draft.
---
Inputs: The selected supported locale.
---
Output: One persisted plan-locale update.
*/
function applyPlanLocale(): void {
  localeWasBlurred.value = true;
  if (!isFormLocaleValid.value) {
    return;
  }
  emit('update:locale', formLocale.value);
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
  formTimeout.value = enabled ? effectivePlanTimeout.value : undefined;
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
  formTimeout.value = input.value === '' ? '' : Number(input.value);
}

/*
Applies the valid local plan timeout override to the active plan draft.
---
Inputs: An optional positive whole-number timeout.
---
Output: One persisted plan-timeout update.
*/
function applyPlanTimeout(): void {
  timeoutWasBlurred.value = true;
  if (!isFormTimeoutValid.value) {
    return;
  }
  emit('update:timeout', formTimeout.value);
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
function changeBrowserSettings(settings: BrowserFormSettingsUpdate): void {
  formBrowserSettings.value = {
    ...formBrowserSettings.value,
    ...settings,
    viewport: {
      ...formBrowserSettings.value.viewport,
      ...settings.viewport,
    },
  };
}

/*
Applies the local browser-settings form to the active plan draft.
---
Inputs: The complete local plan browser settings.
---
Output: One persisted browser-settings update.
*/
function applyBrowserSettings(): void {
  browserSettingsWereBlurred.value = true;
  if (!isPositiveViewportValue(formBrowserSettings.value.viewport.width) || !isPositiveViewportValue(formBrowserSettings.value.viewport.height)) {
    return;
  }
  emit('update:browser', formBrowserSettings.value);
}

/*
Emits changed plan-level accessibility defaults while retaining other fields.
---
Inputs: A partial accessibility-settings replacement from plan details.
---
Output: A complete plan-accessibility settings update.
*/
function changeAccessibilitySettings(settings: Partial<AccessibilitySettingsDraft>): void {
  formAccessibilitySettings.value = { ...formAccessibilitySettings.value, ...settings, tags: settings.tags === undefined ? formAccessibilitySettings.value.tags : [...settings.tags] };
}

/*
Applies the local accessibility-settings form to the active plan draft.
---
Inputs: The complete local accessibility configuration.
---
Output: One persisted accessibility-settings update.
*/
function applyAccessibilitySettings(): void {
  emit('update:accessibility', formAccessibilitySettings.value);
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

/*
Formats browser-setting validation feedback for the active interface language.
---
Inputs: A shared validation issue, when one applies to a field.
---
Output: A translated field-level message.
*/
function formatBrowserSettingIssue(issue: { message: string } | undefined): string {
  if (issue?.message === 'must be >= 1') {
    return t('editor.viewportMinimum');
  }
  return issue?.message ?? '';
}
</script>

<template>
  <h1
    class="h2"
    id="plan-details-heading"
  >{{ plan.id }}</h1>
  <ul
    class="nav nav-pills my-3"
  >
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        id="plan-default-card"
        :class="['nav-link', { active: selectedDetailsCard === 'default' }]"
        type="button"
        :aria-controls="'plan-default-panel'"
        :aria-selected="selectedDetailsCard === 'default'"
        @click="selectedDetailsCard = 'default'"
      >{{ t('editor.defaultTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        id="plan-overrides-card"
        :class="['nav-link', { active: selectedDetailsCard === 'overrides' }]"
        type="button"
        :aria-controls="'plan-overrides-panel'"
        :aria-selected="selectedDetailsCard === 'overrides'"
        @click="selectedDetailsCard = 'overrides'"
      >{{ t('editor.overridesTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        id="plan-browser-card"
        :class="['nav-link', { active: selectedDetailsCard === 'browser' }]"
        type="button"
        :aria-controls="'plan-browser-panel'"
        :aria-selected="selectedDetailsCard === 'browser'"
        @click="selectedDetailsCard = 'browser'"
      >{{ t('editor.browserTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        id="plan-accessibility-card"
        :class="['nav-link', { active: selectedDetailsCard === 'accessibility' }]"
        type="button"
        :aria-controls="'plan-accessibility-panel'"
        :aria-selected="selectedDetailsCard === 'accessibility'"
        @click="selectedDetailsCard = 'accessibility'"
      >{{ t('editor.accessibilityTab') }}</button>
    </li>
  </ul>
  <section
    aria-labelledby="plan-details-heading"
  >
    <div
      v-if="selectedDetailsCard === 'default'"
      id="plan-default-panel"
      aria-labelledby="plan-default-card"
      class="card shadow-sm bg-body-tertiary"
    >
      <div
        class="card-body"
      >
        <template
          v-if="editing"
        >
          <label
            class="form-label"
            for="plan-locale"
          >{{ t('editor.planLocale') }}</label>
          <select
            id="plan-locale"
            :aria-describedby="shouldShowPlanLocaleIssues ? 'plan-locale-error' : undefined"
            :class="['form-select', { 'is-invalid': shouldShowPlanLocaleIssues }]"
            :value="formLocale"
            @blur="validatePlanLocale"
            @change="changePlanLocale"
          >
            <option
              v-if="hasUnknownPlanLocale"
              :value="plan.defaults.locale"
              disabled
            >{{ plan.defaults.locale }}</option>
            <option
              v-for="locale in localeCatalogue"
              :key="locale"
              :value="locale"
            >{{ locale }}</option>
          </select>
          <div
            v-if="shouldShowPlanLocaleIssues"
            id="plan-locale-error"
            class="invalid-feedback d-block"
          >{{ planLocaleIssues[0]?.message }}</div>
          <button
            class="btn btn-primary mt-3"
            type="button"
            :disabled="!isFormLocaleValid"
            @click="applyPlanLocale"
          >{{ t('editor.apply') }}</button>
        </template>
        <template v-else>
          <dl class="mb-0">
            <dt class="form-label">{{ t('editor.planLocale') }}</dt>
            <dd class="mb-0">{{ plan.defaults.locale }}</dd>
          </dl>
        </template>
      </div>
    </div>
    <div v-if="selectedDetailsCard === 'overrides'" id="plan-overrides-panel" aria-labelledby="plan-overrides-card" class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <h2 class="h3">{{ t('editor.overridesTab') }}</h2>
        <template v-if="editing">
          <div class="form-check">
            <input id="plan-timeout-override" class="form-check-input" type="checkbox" :checked="formTimeout !== undefined" @change="changePlanTimeoutOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" for="plan-timeout-override">{{ t('editor.overrideStagehandDefaultStepTimeout') }}</label>
          </div>
          <template v-if="formTimeout !== undefined">
            <label class="form-label mt-3" for="plan-timeout">{{ t('editor.defaultStepTimeout') }}</label>
            <input id="plan-timeout" :aria-describedby="shouldShowPlanTimeoutIssues ? 'plan-timeout-error' : undefined" :class="['form-control', { 'is-invalid': shouldShowPlanTimeoutIssues }]" min="1" type="number" :value="formTimeout" @blur="validatePlanTimeout" @input="changePlanTimeout" />
            <div v-if="shouldShowPlanTimeoutIssues" id="plan-timeout-error" class="invalid-feedback d-block">{{ planTimeoutIssues[0]?.message }}</div>
          </template>
          <p v-else class="mt-3 mb-0 text-body-secondary">{{ t('editor.usingStagehandDefaultStepTimeout', { timeout: effectivePlanTimeout }) }}</p>
          <button class="btn btn-primary mt-3" type="button" :disabled="!isFormTimeoutValid" @click="applyPlanTimeout">{{ t('editor.apply') }}</button>
        </template>
        <dl v-else class="mb-0">
          <dt>{{ t('editor.defaultStepTimeout') }}</dt>
          <dd>{{ effectivePlanTimeout }}</dd>
          <dt>{{ t('editor.stepTimeoutSource') }}</dt>
          <dd class="mb-0">{{ hasPlanTimeoutOverride ? t('editor.planOverride') : t('editor.stagehandDefault') }}</dd>
        </dl>
      </div>
    </div>
    <div v-if="selectedDetailsCard === 'browser'" id="plan-browser-panel" aria-labelledby="plan-browser-card" class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
          <div class="col-12">
            <div class="form-check">
            <input id="browser-headless" class="form-check-input" type="checkbox" :checked="formBrowserSettings.headless" @blur="validateBrowserSettings" @change="changeBrowserSettings({ headless: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" for="browser-headless">{{ t('editor.headless') }}</label>
            </div>
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="browser-viewport-width">{{ t('editor.viewportWidth') }}</label>
            <input id="browser-viewport-width" :aria-describedby="hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues ? 'browser-viewport-width-error' : undefined" :class="['form-control', { 'is-invalid': hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues }]" min="1" type="number" :value="formBrowserSettings.viewport?.width" @blur="validateBrowserSettings" @input="changeBrowserSettings({ viewport: { width: readViewportValue($event) } })" />
            <div v-if="hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues" id="browser-viewport-width-error" class="invalid-feedback d-block">{{ t('editor.viewportMinimum') }}</div>
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="browser-viewport-height">{{ t('editor.viewportHeight') }}</label>
            <input id="browser-viewport-height" :aria-describedby="hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues ? 'browser-viewport-height-error' : undefined" :class="['form-control', { 'is-invalid': hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues }]" min="1" type="number" :value="formBrowserSettings.viewport?.height" @blur="validateBrowserSettings" @input="changeBrowserSettings({ viewport: { height: readViewportValue($event) } })" />
            <div v-if="hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues" id="browser-viewport-height-error" class="invalid-feedback d-block">{{ t('editor.viewportMinimum') }}</div>
          </div>
          <div class="col-12">
            <label class="form-label" for="browser-time-zone">{{ t('editor.timeZone') }}</label>
            <input id="browser-time-zone" :aria-describedby="timeZoneIssues.length && shouldShowBrowserSettingIssues ? 'browser-time-zone-error' : undefined" :class="['form-control', { 'is-invalid': timeZoneIssues.length && shouldShowBrowserSettingIssues }]" :value="formBrowserSettings.timeZone" @blur="validateBrowserSettings" @input="changeBrowserSettings({ timeZone: ($event.target as HTMLInputElement).value })" />
            <div v-if="timeZoneIssues.length && shouldShowBrowserSettingIssues" id="browser-time-zone-error" class="invalid-feedback d-block">{{ formatBrowserSettingIssue(timeZoneIssues[0]) }}</div>
          <button class="btn btn-primary" type="button" :disabled="!isFormBrowserSettingsValid" @click="applyBrowserSettings">{{ t('editor.apply') }}</button>
          </div>
        </template>
        <template v-else>
          <dl class="mb-0">
            <dt>{{ t('editor.headless') }}</dt>
            <dd>{{ browserSettings.headless ? t('editor.enabled') : t('editor.disabled') }}</dd>
            <dt>{{ t('editor.viewport') }}</dt>
            <dd>{{ browserSettings.viewport?.width }} Ã— {{ browserSettings.viewport?.height }}</dd>
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
            <input id="accessibility-enabled" class="form-check-input" type="checkbox" :checked="formAccessibilitySettings.enabled" @change="changeAccessibilitySettings({ enabled: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-enabled">{{ t('editor.accessibilityEnabled') }}</label>
          </div>
          <AccessibilityTagSelector id="plan-accessibility-tags" :model-value="formAccessibilitySettings.tags" @update:model-value="changeAccessibilitySettings({ tags: $event })" />
          <div class="form-check">
            <input id="accessibility-fail-on-violation" class="form-check-input" type="checkbox" :checked="formAccessibilitySettings.failOnViolation" @change="changeAccessibilitySettings({ failOnViolation: ($event.target as HTMLInputElement).checked })" />
            <label class="form-check-label" for="accessibility-fail-on-violation">{{ t('editor.failOnViolation') }}</label>
          </div>
          <button class="btn btn-primary mt-3" type="button" @click="applyAccessibilitySettings">{{ t('editor.apply') }}</button>
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
