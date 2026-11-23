<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { validateCase, type ValidationIssue } from '@stagehand/plan-schema';
import { defaultAccessibilitySettings, defaultPlanBrowserSettings, type AccessibilitySettingsDraft, type CaseBrowserSettingsDraft, type CaseDraft, type PlanBrowserSettingsDraft } from '../../../services/planDraftService';
import AccessibilityTagSelector from '../../controls/AccessibilityTagSelector.vue';

interface CaseBrowserFormSettings {
  timeZone?: string;
  type?: 'chromium';
  viewport: {
    height: number | string;
    width: number | string;
  };
}

interface CaseBrowserFormSettingsUpdate {
  timeZone?: string;
  type?: 'chromium';
  viewport?: Partial<CaseBrowserFormSettings['viewport']>;
}

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  caseCount: number;
  caseIndex: number;
  casePath: string;
  editing: boolean;
  expanded: boolean;
  planAccessibility: AccessibilitySettingsDraft | undefined;
  planBrowser: PlanBrowserSettingsDraft | undefined;
  planLocale: string;
  planTimeout: unknown;
}>();

const emit = defineEmits<{
  'edit-reference': [index: number];
  'move-reference': [options: { direction: -1 | 1; index: number }];
  'remove-reference': [index: number];
  'select-reference': [path: string];
  'update:accessibility': [path: string, accessibility: AccessibilitySettingsDraft | undefined];
  'update:browser': [path: string, browser: CaseBrowserSettingsDraft | undefined];
  'update:case-id': [path: string, id: string];
  'update:timeout': [path: string, timeout: unknown | undefined];
}>();

const { t } = useTranslation();

/*
Determines the case currently addressed by this page.
---
Inputs: The case draft collection and active case path.
---
Output: The selected case draft, when present.
*/
const selectedCase = computed(
  () => props.caseDrafts[props.casePath]
);
const selectedDetailsCard = ref<'accessibility' | 'browser' | 'default' | 'overrides'>('default');
const browserSettingsWereBlurred = ref(false);
const timeoutWasBlurred = ref(false);
const formCaseId = ref('');
const formTimeout = ref<unknown>();

/*
Determines the browser settings inherited from the plan.
---
Inputs: Default browser settings and the optional plan browser settings.
---
Output: Complete plan browser settings.
*/
const effectivePlanBrowser = computed<PlanBrowserSettingsDraft>(
  () => ({
    ...defaultPlanBrowserSettings,
    ...props.planBrowser,
    viewport: {
      ...defaultPlanBrowserSettings.viewport,
      ...props.planBrowser?.viewport,
    },
  })
);

/*
Determines the selected case browser override.
---
Inputs: The selected case settings.
---
Output: The browser override, when configured.
*/
const caseBrowserSettings = computed(
  () => selectedCase.value?.settings?.browser
);
const formBrowserSettings = ref<CaseBrowserFormSettings | undefined>();

/*
Determines whether the selected case overrides plan browser settings.
---
Inputs: The selected case browser settings.
---
Output: Whether a browser override exists.
*/
const hasBrowserOverride = computed(
  () => caseBrowserSettings.value !== undefined
);

/*
Determines validation issues for selected case browser settings.
---
Inputs: The selected case draft.
---
Output: Browser-setting validation issues.
*/
const caseBrowserIssues = computed<ValidationIssue[]>(
  () => {
    if (selectedCase.value === undefined) {
      return [];
    }
    const validation = validateCase(selectedCase.value);
    return validation.valid ? [] : validation.issues.filter((issue) => issue.path.startsWith('/settings/browser'));
  }
);

/*
Determines whether case browser validation feedback is visible.
---
Inputs: Case browser issues and blur state.
---
Output: Whether browser feedback should be shown.
*/
const shouldShowCaseBrowserIssues = computed(
  () => caseBrowserIssues.value.length > 0 && browserSettingsWereBlurred.value
);

/*
Determines time-zone issues for selected case browser settings.
---
Inputs: Case browser validation issues.
---
Output: Time-zone-specific validation issues.
*/
const caseTimeZoneIssues = computed(
  () => caseBrowserIssues.value.filter((issue) => issue.path === '/settings/browser/timeZone')
);

/*
Determines accessibility settings inherited from the plan.
---
Inputs: Default accessibility settings and plan accessibility settings.
---
Output: Complete inherited accessibility settings.
*/
const effectivePlanAccessibility = computed<AccessibilitySettingsDraft>(
  () => ({ ...defaultAccessibilitySettings, ...props.planAccessibility })
);

/*
Determines the selected case accessibility override.
---
Inputs: The selected case settings.
---
Output: The accessibility override, when configured.
*/
const caseAccessibilitySettings = computed(
  () => selectedCase.value?.settings?.accessibility
);
const formAccessibilitySettings = ref<AccessibilitySettingsDraft | undefined>();

/*
Determines whether the selected case overrides plan accessibility settings.
---
Inputs: The selected case accessibility settings.
---
Output: Whether an accessibility override exists.
*/
const hasAccessibilityOverride = computed(
  () => caseAccessibilitySettings.value !== undefined
);

/*
Determines the selected case timeout override.
---
Inputs: The selected case settings.
---
Output: The timeout override, when configured.
*/
const caseTimeout = computed(
  () => selectedCase.value?.settings?.timeout
);

/*
Determines whether the selected case overrides the plan timeout.
---
Inputs: The selected case timeout.
---
Output: Whether a timeout override exists.
*/
const hasTimeoutOverride = computed(
  () => caseTimeout.value !== undefined
);

/*
Determines the timeout inherited from the plan.
---
Inputs: The optional plan timeout.
---
Output: The configured timeout or the 30,000 ms default.
*/
const effectivePlanTimeout = computed(
  () => typeof props.planTimeout === 'number' ? props.planTimeout : 30_000
);

/*
Determines validation issues for the selected case timeout.
---
Inputs: The selected case draft.
---
Output: Timeout-specific validation issues.
*/
const caseTimeoutIssues = computed<ValidationIssue[]>(
  () => {
    if (selectedCase.value === undefined) {
      return [];
    }
    const validation = validateCase(selectedCase.value);
    return validation.valid ? [] : validation.issues.filter((issue) => issue.path === '/settings/timeout');
  }
);

/*
Determines whether case timeout validation feedback is visible.
---
Inputs: Case timeout issues and blur state.
---
Output: Whether timeout feedback should be shown.
*/
const shouldShowCaseTimeoutIssues = computed(
  () => caseTimeoutIssues.value.length > 0 && timeoutWasBlurred.value
);

/*
Determines whether the local case ID form is valid.
---
Inputs: The case ID form value.
---
Output: Whether the case ID is non-empty.
*/
const isFormCaseIdValid = computed(
  () => formCaseId.value.trim() !== ''
);

/*
Determines whether the local timeout form value is valid.
---
Inputs: The optional timeout form value.
---
Output: Whether the value is omitted or a positive integer.
*/
const isFormTimeoutValid = computed(
  () => formTimeout.value === undefined || (typeof formTimeout.value === 'number' && Number.isInteger(formTimeout.value) && formTimeout.value >= 1)
);

/*
Determines whether local browser settings are valid.
---
Inputs: The optional browser viewport form values.
---
Output: Whether absent settings or positive dimensions are supplied.
*/
const isFormBrowserSettingsValid = computed(
  () => formBrowserSettings.value === undefined || (isPositiveViewportValue(formBrowserSettings.value.viewport.width) && isPositiveViewportValue(formBrowserSettings.value.viewport.height))
);

/*
Determines whether invalid case browser settings should show feedback.
---
Inputs: Browser blur state and browser form validity.
---
Output: Whether browser feedback should be shown.
*/
const shouldShowFormBrowserSettingsIssues = computed(
  () => browserSettingsWereBlurred.value && !isFormBrowserSettingsValid.value
);

/*
Determines whether the case browser viewport width is invalid.
---
Inputs: The optional browser width form value.
---
Output: Whether the width must be corrected.
*/
const hasInvalidFormViewportWidth = computed(
  () => formBrowserSettings.value !== undefined && !isPositiveViewportValue(formBrowserSettings.value.viewport.width)
);

/*
Determines whether the case browser viewport height is invalid.
---
Inputs: The optional browser height form value.
---
Output: Whether the height must be corrected.
*/
const hasInvalidFormViewportHeight = computed(
  () => formBrowserSettings.value !== undefined && !isPositiveViewportValue(formBrowserSettings.value.viewport.height)
);

watch(selectedCase, (caseDraft) => {
  formCaseId.value = caseDraft?.id ?? '';
  formTimeout.value = caseDraft?.settings?.timeout;
  formBrowserSettings.value = caseDraft?.settings?.browser === undefined ? undefined : createCaseBrowserFormSettings(caseDraft.settings.browser);
  formAccessibilitySettings.value = caseDraft?.settings?.accessibility === undefined ? undefined : structuredClone(toRaw(caseDraft.settings.accessibility));
}, { immediate: true });

/*
Emits a changed case identifier for the selected case document.
---
Inputs: Raw identifier text entered by the author.
---
Output: A case-ID update for the owning plan bundle.
*/
function changeCaseId(id: string): void {
  formCaseId.value = id;
}

/*
Applies the valid local Case ID form to the active case draft.
---
Inputs: A non-empty case identifier.
---
Output: One persisted case-ID update.
*/
function applyCaseId(): void {
  if (!props.casePath || !isFormCaseIdValid.value) {
    return;
  }
  emit('update:case-id', props.casePath, formCaseId.value);
}

/*
Creates or removes the current case browser override.
---
Inputs: The override checkbox state.
---
Output: A case-browser update using copied plan values or no override.
*/
function changeBrowserOverride(enabled: boolean): void {
  browserSettingsWereBlurred.value = false;
  if (!enabled) {
    formBrowserSettings.value = undefined;
    return;
  }
  formBrowserSettings.value = createCaseBrowserFormSettings(effectivePlanBrowser.value);
}

/*
Updates one explicit case browser override while retaining its other fields.
---
Inputs: A partial case-browser settings replacement.
---
Output: A replacement browser override for the selected case.
*/
function changeCaseBrowserSettings(settings: CaseBrowserFormSettingsUpdate): void {
  if (formBrowserSettings.value === undefined) {
    return;
  }
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
Creates browser form fields with concrete editable viewport values.
---
Inputs: Raw case or inherited plan browser settings.
---
Output: Browser form data with numeric or textual viewport fields.
*/
function createCaseBrowserFormSettings(settings: CaseBrowserSettingsDraft | PlanBrowserSettingsDraft): CaseBrowserFormSettings {
  return {
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

/*
Applies the local case browser form to the active case draft.
---
Inputs: An optional valid case browser override.
---
Output: One persisted case browser update.
*/
function applyCaseBrowserSettings(): void {
  if (!props.casePath || (formBrowserSettings.value !== undefined && (!isPositiveViewportValue(formBrowserSettings.value.viewport.width) || !isPositiveViewportValue(formBrowserSettings.value.viewport.height)))) {
    return;
  }
  emit('update:browser', props.casePath, formBrowserSettings.value);
}

/*
Creates or removes the current case accessibility override.
---
Inputs: The override checkbox state.
---
Output: A case-accessibility update using copied plan values or no override.
*/
function changeAccessibilityOverride(enabled: boolean): void {
  if (!enabled) {
    formAccessibilitySettings.value = undefined;
    return;
  }
  formAccessibilitySettings.value = structuredClone(toRaw(effectivePlanAccessibility.value));
}

/*
Updates one explicit case accessibility override while retaining its other fields.
---
Inputs: A partial case-accessibility settings replacement.
---
Output: A replacement accessibility override for the selected case.
*/
function changeCaseAccessibilitySettings(settings: Partial<AccessibilitySettingsDraft>): void {
  if (formAccessibilitySettings.value === undefined) {
    return;
  }
  formAccessibilitySettings.value = { ...formAccessibilitySettings.value, ...settings, tags: settings.tags === undefined ? formAccessibilitySettings.value.tags : [...settings.tags] };
}

/*
Applies the local case accessibility form to the active case draft.
---
Inputs: An optional complete accessibility override.
---
Output: One persisted case accessibility update.
*/
function applyCaseAccessibilitySettings(): void {
  if (props.casePath) {
    emit('update:accessibility', props.casePath, formAccessibilitySettings.value);
  }
}

/*
Creates or removes the current case step-timeout override.
---
Inputs: The override checkbox state.
---
Output: A case-timeout update using the plan value or no override.
*/
function changeTimeoutOverride(enabled: boolean): void {
  timeoutWasBlurred.value = false;
  formTimeout.value = enabled ? effectivePlanTimeout.value : undefined;
}

/*
Emits a raw case timeout override from the editor control.
---
Inputs: A timeout number-input event.
---
Output: A numeric timeout or raw empty text for shared validation.
*/
function changeCaseTimeout(event: Event): void {
  const input = event.target as HTMLInputElement;
  formTimeout.value = input.value === '' ? '' : Number(input.value);
}

/*
Applies the valid local case timeout form to the active case draft.
---
Inputs: An omitted or positive whole-number timeout.
---
Output: One persisted case-timeout update.
*/
function applyCaseTimeout(): void {
  timeoutWasBlurred.value = true;
  if (!props.casePath || !isFormTimeoutValid.value) {
    return;
  }
  emit('update:timeout', props.casePath, formTimeout.value);
}

/*
Marks the case timeout field as ready to show shared validation feedback.
---
Inputs: The case timeout blur event.
---
Output: Enables field-level validation feedback.
*/
function validateCaseTimeout(): void {
  timeoutWasBlurred.value = true;
}

/*
Converts a case viewport number-input into raw draft data.
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
Marks case browser settings as ready for shared validation feedback.
---
Inputs: A blur event from a browser-override control.
---
Output: Enables case browser-settings validation feedback.
*/
function validateBrowserSettings(): void {
  browserSettingsWereBlurred.value = true;
}

/*
Formats case browser-setting validation feedback for the active interface language.
---
Inputs: A shared validation issue, when one applies to a field.
---
Output: A translated field-level message.
*/
function formatBrowserSettingIssue(issue: ValidationIssue | undefined): string {
  if (issue?.message === 'must be >= 1') {
    return t('editor.viewportMinimum');
  }
  return issue?.message ?? '';
}

</script>

<template>
  <h1
    class="h2"
    id="case-details-heading"
  >{{ `${caseIndex + 1}. ${selectedCase?.id ?? casePath}` }}</h1>
  <ul
    class="nav nav-pills my-3"
  >
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        :id="`case-default-card-${caseIndex}`"
        :class="['nav-link', { active: selectedDetailsCard === 'default' }]"
        type="button"
        :aria-controls="`case-default-panel-${caseIndex}`"
        :aria-selected="selectedDetailsCard === 'default'"
        @click="selectedDetailsCard = 'default'"
      >{{ t('editor.defaultTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        :id="`case-overrides-card-${caseIndex}`"
        :class="['nav-link', { active: selectedDetailsCard === 'overrides' }]"
        type="button"
        :aria-controls="`case-overrides-panel-${caseIndex}`"
        :aria-selected="selectedDetailsCard === 'overrides'"
        @click="selectedDetailsCard = 'overrides'"
      >{{ t('editor.overridesTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        :id="`case-browser-card-${caseIndex}`"
        :class="['nav-link', { active: selectedDetailsCard === 'browser' }]"
        type="button"
        :aria-controls="`case-browser-panel-${caseIndex}`"
        :aria-selected="selectedDetailsCard === 'browser'"
        @click="selectedDetailsCard = 'browser'"
      >{{ t('editor.browserTab') }}</button>
    </li>
    <li
      class="nav-item"
      role="presentation"
    >
      <button
        :id="`case-accessibility-card-${caseIndex}`"
        :class="['nav-link', { active: selectedDetailsCard === 'accessibility' }]"
        type="button"
        :aria-controls="`case-accessibility-panel-${caseIndex}`"
        :aria-selected="selectedDetailsCard === 'accessibility'"
        @click="selectedDetailsCard = 'accessibility'"
      >{{ t('editor.accessibilityTab') }}</button>
    </li>
  </ul>
  <section
    aria-labelledby="case-details-heading"
  >
    <div
      v-if="selectedCase && selectedDetailsCard === 'default'"
      id="case-default-panel"
      aria-labelledby="case-default-card"
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
            :for="`case-id-${caseIndex}`"
          >
            <span>{{ t('editor.caseIdPrefix') }}</span>
            <abbr
              :title="t('editor.identifierExpansion')"
            >{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span>
          </label>
          <input
            :id="`case-id-${caseIndex}`"
            :value="formCaseId"
            class="form-control"
            @input="changeCaseId(($event.target as HTMLInputElement).value)"
          />
          <button
            class="btn btn-primary mt-3"
            type="button"
            :disabled="!isFormCaseIdValid"
            @click="applyCaseId"
          >{{ t('editor.apply') }}</button>
        </template>
        <template v-else>
          <div :id="`case-view-default-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-default-card-${caseIndex}`">
            <div>
              <dl class="mb-0">
                <dt><span>{{ t('editor.caseIdPrefix') }}</span><abbr :title="t('editor.identifierExpansion')">{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span></dt>
                <dd>{{ selectedCase.id }}</dd>
              </dl>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="selectedCase && selectedDetailsCard === 'overrides'" :id="`case-overrides-panel-${caseIndex}`" :aria-labelledby="`case-overrides-card-${caseIndex}`" class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <h2 class="h3">{{ t('editor.overridesTab') }}</h2>
        <template v-if="editing">
          <div class="form-check">
            <input :id="`case-timeout-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="formTimeout !== undefined" @change="changeTimeoutOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" :for="`case-timeout-override-${caseIndex}`">{{ t('editor.overridePlanStepTimeout') }}</label>
          </div>
          <template v-if="formTimeout !== undefined">
            <label class="form-label mt-3" :for="`case-timeout-${caseIndex}`">{{ t('editor.stepTimeout') }}</label>
            <input :id="`case-timeout-${caseIndex}`" :class="['form-control', { 'is-invalid': shouldShowCaseTimeoutIssues }]" min="1" type="number" :value="formTimeout" @blur="validateCaseTimeout" @input="changeCaseTimeout" />
            <div v-if="shouldShowCaseTimeoutIssues" class="invalid-feedback d-block">{{ caseTimeoutIssues[0]?.message }}</div>
          </template>
          <p v-else class="mt-3 mb-0 text-body-secondary">{{ t('editor.inheritingPlanStepTimeout', { timeout: effectivePlanTimeout }) }}</p>
          <button class="btn btn-primary mt-3" type="button" :disabled="!isFormTimeoutValid" @click="applyCaseTimeout">{{ t('editor.apply') }}</button>
        </template>
        <dl v-else class="mb-0">
          <dt>{{ t('editor.stepTimeout') }}</dt>
          <dd>{{ caseTimeout ?? effectivePlanTimeout }}</dd>
          <dt>{{ t('editor.stepTimeoutSource') }}</dt>
          <dd class="mb-0">{{ hasTimeoutOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
        </dl>
      </div>
    </div>
    <div v-if="selectedCase && selectedDetailsCard === 'browser'"
      id="case-browser-panel"
      aria-labelledby="case-browser-card"
      class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
          <div class="form-check mb-3">
            <input :id="`case-browser-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="formBrowserSettings !== undefined" @change="changeBrowserOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" :for="`case-browser-override-${caseIndex}`">{{ t('editor.overridePlanBrowserSettings') }}</label>
          </div>
          <div v-if="formBrowserSettings" class="row g-3">
            <div class="col-sm-6">
              <label class="form-label" :for="`case-viewport-width-${caseIndex}`">{{ t('editor.viewportWidth') }}</label>
              <input :id="`case-viewport-width-${caseIndex}`" :aria-describedby="hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues ? `case-viewport-width-error-${caseIndex}` : undefined" :class="['form-control', { 'is-invalid': hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues }]" min="1" type="number" :value="formBrowserSettings.viewport?.width" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ viewport: { width: readViewportValue($event) } })" />
              <div v-if="hasInvalidFormViewportWidth && shouldShowFormBrowserSettingsIssues" :id="`case-viewport-width-error-${caseIndex}`" class="invalid-feedback d-block">{{ t('editor.viewportMinimum') }}</div>
            </div>
            <div class="col-sm-6">
              <label class="form-label" :for="`case-viewport-height-${caseIndex}`">{{ t('editor.viewportHeight') }}</label>
              <input :id="`case-viewport-height-${caseIndex}`" :aria-describedby="hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues ? `case-viewport-height-error-${caseIndex}` : undefined" :class="['form-control', { 'is-invalid': hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues }]" min="1" type="number" :value="formBrowserSettings.viewport?.height" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ viewport: { height: readViewportValue($event) } })" />
              <div v-if="hasInvalidFormViewportHeight && shouldShowFormBrowserSettingsIssues" :id="`case-viewport-height-error-${caseIndex}`" class="invalid-feedback d-block">{{ t('editor.viewportMinimum') }}</div>
            </div>
            <div class="col-12">
              <label class="form-label" :for="`case-time-zone-${caseIndex}`">{{ t('editor.timeZone') }}</label>
              <input :id="`case-time-zone-${caseIndex}`" :aria-describedby="caseTimeZoneIssues.length && shouldShowCaseBrowserIssues ? `case-time-zone-error-${caseIndex}` : undefined" :class="['form-control', { 'is-invalid': caseTimeZoneIssues.length && shouldShowCaseBrowserIssues }]" :value="formBrowserSettings.timeZone" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ timeZone: ($event.target as HTMLInputElement).value })" />
              <div v-if="caseTimeZoneIssues.length && shouldShowCaseBrowserIssues" :id="`case-time-zone-error-${caseIndex}`" class="invalid-feedback d-block">{{ formatBrowserSettingIssue(caseTimeZoneIssues[0]) }}</div>
            </div>
          </div>
          <p v-else class="mb-0 text-body-secondary">{{ t('editor.inheritingPlanBrowserSettings') }}</p>
          <button class="btn btn-primary mt-3" type="button" :disabled="!isFormBrowserSettingsValid" @click="applyCaseBrowserSettings">{{ t('editor.apply') }}</button>
        </template>
        <template v-else>
          <div :id="`case-view-browser-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-browser-card-${caseIndex}`">
            <div>
              <dl class="mb-0">
                <dt>{{ t('editor.browserSettingsSource') }}</dt>
                <dd>{{ hasBrowserOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
                <dt>{{ t('editor.viewport') }}</dt>
                <dd>{{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.width }} Ã— {{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.height }}</dd>
                <dt>{{ t('editor.timeZone') }}</dt>
                <dd class="mb-0">{{ (caseBrowserSettings ?? effectivePlanBrowser).timeZone }}</dd>
              </dl>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="selectedCase && selectedDetailsCard === 'accessibility'"
      id="case-accessibility-panel"
      aria-labelledby="case-accessibility-card"
      class="card shadow-sm bg-body-tertiary">
      <div class="card-body">
        <template v-if="editing">
          <div class="form-check mb-3">
            <input :id="`case-accessibility-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="formAccessibilitySettings !== undefined" @change="changeAccessibilityOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" :for="`case-accessibility-override-${caseIndex}`">{{ t('editor.overridePlanAccessibilitySettings') }}</label>
          </div>
          <div v-if="formAccessibilitySettings" class="d-grid gap-3">
            <div class="form-check">
            <input :id="`case-accessibility-enabled-${caseIndex}`" class="form-check-input" type="checkbox" :checked="formAccessibilitySettings.enabled" @change="changeCaseAccessibilitySettings({ enabled: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" :for="`case-accessibility-enabled-${caseIndex}`">{{ t('editor.accessibilityEnabled') }}</label>
            </div>
            <AccessibilityTagSelector :id="`case-accessibility-tags-${caseIndex}`" :model-value="formAccessibilitySettings.tags" @update:model-value="changeCaseAccessibilitySettings({ tags: $event })" />
            <div class="form-check">
            <input :id="`case-accessibility-fail-on-violation-${caseIndex}`" class="form-check-input" type="checkbox" :checked="formAccessibilitySettings.failOnViolation" @change="changeCaseAccessibilitySettings({ failOnViolation: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" :for="`case-accessibility-fail-on-violation-${caseIndex}`">{{ t('editor.failOnViolation') }}</label>
            </div>
          </div>
          <p v-else class="mb-0 text-body-secondary">{{ t('editor.inheritingPlanAccessibilitySettings') }}</p>
          <button class="btn btn-primary mt-3" type="button" @click="applyCaseAccessibilitySettings">{{ t('editor.apply') }}</button>
        </template>
        <template v-else>
          <div :id="`case-view-accessibility-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-accessibility-card-${caseIndex}`">
            <div>
              <dl class="mb-0">
                <dt>{{ t('editor.accessibilitySettingsSource') }}</dt>
                <dd>{{ hasAccessibilityOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
                <dt>{{ t('editor.accessibilityEnabled') }}</dt>
                <dd>{{ (caseAccessibilitySettings ?? effectivePlanAccessibility).enabled ? t('editor.enabled') : t('editor.disabled') }}</dd>
                <dt>{{ t('editor.failOnViolation') }}</dt>
                <dd>{{ (caseAccessibilitySettings ?? effectivePlanAccessibility).failOnViolation ? t('editor.enabled') : t('editor.disabled') }}</dd>
                <dt>{{ t('editor.accessibilityRuleTags') }}</dt>
                <dd class="mb-0">{{ (caseAccessibilitySettings ?? effectivePlanAccessibility).tags?.length ? (caseAccessibilitySettings ?? effectivePlanAccessibility).tags?.join(', ') : t('editor.allRules') }}</dd>
              </dl>
            </div>
          </div>
        </template>
      </div>
    </div>
    <slot />
  </section>
</template>

<style scoped>
</style>
