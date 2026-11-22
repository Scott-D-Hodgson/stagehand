<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { showAppliedChanges } from '../../feedback/apply-feedback';

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
  'update:steps': [path: string, steps: unknown[]];
}>();
const route = useRoute();
const router = useRouter();
const { t } = useTranslation();
const stepIndex = computed(() => Number(route.params.stepIndex));
const selectedCase = computed(() => props.caseDrafts[props.casePath]);
const formSteps = ref<unknown[]>([]);
const selectedStep = computed(() => formSteps.value[stepIndex.value]);
const effectiveCaseTimeout = computed(() => {
  const caseTimeout = selectedCase.value?.settings?.timeout;
  if (typeof caseTimeout === 'number') {
    return caseTimeout;
  }
  return typeof props.planTimeout === 'number' ? props.planTimeout : 30_000;
});
type LocalizedAssertionAction = 'assertHtml' | 'assertText' | 'assertValue';
type LocalizedExpectedTarget = 'associatedLabel' | 'expected';

interface LocaleDialogState {
  action: LocalizedAssertionAction;
  locale: string;
  originalLocale?: string;
  target: LocalizedExpectedTarget;
  value: string;
}

const localeDialog = ref<LocaleDialogState>();
const pendingLocaleOverrideRemoval = ref<{ action: LocalizedAssertionAction; override: { locale: string; value: string }; target: LocalizedExpectedTarget }>();
const pendingNavigation = ref<string>();
let navigationConfirmed = false;
const unavailableLocales = computed(() => {
  const current = getLocalizedExpected(localeDialog.value?.target ?? 'expected');
  return Object.keys(current.locales ?? {}).filter((locale) => locale !== localeDialog.value?.locale);
});

watch(() => props.caseDrafts[props.casePath]?.steps, (steps) => {
  formSteps.value = steps === undefined ? [] : copyStepValues(steps) as unknown[];
}, { immediate: true });

/*
Copies reactive step values into plain data without structured cloning proxies.
---
Inputs: A primitive, array, or object from a Vue-reactive step list.
---
Output: An independent plain value safe to persist in the editor draft.
*/
function copyStepValues(value: unknown): unknown {
  const rawValue = toRaw(value);
  if (Array.isArray(rawValue)) {
    return rawValue.map(copyStepValues);
  }
  if (typeof rawValue === 'object' && rawValue !== null) {
    return Object.fromEntries(Object.entries(rawValue).map(([key, nestedValue]) => [key, copyStepValues(nestedValue)]));
  }
  return rawValue;
}

const hasUnappliedChanges = computed(() => JSON.stringify(copyStepValues(formSteps.value)) !== JSON.stringify(copyStepValues(props.caseDrafts[props.casePath]?.steps ?? [])));

/*
Confirms navigation that would discard unapplied Step-form changes.
---
Inputs: A destination captured by the route-leave guard.
---
Output: Navigation resumes only after explicit confirmation.
*/
function discardUnappliedChanges(): void {
  const destination = pendingNavigation.value;
  pendingNavigation.value = undefined;
  if (destination === undefined) {
    return;
  }
  navigationConfirmed = true;
  void router.push(destination);
}

const removeNavigationGuard = router.beforeEach((to) => {
  if (navigationConfirmed || !hasUnappliedChanges.value) {
    navigationConfirmed = false;
    return true;
  }
  pendingNavigation.value = to.fullPath;
  return false;
});

onBeforeUnmount(removeNavigationGuard);

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
  formSteps.value = updateCaseStepTimeout(formSteps.value, stepIndex.value, timeout);
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
  formSteps.value = updateCaseInteractionScrollIntoView(formSteps.value, stepIndex.value, enabled);
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
  formSteps.value = updateCaseStepWaitList(formSteps.value, stepIndex.value, list, items);
  emit('update:steps', props.casePath, copyStepValues(formSteps.value) as unknown[]);
  showAppliedChanges();
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, url };
  formSteps.value = steps;
}

/*
Saves a Navigate URL directly from its local panel.
---
Inputs: A valid absolute HTTP or HTTPS URL.
---
Output: One persisted replacement step list.
*/
function saveNavigateUrl(url: string): void {
  updateNavigateUrl(url);
  emit('update:steps', props.casePath, copyStepValues(formSteps.value) as unknown[]);
  showAppliedChanges();
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, locator };
  formSteps.value = steps;
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  formSteps.value = steps;
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  formSteps.value = steps;
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
  const steps = [...formSteps.value];
  const current = selectedStep.value as { label?: string; value?: string };
  const next = { ...current, ...fields };
  if (fields.label !== undefined) {
    delete next.value;
  }
  if (fields.value !== undefined) {
    delete next.label;
  }
  steps[stepIndex.value] = next;
  formSteps.value = steps;
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  formSteps.value = steps;
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
  const steps = [...formSteps.value];
  steps[stepIndex.value] = { ...selectedStep.value, ...fields };
  formSteps.value = steps;
}

/*
Updates selected Assert value fields from its dedicated page.
---
Inputs: A partial replacement for the selected Assert value step.
---
Output: A replacement step list for the selected case.
*/
function updateAssertValueStep(fields: { associatedLabel?: { default: string; locales?: Record<string, string> } | undefined; expected?: { default: string; locales?: Record<string, string> }; locator?: { name?: string; role: string } }): void {
  if (selectedCase.value === undefined || typeof selectedStep.value !== 'object' || selectedStep.value === null) {
    return;
  }
  const steps = [...formSteps.value];
  const next = { ...selectedStep.value, ...fields };
  if ('associatedLabel' in fields && fields.associatedLabel === undefined) {
    delete next.associatedLabel;
  }
  steps[stepIndex.value] = next;
  formSteps.value = steps;
}

/*
Gets the localized expected-value structure for the selected assertion.
---
Inputs: The current selected step.
---
Output: A complete expected-value structure safe to update.
*/
function getLocalizedExpected(target: LocalizedExpectedTarget = 'expected'): { default: string; locales?: Record<string, string> } {
  if (typeof selectedStep.value !== 'object' || selectedStep.value === null || !(target in selectedStep.value)) {
    return { default: '' };
  }
  const expected = (selectedStep.value as { associatedLabel?: unknown; expected?: unknown })[target];
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
function updateLocalizedExpected(action: LocalizedAssertionAction, target: LocalizedExpectedTarget, expected: { default: string; locales?: Record<string, string> }): void {
  if (action === 'assertValue' && target === 'associatedLabel') {
    updateAssertValueStep({ associatedLabel: expected });
    return;
  }
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
  formSteps.value = updateCaseAssertionSoft(formSteps.value, stepIndex.value, soft);
}

/*
Applies the local Step-page form to its owning case draft.
---
Inputs: The locally edited full step list.
---
Output: One persisted case-step update.
*/
async function applyStepForm(): Promise<void> {
  await nextTick();
  emit('update:steps', props.casePath, copyStepValues(formSteps.value) as unknown[]);
  showAppliedChanges();
}

/*
Opens the locale-override dialog for a localized assertion type.
---
Inputs: The assertion action and an optional existing override.
---
Output: A dialog state for adding or editing an override.
*/
function openLocaleOverride(action: LocalizedAssertionAction, target: LocalizedExpectedTarget = 'expected', override?: { locale: string; value: string }): void {
  localeDialog.value = { action, target, ...(override === undefined ? { locale: '', value: '' } : { ...override, originalLocale: override.locale }) };
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
  const current = getLocalizedExpected(localeDialog.value.target);
  const locales = { ...current.locales, [localeDialog.value.locale]: localeDialog.value.value };
  if (localeDialog.value.originalLocale !== undefined && localeDialog.value.originalLocale !== localeDialog.value.locale) {
    delete locales[localeDialog.value.originalLocale];
  }
  updateLocalizedExpected(localeDialog.value.action, localeDialog.value.target, {
    default: current.default,
    locales,
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
function requestLocaleOverrideRemoval(action: LocalizedAssertionAction, target: LocalizedExpectedTarget = 'expected', override: { locale: string; value: string }): void {
  pendingLocaleOverrideRemoval.value = { action, target, override };
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
  const { action, target, override } = pendingLocaleOverrideRemoval.value;
  const current = getLocalizedExpected(target);
  const locales = { ...current.locales };
  delete locales[override.locale];
  updateLocalizedExpected(action, target, { default: current.default, locales });
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
  <NavigateStepPage v-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'navigate'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :save-url="saveNavigateUrl" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :url="(selectedStep as { url?: string } | undefined)?.url ?? ''" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:timeout="updateTimeout" @update:url="updateNavigateUrl" />
  <ClickStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'click'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @save="applyStepForm" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateClickLocator" @update:scroll-into-view="updateScrollIntoView" @update:timeout="updateTimeout" />
  <TypeStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'type'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :text="(selectedStep as { text?: string } | undefined)?.text ?? ''" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @save="applyStepForm" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateTypeStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:text="updateTypeStep({ text: $event })" @update:timeout="updateTimeout" />
  <FillStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'fill'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :value="(selectedStep as { value?: string } | undefined)?.value ?? ''" @save="applyStepForm" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateFillStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:timeout="updateTimeout" @update:value="updateFillStep({ value: $event })" />
  <SelectOptionStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'selectOption'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :label="(selectedStep as { label?: string } | undefined)?.label" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :scroll-into-view="(selectedStep as { scrollIntoView?: unknown } | undefined)?.scrollIntoView !== false" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" :value="(selectedStep as { value?: string } | undefined)?.value" @save="applyStepForm" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:locator="updateSelectOptionStep({ locator: $event })" @update:scroll-into-view="updateScrollIntoView" @update:selection="updateSelectOptionStep($event)" @update:timeout="updateTimeout" />
  <AssertTextStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertText'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:override="openLocaleOverride('assertText')" @save="applyStepForm" @edit:override="openLocaleOverride('assertText', 'expected', $event)" @remove:override="requestLocaleOverrideRemoval('assertText', 'expected', $event)" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertTextStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertTextStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <AssertHtmlStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertHtml'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:override="openLocaleOverride('assertHtml')" @save="applyStepForm" @edit:override="openLocaleOverride('assertHtml', 'expected', $event)" @remove:override="requestLocaleOverrideRemoval('assertHtml', 'expected', $event)" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertHtmlStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertHtmlStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <AssertValueStepPage v-else-if="route.name === 'step' && (selectedStep as { action?: string } | undefined)?.action === 'assertValue'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :associated-label="(selectedStep as { associatedLabel?: { default?: string } } | undefined)?.associatedLabel" :associated-label-overrides="Object.entries((selectedStep as { associatedLabel?: { locales?: Record<string, string> } } | undefined)?.associatedLabel?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" :expected="(selectedStep as { expected?: { default?: string } } | undefined)?.expected?.default ?? ''" :index="stepIndex" :inherited-timeout="effectiveCaseTimeout" :name="(selectedStep as { locator?: { name?: string } } | undefined)?.locator?.name ?? ''" :overrides="Object.entries((selectedStep as { expected?: { locales?: Record<string, string> } } | undefined)?.expected?.locales ?? {}).map(([locale, value]) => ({ locale, value }))" :role="(selectedStep as { locator?: { role?: string } } | undefined)?.locator?.role ?? ''" :soft="(selectedStep as { soft?: unknown } | undefined)?.soft === true" :timeout="typeof selectedStep === 'object' && selectedStep !== null ? (selectedStep as { timeout?: unknown }).timeout : undefined" @add:associated-label-override="openLocaleOverride('assertValue', 'associatedLabel')" @add:override="openLocaleOverride('assertValue')" @save="applyStepForm" @edit:associated-label-override="openLocaleOverride('assertValue', 'associatedLabel', $event)" @edit:override="openLocaleOverride('assertValue', 'expected', $event)" @remove:associated-label-override="requestLocaleOverrideRemoval('assertValue', 'associatedLabel', $event)" @remove:override="requestLocaleOverrideRemoval('assertValue', 'expected', $event)" @update:after="updateStepWaitList('after', $event)" @update:associated-label="updateAssertValueStep({ associatedLabel: $event })" @update:before="updateStepWaitList('before', $event)" @update:expected="updateAssertValueStep({ expected: { ...(selectedStep as { expected?: { locales?: Record<string, string> } }).expected, default: $event } })" @update:locator="updateAssertValueStep({ locator: $event })" @update:soft="updateAssertionSoft($event)" @update:timeout="updateTimeout" />
  <WaitPage v-else-if="route.name === 'wait'" :after="Array.isArray((selectedStep as { after?: unknown[] } | undefined)?.after) ? (selectedStep as { after: unknown[] }).after : []" :before="Array.isArray((selectedStep as { before?: unknown[] } | undefined)?.before) ? (selectedStep as { before: unknown[] }).before : []" :editing="props.editing" @update:after="updateStepWaitList('after', $event)" @update:before="updateStepWaitList('before', $event)" />
  <LocaleOverrideDialog v-if="localeDialog" :locale="localeDialog.locale" :unavailable-locales="unavailableLocales" :value="localeDialog.value" :value-label="localeDialog.target === 'associatedLabel' ? t('editor.expectedLabel') : t('editor.expectedText')" :value-validation-message="localeDialog.target === 'associatedLabel' ? t('editor.expectedLabelRequired') : t('editor.expectedTextRequired')" @close="localeDialog = undefined" @reset="resetLocaleOverride" @save="saveLocaleOverride" @update:locale="localeDialog.locale = $event" @update:value="localeDialog.value = $event" />
  <ConfirmationModal v-if="pendingLocaleOverrideRemoval" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.remove')" :message="t('editor.removeLocaleOverrideConfirmation', { locale: pendingLocaleOverrideRemoval.override.locale })" :title="t('editor.confirmationTitle')" @cancel="pendingLocaleOverrideRemoval = undefined" @confirm="confirmLocaleOverrideRemoval" />
  <ConfirmationModal v-if="pendingNavigation" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.discardLocalEdits')" :message="t('editor.discardUnappliedChangesConfirmation')" :title="t('editor.confirmationTitle')" @cancel="pendingNavigation = undefined" @confirm="discardUnappliedChanges" />
  <CaseDetails v-if="!['navigate', 'click', 'type', 'fill', 'selectOption', 'assertText', 'assertHtml', 'assertValue'].includes((selectedStep as { action?: string } | undefined)?.action ?? '')" :case-count="props.caseCount" :case-drafts="props.caseDrafts" :case-index="props.caseIndex" :case-path="props.casePath" :editing="props.editing" :expanded="true" :framed="false" :plan-accessibility="props.planAccessibility" :plan-browser="props.planBrowser" :plan-locale="props.planLocale" :plan-timeout="props.planTimeout" @edit-reference="() => undefined" @move-reference="() => undefined" @remove-reference="() => undefined" @select-reference="() => undefined" @update:accessibility="() => undefined" @update:browser="() => undefined" @update:case-id="() => undefined" @update:timeout="() => undefined" />
  <div v-if="route.name === 'step'" class="mt-4">
    <RouterLink :to="{ name: 'case', params: { cardIndex: props.caseIndex } }" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-turn-down-left" aria-hidden="true"></i> {{ t('editor.return') }}</RouterLink>
  </div>
</template>
