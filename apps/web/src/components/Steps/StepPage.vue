<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { updateCaseAssertionSoft, updateCaseInteractionScrollIntoView, updateCaseStepTimeout, updateCaseStepWaitList, type AccessibilitySettingsDraft, type CaseDraft, type PlanBrowserSettingsDraft } from '../../document/plan-draft';
import CaseDetails from '../Cases/CaseDetails.vue';
import NavigateStepPage from './NavigateStepPage.vue';
import ClickStepPage from './ClickStepPage.vue';
import TypeStepPage from './TypeStepPage.vue';
import FillStepPage from './FillStepPage.vue';
import SelectOptionStepPage from './SelectOptionStepPage.vue';
import AssertTextStepPage from './AssertTextStepPage.vue';
import AssertHtmlStepPage from './AssertHtmlStepPage.vue';
import AssertValueStepPage from './AssertValueStepPage.vue';
import LocaleOverrideDialog from '../dialogs/LocaleOverrideDialog.vue';
import ConfirmationModal from '../dialogs/ConfirmationModal.vue';
import WaitPage from '../Waits/WaitPage.vue';

const props = defineProps<{
  caseCount: number;
  caseDrafts: Record<string, CaseDraft>;
  caseIndex: number;
  casePath: string;
  editing: boolean;
  planAccessibility: AccessibilitySettingsDraft | undefined;
  planBrowser: PlanBrowserSettingsDraft | undefined;
  planLocale: string;
  planTimeout: unknown;
}>();
const emit = defineEmits<{
  'remove:step': [path: string, index: number];
  'update:steps': [path: string, steps: unknown[]];
}>();
const route = useRoute();
const { t } = useTranslation();
const stepIndex = computed(() => Number(route.params.stepIndex));
const selectedCase = computed(() => props.caseDrafts[props.casePath]);
const selectedStep = computed(() => selectedCase.value?.steps[stepIndex.value]);
const effectiveCaseTimeout = computed(() => {
  const caseTimeout = selectedCase.value?.settings?.timeout;
  if (typeof caseTimeout === 'number') {
    return caseTimeout;
  }
  return typeof props.planTimeout === 'number' ? props.planTimeout : 30_000;
});
type LocalizedAssertionAction = 'assertHtml' | 'assertText' | 'assertValue';

interface LocaleDialogState {
  action: LocalizedAssertionAction;
  locale: string;
  value: string;
}

const localeDialog = ref<LocaleDialogState>();
const pendingLocaleOverrideRemoval = ref<{ action: LocalizedAssertionAction; override: { locale: string; value: string } }>();
const unavailableLocales = computed(() => {
  const current = getLocalizedExpected();
  return Object.keys(current.locales ?? {}).filter((locale) => locale !== localeDialog.value?.locale);
});

/*
Updates one step timeout from its dedicated page.
---
Inputs: A raw timeout replacement for the selected step.
---
Output: A replacement step list for the selected case.
*/
function updateTimeout(timeout: number | string): void {
  if (selectedCase.value === undefined) {
    return;
  }
  emit('update:steps', props.casePath, updateCaseStepTimeout(selectedCase.value.steps, stepIndex.value, timeout));
}

/*
Updates the selected interaction's scrolling behaviour.
---
Inputs: Whether the selected interaction should scroll its target into view.
---
Output: A replacement step list for the selected case.
*/
function updateScrollIntoView(enabled: boolean): void {
  if (selectedCase.value === undefined) {
    return;
  }
  emit('update:steps', props.casePath, updateCaseInteractionScrollIntoView(selectedCase.value.steps, stepIndex.value, enabled));
}

/*
Updates one selected step wait list from the Step page.
---
Inputs: A Before-or-After property name and its replacement wait items.
---
Output: A replacement selected step with empty lists omitted.
*/
function updateStepWaitList(list: 'after' | 'before', items: unknown[]): void {
  if (selectedCase.value === undefined) {
    return;
  }
  emit('update:steps', props.casePath, updateCaseStepWaitList(selectedCase.value.steps, stepIndex.value, list, items));
}

/*
Updates the selected Navigate URL from its dedicated page.
---
Inputs: A replacement URL string.
---
Output: A replacement step list for the selected case.
*/
function updateNavigateUrl(url: string): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, url };
  emit('update:steps', props.casePath, steps);
}

/*
Updates the selected Click locator from its dedicated page.
---
Inputs: A replacement role/name locator.
---
Output: A replacement step list for the selected case.
*/
function updateClickLocator(locator: { name?: string; role: string }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, locator };
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Type fields from its dedicated page.
---
Inputs: A partial replacement for the selected Type step.
---
Output: A replacement step list for the selected case.
*/
function updateTypeStep(fields: { locator?: { name?: string; role: string }; text?: string }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Fill fields from its dedicated page.
---
Inputs: A partial replacement for the selected Fill step.
---
Output: A replacement step list for the selected case.
*/
function updateFillStep(fields: { locator?: { name?: string; role: string }; value?: string }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Select option fields from its dedicated page.
---
Inputs: A partial replacement for the selected Select option step.
---
Output: A replacement step list for the selected case.
*/
function updateSelectOptionStep(fields: { label?: string; locator?: { name?: string; role: string }; value?: string }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  const current = selectedStep.value as { label?: string; value?: string };
  const next = { ...current, ...fields };
  if (fields.label !== undefined) {
    delete next.value;
  }
  if (fields.value !== undefined) {
    delete next.label;
  }
  steps[stepIndex.value] = next;
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Assert text fields from its dedicated page.
---
Inputs: A partial replacement for the selected Assert text step.
---
Output: A replacement step list for the selected case.
*/
function updateAssertTextStep(fields: { expected?: { default: string; locales?: Record<string, string> }; locator?: { name?: string; role: string } }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Assert HTML fields from its dedicated page.
---
Inputs: A partial replacement for the selected Assert HTML step.
---
Output: A replacement step list for the selected case.
*/
function updateAssertHtmlStep(fields: { expected?: { default: string; locales?: Record<string, string> }; locator?: { name?: string; role: string } }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  emit('update:steps', props.casePath, steps);
}

/*
Updates selected Assert value fields from its dedicated page.
---
Inputs: A partial replacement for the selected Assert value step.
---
Output: A replacement step list for the selected case.
*/
function updateAssertValueStep(fields: { expected?: { default: string; locales?: Record<string, string> }; locator?: { name?: string; role: string } }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...selectedCase.value.steps];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  emit('update:steps', props.casePath, steps);
}

/*
Gets the localized expected-value structure for the selected assertion.
---
Inputs: The current selected step.
---
Output: A complete expected-value structure safe to update.
*/
function getLocalizedExpected(): { default: string; locales?: Record<string, string> } {
  if (typeof selectedStep.value !== 'object' || selectedStep.value === null || !('expected' in selectedStep.value)) {
    return { default: '' };
  }
  const expected = (selectedStep.value as { expected?: unknown }).expected;
  if (typeof expected !== 'object' || expected === null || !('default' in expected) || typeof expected.default !== 'string') {
    return { default: '' };
  }
  const locales = 'locales' in expected && typeof expected.locales === 'object' && expected.locales !== null ? expected.locales as Record<string, string> : undefined;
  return { default: expected.default, locales };
}

/*
Updates the selected localized assertion using its specific action type.
---
Inputs: The assertion action and its replacement expected-value structure.
---
Output: A replacement selected assertion step.
*/
function updateLocalizedExpected(action: LocalizedAssertionAction, expected: { default: string; locales?: Record<string, string> }): void {
  if (action === 'assertHtml') {
    updateAssertHtmlStep({ expected });
    return;
  }
  if (action === 'assertValue') {
    updateAssertValueStep({ expected });
    return;
  }
  updateAssertTextStep({ expected });
}

/*
Updates the selected assertion's execution behaviour.
---
Inputs: Whether the selected assertion's failure is soft.
---
Output: A replacement assertion step that omits the default hard behaviour.
*/
function updateAssertionSoft(soft: boolean): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  emit('update:steps', props.casePath, updateCaseAssertionSoft(selectedCase.value.steps, stepIndex.value, soft));
}

/*
Opens the locale-override dialog for a localized assertion type.
---
Inputs: The assertion action and an optional existing override.
---
Output: A dialog state for adding or editing an override.
*/
function openLocaleOverride(action: LocalizedAssertionAction, override?: { locale: string; value: string }): void {
  localeDialog.value = { action, ...(override ?? { locale: '', value: '' }) };
}

/*
Saves the locale override being edited by the shared dialog.
---
Inputs: The current locale-dialog state.
---
Output: An updated localized assertion expected-value structure.
*/
function saveLocaleOverride(): void {
  if (localeDialog.value === undefined) {
    return;
  }
  const current = getLocalizedExpected();
  updateLocalizedExpected(localeDialog.value.action, {
    default: current.default,
    locales: { ...current.locales, [localeDialog.value.locale]: localeDialog.value.value },
  });
}

/*
Resets the locale-override dialog to an empty override.
---
Inputs: The current locale-dialog state.
---
Output: Empty locale and value fields for the same assertion type.
*/
function resetLocaleOverride(): void {
  if (localeDialog.value === undefined) {
    return;
  }
  localeDialog.value = { ...localeDialog.value, locale: '', value: '' };
}

/*
Requests confirmation before removing one locale override from a localized assertion.
---
Inputs: The assertion action and its override to remove.
---
Output: A pending destructive-action request.
*/
function requestLocaleOverrideRemoval(action: LocalizedAssertionAction, override: { locale: string; value: string }): void {
  pendingLocaleOverrideRemoval.value = { action, override };
}

/*
Removes the locale override that the author confirmed.
---
Inputs: The pending locale-override removal request.
---
Output: An updated localized assertion without that override.
*/
function confirmLocaleOverrideRemoval(): void {
  if (pendingLocaleOverrideRemoval.value === undefined) {
    return;
  }
  const { action, override } = pendingLocaleOverrideRemoval.value;
  const current = getLocalizedExpected();
  const locales = { ...current.locales };
  delete locales[override.locale];
  updateLocalizedExpected(action, { default: current.default, locales });
  pendingLocaleOverrideRemoval.value = undefined;
}

/*
Formats a schema action identifier for the Step-page heading.
---
Inputs: An optional action identifier from a selected step.
---
Output: A readable action name.
*/
function formatActionName(action: string | undefined): string {
  return action === undefined ? 'Step' : action.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}
</script>

<template>
  <h1 v-if="route.name === 'step'" class="h2">{{ stepIndex + 1 }}. {{ formatActionName((selectedStep as { action?: string } | undefined)?.action) }}</h1>
  <NavigateStepPage v-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'navigate'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :url="(selectedStep as { url?: string } | undefined)?.url ?? ''" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:timeout="updateTimeout" @update:url="updateNavigateUrl" />
  <ClickStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'click'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateClickLocator" @update:scroll-into-view="updateScrollIntoView" @update:timeout="updateTimeout" />
  <TypeStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'type'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :text="(selectedStep as { text?: string } | undefined)?.text ?? ''" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateTypeStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:text="updateTypeStep({ text: $event })" @update:timeout="updateTimeout" />
  <FillStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'fill'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :value="(selectedStep as { value?: string } | undefined)?.value ?? ''" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateFillStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:timeout="updateTimeout" @update:value="updateFillStep({ value: $event })" />
  <SelectOptionStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'selectOption'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :label="(selectedStep as { label?: string } | undefined)?.label" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :value="(selectedStep as { value?: string } | undefined)?.value" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateSelectOptionStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:selection="updateSelectOptionStep($event)" @update:timeout="updateTimeout" />
  <AssertTextStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertText'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:override="openLocaleOverride('assertText')" @edit:override="openLocaleOverride('assertText', $event)" @remove:override="requestLocaleOverrideRemoval('assertText', $event)" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertTextStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertTextStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <AssertHtmlStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertHtml'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:override="openLocaleOverride('assertHtml')" @edit:override="openLocaleOverride('assertHtml', $event)" @remove:override="requestLocaleOverrideRemoval('assertHtml', $event)" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertHtmlStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertHtmlStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <AssertValueStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertValue'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:override="openLocaleOverride('assertValue')" @edit:override="openLocaleOverride('assertValue', $event)" @remove:override="requestLocaleOverrideRemoval('assertValue', $event)" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertValueStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertValueStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <WaitPage v-else-if="route.name === 'wait'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" />
  <LocaleOverrideDialog v-if="localeDialog" :locale="localeDialog.locale" :unavailable-locales="unavailableLocales" :value="localeDialog.value" value-label="Expected text" value-validation-message="Enter expected text." @close="localeDialog = undefined" @reset="resetLocaleOverride" @save="saveLocaleOverride" @update:locale="localeDialog.locale = $event" @update:value="localeDialog.value = $event" />
  <ConfirmationModal v-if="pendingLocaleOverrideRemoval" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.remove')" :message="t('editor.removeLocaleOverrideConfirmation', { locale: pendingLocaleOverrideRemoval.override.locale })" :title="t('editor.confirmationTitle')" @cancel="pendingLocaleOverrideRemoval = undefined" @confirm="confirmLocaleOverrideRemoval" />
  <CaseDetails v-if="!['navigate', 'click', 'type', 'fill', 'selectOption', 'assertText', 'assertHtml', 'assertValue'].includes((selectedStep as { action?: string } | undefined)?.action ?? '')" :case-count="props.caseCount" :case-drafts="props.caseDrafts" :case-index="props.caseIndex" :case-path="props.casePath" :editing="props.editing" :expanded="true" :framed="false" :plan-accessibility="props.planAccessibility" :plan-browser="props.planBrowser" :plan-locale="props.planLocale" :plan-timeout="props.planTimeout" @edit-reference="() => undefined" @move-reference="() => undefined" @remove-reference="() => undefined" @select-reference="() => undefined" @update:accessibility="() => undefined" @update:browser="() => undefined" @update:case-id="() => undefined" @update:timeout="() => undefined" />
  <div v-if="route.name === 'step'" class="mt-4">
    <RouterLink :to="{ name: 'case', params: { cardIndex: props.caseIndex } }" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-turn-down-left" aria-hidden="true"></i> {{ t('editor.return') }}</RouterLink>
  </div>
</template>
