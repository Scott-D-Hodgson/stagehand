<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { validateCase, type ValidationIssue } from '@stagehand/plan-schema';
import { defaultAccessibilitySettings, defaultPlanBrowserSettings, type AccessibilitySettingsDraft, type CaseBrowserSettingsDraft, type CaseDraft, type PlanBrowserSettingsDraft } from '../../document/plan-draft';
import { getInvalidCaseStepIndexes } from '../../document/validation';
import CaseStepEditor from '../Steps/CaseStepEditor.vue';
import AccessibilityTagSelector from '../AccessibilityTagSelector.vue';
import IconOnlyButton from '../IconOnlyButton.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  caseCount: number;
  caseIndex: number;
  casePath: string;
  editing: boolean;
  expanded: boolean;
  framed?: boolean;
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
  'remove:step': [path: string, index: number];
  'update:case-id': [path: string, id: string];
  'update:steps': [path: string, steps: unknown[]];
  'update:timeout': [path: string, timeout: unknown | undefined];
}>();

const { t } = useTranslation();
const route = useRoute();
const selectedCase = computed(() => props.caseDrafts[props.casePath]);
const stepPageTitle = computed(() => {
  if (route.name !== 'step') {
    return undefined;
  }
  const index = Number(route.params.stepIndex);
  const step = selectedCase.value?.steps[index] as { action?: string } | undefined;
  return step === undefined ? undefined : `${index + 1}. ${step.action ?? 'Step'}`;
});
const isStepRoute = computed(() => route.name === 'step');
const hasInvalidSteps = computed(() => selectedCase.value === undefined ? false : getInvalidCaseStepIndexes(selectedCase.value).length > 0);
const selectedDetailsTab = ref<'accessibility' | 'browser' | 'default'>('default');
const browserSettingsWereBlurred = ref(false);
const timeoutWasBlurred = ref(false);
const effectivePlanBrowser = computed<PlanBrowserSettingsDraft>(() => ({
  ...defaultPlanBrowserSettings,
  ...props.planBrowser,
  viewport: {
    ...defaultPlanBrowserSettings.viewport,
    ...props.planBrowser?.viewport,
  },
}));
const caseBrowserSettings = computed(() => selectedCase.value?.settings?.browser);
const hasBrowserOverride = computed(() => caseBrowserSettings.value !== undefined);
const caseBrowserIssues = computed<ValidationIssue[]>(() => {
  if (selectedCase.value === undefined) {
    return [];
  }
  const validation = validateCase(selectedCase.value);
  return validation.valid ? [] : validation.issues.filter((issue) => issue.path.startsWith('/settings/browser'));
});
const shouldShowCaseBrowserIssues = computed(() => caseBrowserIssues.value.length > 0 && browserSettingsWereBlurred.value);
const effectivePlanAccessibility = computed<AccessibilitySettingsDraft>(() => ({ ...defaultAccessibilitySettings, ...props.planAccessibility }));
const caseAccessibilitySettings = computed(() => selectedCase.value?.settings?.accessibility);
const hasAccessibilityOverride = computed(() => caseAccessibilitySettings.value !== undefined);
const caseTimeout = computed(() => selectedCase.value?.settings?.timeout);
const hasTimeoutOverride = computed(() => caseTimeout.value !== undefined);
const effectivePlanTimeout = computed(() => typeof props.planTimeout === 'number' ? props.planTimeout : 30_000);
const caseTimeoutIssues = computed<ValidationIssue[]>(() => {
  if (selectedCase.value === undefined) {
    return [];
  }
  const validation = validateCase(selectedCase.value);
  return validation.valid ? [] : validation.issues.filter((issue) => issue.path === '/settings/timeout');
});
const shouldShowCaseTimeoutIssues = computed(() => caseTimeoutIssues.value.length > 0 && timeoutWasBlurred.value);
const usesCardFrame = computed(() => props.framed !== false);

watch(() => props.editing, (editing) => {
  if (!editing) {
    selectedDetailsTab.value = 'default';
  }
});

/*
Emits a changed case identifier for the selected case document.
---
Inputs: Raw identifier text entered by the author.
---
Output: A case-ID update for the owning plan bundle.
*/
function changeCaseId(id: string): void {
  if (props.casePath) {
    emit('update:case-id', props.casePath, id);
  }
}

/*
Creates or removes the current case browser override.
---
Inputs: The override checkbox state.
---
Output: A case-browser update using copied plan values or no override.
*/
function changeBrowserOverride(enabled: boolean): void {
  if (!props.casePath) {
    return;
  }
  browserSettingsWereBlurred.value = false;
  if (!enabled) {
    emit('update:browser', props.casePath, undefined);
    return;
  }
  emit('update:browser', props.casePath, {
    timeZone: effectivePlanBrowser.value.timeZone,
    viewport: {
      height: effectivePlanBrowser.value.viewport?.height,
      width: effectivePlanBrowser.value.viewport?.width,
    },
  });
}

/*
Updates one explicit case browser override while retaining its other fields.
---
Inputs: A partial case-browser settings replacement.
---
Output: A replacement browser override for the selected case.
*/
function changeCaseBrowserSettings(settings: Partial<CaseBrowserSettingsDraft>): void {
  if (!props.casePath || caseBrowserSettings.value === undefined) {
    return;
  }
  emit('update:browser', props.casePath, {
    ...caseBrowserSettings.value,
    ...settings,
    viewport: {
      ...caseBrowserSettings.value.viewport,
      ...settings.viewport,
    },
  });
}

/*
Creates or removes the current case accessibility override.
---
Inputs: The override checkbox state.
---
Output: A case-accessibility update using copied plan values or no override.
*/
function changeAccessibilityOverride(enabled: boolean): void {
  if (!props.casePath) {
    return;
  }
  if (!enabled) {
    emit('update:accessibility', props.casePath, undefined);
    return;
  }
  emit('update:accessibility', props.casePath, { ...effectivePlanAccessibility.value });
}

/*
Updates one explicit case accessibility override while retaining its other fields.
---
Inputs: A partial case-accessibility settings replacement.
---
Output: A replacement accessibility override for the selected case.
*/
function changeCaseAccessibilitySettings(settings: Partial<AccessibilitySettingsDraft>): void {
  if (!props.casePath || caseAccessibilitySettings.value === undefined) {
    return;
  }
  emit('update:accessibility', props.casePath, { ...caseAccessibilitySettings.value, ...settings });
}

/*
Creates or removes the current case step-timeout override.
---
Inputs: The override checkbox state.
---
Output: A case-timeout update using the plan value or no override.
*/
function changeTimeoutOverride(enabled: boolean): void {
  if (!props.casePath) {
    return;
  }
  timeoutWasBlurred.value = false;
  emit('update:timeout', props.casePath, enabled ? effectivePlanTimeout.value : undefined);
}

/*
Emits a raw case timeout override from the editor control.
---
Inputs: A timeout number-input event.
---
Output: A numeric timeout or raw empty text for shared validation.
*/
function changeCaseTimeout(event: Event): void {
  if (!props.casePath) {
    return;
  }
  const input = event.target as HTMLInputElement;
  emit('update:timeout', props.casePath, input.value === '' ? '' : Number(input.value));
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
Passes a step-removal request from the step editor to the owning plan bundle.
---
Inputs: A case-reference path and selected step index.
---
Output: A case-step removal event.
*/
function removeStep(path: string, index: number): void {
  emit('remove:step', path, index);
}

/*
Passes a replacement step list from the step editor to the owning plan bundle.
---
Inputs: A case-reference path and its updated ordered step list.
---
Output: A case-step update event.
*/
function updateSteps(path: string, steps: unknown[]): void {
  emit('update:steps', path, steps);
}
</script>

<template>
  <article :class="[usesCardFrame ? 'card mb-3' : 'mb-4', { 'border-danger': usesCardFrame && hasInvalidSteps, 'case-reference-active': usesCardFrame && expanded }]">
    <div v-if="!isStepRoute" :class="usesCardFrame ? 'card-header' : 'mb-3'">
      <component :is="usesCardFrame ? 'h3' : 'h1'" :class="usesCardFrame ? 'h6' : 'h2'">
        <button v-if="usesCardFrame && editing" class="btn case-reference-toggle p-0 text-start text-decoration-none" type="button" :aria-controls="`case-reference-panel-${caseIndex}`" :aria-expanded="expanded" @click="emit('select-reference', casePath)">
          {{ stepPageTitle ?? `${caseIndex + 1}. ${selectedCase?.id ?? casePath}` }}
        </button>
        <span v-else>{{ stepPageTitle ?? `${caseIndex + 1}. ${selectedCase?.id ?? casePath}` }}</span>
      </component>
      <ul v-if="expanded" class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button :id="`case-default-tab-${caseIndex}`" :class="['nav-link', { active: selectedDetailsTab === 'default' }]" type="button" role="tab" :aria-controls="`case-default-panel-${caseIndex}`" :aria-selected="selectedDetailsTab === 'default'" @click="selectedDetailsTab = 'default'">{{ t('editor.defaultTab') }}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button :id="`case-browser-tab-${caseIndex}`" :class="['nav-link', { active: selectedDetailsTab === 'browser' }]" type="button" role="tab" :aria-controls="`case-browser-panel-${caseIndex}`" :aria-selected="selectedDetailsTab === 'browser'" @click="selectedDetailsTab = 'browser'">{{ t('editor.browserTab') }}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button :id="`case-accessibility-tab-${caseIndex}`" :class="['nav-link', { active: selectedDetailsTab === 'accessibility' }]" type="button" role="tab" :aria-controls="`case-accessibility-panel-${caseIndex}`" :aria-selected="selectedDetailsTab === 'accessibility'" @click="selectedDetailsTab = 'accessibility'">{{ t('editor.accessibilityTab') }}</button>
        </li>
      </ul>
    </div>
    <div v-if="selectedCase && editing && expanded && !isStepRoute" :class="usesCardFrame ? 'card-body' : ''">
      <p class="text-body-secondary text-break">{{ casePath }}</p>
      <section :id="`case-reference-panel-${caseIndex}`" :aria-label="t('editor.caseDetails')">
        <section v-if="selectedDetailsTab === 'default'" :id="`case-default-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-default-tab-${caseIndex}`">
          <label class="form-label" :for="`case-id-${caseIndex}`">
            <span>{{ t('editor.caseIdPrefix') }}</span>
            <abbr :title="t('editor.identifierExpansion')">{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span>
          </label>
          <input v-if="editing" :id="`case-id-${caseIndex}`" :value="selectedCase.id" class="form-control" @input="changeCaseId(($event.target as HTMLInputElement).value)" />
          <p v-else class="form-control-plaintext">{{ selectedCase.id }}</p>
          <div v-if="editing" class="form-check mt-3">
            <input :id="`case-timeout-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="hasTimeoutOverride" @change="changeTimeoutOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" :for="`case-timeout-override-${caseIndex}`">{{ t('editor.overridePlanStepTimeout') }}</label>
          </div>
          <template v-if="editing && hasTimeoutOverride">
            <label class="form-label mt-3" :for="`case-timeout-${caseIndex}`">{{ t('editor.stepTimeout') }}</label>
            <input :id="`case-timeout-${caseIndex}`" :class="['form-control', { 'is-invalid': shouldShowCaseTimeoutIssues }]" min="1" type="number" :value="caseTimeout" @blur="validateCaseTimeout" @input="changeCaseTimeout" />
            <div v-if="shouldShowCaseTimeoutIssues" class="invalid-feedback d-block">{{ caseTimeoutIssues[0]?.message }}</div>
          </template>
          <p v-else-if="editing" class="mt-3 mb-0 text-body-secondary">{{ t('editor.inheritingPlanStepTimeout', { timeout: effectivePlanTimeout }) }}</p>
        </section>
        <section v-else-if="selectedDetailsTab === 'browser'" :id="`case-browser-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-browser-tab-${caseIndex} case-browser-settings-heading-${caseIndex}`">
          <div v-if="editing">
            <div class="form-check mb-3">
              <input :id="`case-browser-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="hasBrowserOverride" @change="changeBrowserOverride(($event.target as HTMLInputElement).checked)" />
              <label class="form-check-label" :for="`case-browser-override-${caseIndex}`">{{ t('editor.overridePlanBrowserSettings') }}</label>
            </div>
            <div v-if="hasBrowserOverride" class="row g-3">
              <div class="col-sm-6">
                <label class="form-label" :for="`case-viewport-width-${caseIndex}`">{{ t('editor.viewportWidth') }}</label>
                <input :id="`case-viewport-width-${caseIndex}`" class="form-control" min="1" type="number" :value="caseBrowserSettings?.viewport?.width" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ viewport: { width: readViewportValue($event) } })" />
              </div>
              <div class="col-sm-6">
                <label class="form-label" :for="`case-viewport-height-${caseIndex}`">{{ t('editor.viewportHeight') }}</label>
                <input :id="`case-viewport-height-${caseIndex}`" class="form-control" min="1" type="number" :value="caseBrowserSettings?.viewport?.height" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ viewport: { height: readViewportValue($event) } })" />
              </div>
              <div class="col-12">
                <label class="form-label" :for="`case-time-zone-${caseIndex}`">{{ t('editor.timeZone') }}</label>
                <input :id="`case-time-zone-${caseIndex}`" class="form-control" :value="caseBrowserSettings?.timeZone" @blur="validateBrowserSettings" @input="changeCaseBrowserSettings({ timeZone: ($event.target as HTMLInputElement).value })" />
              </div>
              <div v-if="shouldShowCaseBrowserIssues" class="invalid-feedback d-block">{{ caseBrowserIssues[0]?.message }}</div>
            </div>
            <p v-else class="mb-0 text-body-secondary">{{ t('editor.inheritingPlanBrowserSettings') }}</p>
          </div>
          <dl v-else class="mb-0">
            <dt>{{ t('editor.browserSettingsSource') }}</dt>
            <dd>{{ hasBrowserOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
            <dt>{{ t('editor.viewport') }}</dt>
            <dd>{{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.width }} × {{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.height }}</dd>
            <dt>{{ t('editor.timeZone') }}</dt>
            <dd class="mb-0">{{ (caseBrowserSettings ?? effectivePlanBrowser).timeZone }}</dd>
          </dl>
        </section>
        <section v-else :id="`case-accessibility-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-accessibility-tab-${caseIndex}`">
          <div class="form-check mb-3">
            <input :id="`case-accessibility-override-${caseIndex}`" class="form-check-input" type="checkbox" :checked="hasAccessibilityOverride" @change="changeAccessibilityOverride(($event.target as HTMLInputElement).checked)" />
            <label class="form-check-label" :for="`case-accessibility-override-${caseIndex}`">{{ t('editor.overridePlanAccessibilitySettings') }}</label>
          </div>
          <div v-if="hasAccessibilityOverride" class="d-grid gap-3">
            <div class="form-check">
              <input :id="`case-accessibility-enabled-${caseIndex}`" class="form-check-input" type="checkbox" :checked="caseAccessibilitySettings?.enabled" @change="changeCaseAccessibilitySettings({ enabled: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" :for="`case-accessibility-enabled-${caseIndex}`">{{ t('editor.accessibilityEnabled') }}</label>
            </div>
            <AccessibilityTagSelector :id="`case-accessibility-tags-${caseIndex}`" :model-value="caseAccessibilitySettings?.tags" @update:model-value="changeCaseAccessibilitySettings({ tags: $event })" />
            <div class="form-check">
              <input :id="`case-accessibility-fail-on-violation-${caseIndex}`" class="form-check-input" type="checkbox" :checked="caseAccessibilitySettings?.failOnViolation" @change="changeCaseAccessibilitySettings({ failOnViolation: ($event.target as HTMLInputElement).checked })" />
              <label class="form-check-label" :for="`case-accessibility-fail-on-violation-${caseIndex}`">{{ t('editor.failOnViolation') }}</label>
            </div>
          </div>
          <p v-else class="mb-0 text-body-secondary">{{ t('editor.inheritingPlanAccessibilitySettings') }}</p>
        </section>
      </section>
    </div>
    <div v-else-if="selectedCase && !isStepRoute" :class="usesCardFrame ? 'card-body' : ''">
      <div>
        <section v-if="selectedDetailsTab === 'default'">
          <h2 :id="`case-view-default-heading-${caseIndex}`" class="visually-hidden">
            {{ t('editor.defaultTab') }}
          </h2>
          <div :id="`case-view-default-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-default-tab-${caseIndex}`">
            <div>
              <dl class="mb-0">
                <dt><span>{{ t('editor.caseIdPrefix') }}</span><abbr :title="t('editor.identifierExpansion')">{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span></dt>
                <dd>{{ selectedCase.id }}</dd>
                <dt>{{ t('editor.stepTimeout') }}</dt>
                <dd>{{ caseTimeout ?? effectivePlanTimeout }}</dd>
                <dt>{{ t('editor.stepTimeoutSource') }}</dt>
                <dd class="mb-0">{{ hasTimeoutOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
              </dl>
            </div>
          </div>
        </section>
        <section v-else-if="selectedDetailsTab === 'browser'">
          <h2 :id="`case-view-browser-heading-${caseIndex}`" class="visually-hidden">
            {{ t('editor.browserTab') }}
          </h2>
          <div :id="`case-view-browser-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-browser-tab-${caseIndex}`">
            <div>
              <dl class="mb-0">
                <dt>{{ t('editor.browserSettingsSource') }}</dt>
                <dd>{{ hasBrowserOverride ? t('editor.caseOverride') : t('editor.inherited') }}</dd>
                <dt>{{ t('editor.viewport') }}</dt>
                <dd>{{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.width }} × {{ (caseBrowserSettings ?? effectivePlanBrowser).viewport?.height }}</dd>
                <dt>{{ t('editor.timeZone') }}</dt>
                <dd class="mb-0">{{ (caseBrowserSettings ?? effectivePlanBrowser).timeZone }}</dd>
              </dl>
            </div>
          </div>
        </section>
        <section v-else>
          <h2 :id="`case-view-accessibility-heading-${caseIndex}`" class="visually-hidden">
            {{ t('editor.accessibilityTab') }}
          </h2>
          <div :id="`case-view-accessibility-panel-${caseIndex}`" role="tabpanel" :aria-labelledby="`case-accessibility-tab-${caseIndex}`">
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
        </section>
      </div>
    </div>
    <div v-if="selectedCase" :class="usesCardFrame ? 'card-body border-top' : 'border-top pt-4 mt-4'">
      <CaseStepEditor :case-drafts="props.caseDrafts" :case-index="props.caseIndex" :editing="props.editing && props.expanded" :plan-locale="props.planLocale" :selected-path="props.casePath" @remove:step="removeStep" @update:steps="updateSteps" />
    </div>
    <div v-if="editing && usesCardFrame && !isStepRoute" :class="usesCardFrame ? 'card-footer' : 'border-top pt-3 mt-4'">
      <div class="d-flex justify-content-end">
        <div class="btn-group btn-group-sm" role="group">
          <IconOnlyButton class="btn btn-outline-secondary" :disabled="caseIndex === 0" icon="fa-solid fa-arrow-up" :label="t('editor.moveStepUp')" @click.stop="emit('move-reference', { direction: -1, index: caseIndex })" />
          <IconOnlyButton class="btn btn-outline-secondary" :disabled="caseIndex === caseCount - 1" icon="fa-solid fa-arrow-down" :label="t('editor.moveStepDown')" @click.stop="emit('move-reference', { direction: 1, index: caseIndex })" />
          <IconOnlyButton class="btn btn-outline-secondary" icon="fa-solid fa-pen" :label="t('editor.edit')" @click.stop="emit('edit-reference', caseIndex)" />
          <IconOnlyButton class="btn btn-outline-danger" icon="fa-solid fa-minus" :label="t('editor.removeCaseReference')" @click.stop="emit('remove-reference', caseIndex)" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.case-reference-active:not(.border-danger) {
  border-color: var(--bs-emphasis-color);
}
</style>
