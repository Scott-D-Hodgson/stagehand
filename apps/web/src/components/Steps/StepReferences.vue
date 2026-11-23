<script setup lang="ts">
import { computed, nextTick, provide, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { validateCase } from '@stagehand/plan-schema';
import { moveCaseStep, updateCaseStepTimeout, type CaseDraft } from '../../services/planDraftService';
import { getInvalidCaseStepIndexes } from '../../services/validationService';
import ConfirmationModal from '../controls/dialogs/ConfirmationModal.vue';
import AssertHtmlStepDialog from './assert/dialogs/AssertHtmlStepDialog.vue';
import AssertTextStepDialog from './assert/dialogs/AssertTextStepDialog.vue';
import AssertValueStepDialog from './assert/dialogs/AssertValueStepDialog.vue';
import ClickStepDialog from './action/dialogs/ClickStepDialog.vue';
import FillStepDialog from './action/dialogs/FillStepDialog.vue';
import LocaleOverrideDialog from './assert/dialogs/LocaleOverrideDialog.vue';
import NavigateStepDialog from './action/dialogs/NavigateStepDialog.vue';
import SelectOptionStepDialog from './action/dialogs/SelectOptionStepDialog.vue';
import StepChooserDialog from './dialogs/StepChooserDialog.vue';
import TypeStepDialog from './action/dialogs/TypeStepDialog.vue';
import IconOnlyButton from '../controls/IconOnlyButton.vue';
import AssertHtmlStepDetails from './assert/details/AssertHtmlStepDetails.vue';
import AssertTextStepDetails from './assert/details/AssertTextStepDetails.vue';
import AssertValueStepDetails from './assert/details/AssertValueStepDetails.vue';
import ClickStepDetails from './action/details/ClickStepDetails.vue';
import FillStepDetails from './action/details/FillStepDetails.vue';
import NavigateStepDetails from './action/details/NavigateStepDetails.vue';
import SelectOptionStepDetails from './action/details/SelectOptionStepDetails.vue';
import TypeStepDetails from './action/details/TypeStepDetails.vue';

interface LocaleOverride {
  locale: string;
  value: string;
}

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  caseIndex: number;
  editing: boolean;
  planLocale: string;
  selectedPath: string;
}>();

const emit = defineEmits<{
  'remove:step': [path: string, index: number];
  'update:steps': [path: string, steps: unknown[]];
}>();

const { t } = useTranslation();
const route = useRoute();
const router = useRouter();

/*
Determines the selected case for step-card rendering.
---
Inputs: The case draft collection and selected path.
---
Output: The selected case draft, when present.
*/
const selectedCase = computed(
  () => props.caseDrafts[props.selectedPath]
);

/*
Determines which selected-case steps have validation issues.
---
Inputs: The selected case draft.
---
Output: Ordered indexes of invalid steps.
*/
const invalidStepIndexes = computed(
  () => selectedCase.value === undefined ? [] : getInvalidCaseStepIndexes(selectedCase.value)
);

/*
Determines the step cards appropriate to the active route.
---
Inputs: The selected case and current route.
---
Output: All case steps or the routed single step.
*/
const displayedSteps = computed(
  () => {
    if (selectedCase.value === undefined) {
      return [];
    }
    if (route.name !== 'step') {
      return selectedCase.value.steps.map((step, index) => ({ index, step }));
    }
    const index = Number(route.params.stepIndex);
    const step = selectedCase.value.steps[index];
    return step === undefined ? [] : [{ index, step }];
  }
);
provide('stagehandStepSummary', computed(() => route.name === 'case'));
provide('stagehandStepPage', computed(() => route.name === 'step'));
provide('stagehandCaseIndex', props.caseIndex);
const editingStepIndex = ref<number | undefined>();
const navigateUrl = ref('');
const navigateDialogOpen = ref(false);
const clickDialogOpen = ref(false);
const assertTextDialogOpen = ref(false);
const assertHtmlDialogOpen = ref(false);
const assertValueDialogOpen = ref(false);
const fillDialogOpen = ref(false);
const selectOptionDialogOpen = ref(false);
const typeDialogOpen = ref(false);
const stepChooserOpen = ref(false);
const clickRole = ref('');
const clickName = ref('');
const editingClickIndex = ref<number | undefined>();
const pendingStepRemoval = ref<number | undefined>();
const clickRoleBlurred = ref(false);

/*
Determines the Click dialog Role validation message.
---
Inputs: The Click dialog Role value.
---
Output: A required-field message, when applicable.
*/
const clickRoleValidationMessage = computed(
  () => clickRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);
const fillRole = ref('');
const fillName = ref('');
const fillValue = ref('');
const editingFillIndex = ref<number | undefined>();
const fillRoleBlurred = ref(false);
const fillValueBlurred = ref(false);

/*
Determines the Fill dialog Role validation message.
---
Inputs: The Fill dialog Role value.
---
Output: A required-field message, when applicable.
*/
const fillRoleValidationMessage = computed(
  () => fillRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Fill dialog Value validation message.
---
Inputs: The Fill dialog Value value.
---
Output: A required-field message, when applicable.
*/
const fillValueValidationMessage = computed(
  () => fillValue.value.trim().length === 0 ? t('editor.valueRequired') : undefined
);
const selectOptionRole = ref('');
const selectOptionName = ref('');
const selectOptionSelection = ref('');
const selectOptionMode = ref<'label' | 'value'>('value');
const editingSelectOptionIndex = ref<number | undefined>();
const selectOptionRoleBlurred = ref(false);
const selectOptionSelectionBlurred = ref(false);

/*
Determines the Select option dialog Role validation message.
---
Inputs: The Select option dialog Role value.
---
Output: A required-field message, when applicable.
*/
const selectOptionRoleValidationMessage = computed(
  () => selectOptionRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Select option dialog selection validation message.
---
Inputs: The selection value and active selection mode.
---
Output: The required Value or Label message, when applicable.
*/
const selectOptionSelectionValidationMessage = computed(
  () => selectOptionSelection.value.trim().length === 0 ? selectOptionMode.value === 'value' ? t('editor.valueRequired') : t('editor.labelRequired') : undefined
);
const typeRole = ref('');
const typeName = ref('');
const typeText = ref('');
const editingTypeIndex = ref<number | undefined>();
const typeRoleBlurred = ref(false);
const typeTextBlurred = ref(false);

/*
Determines the Type dialog Role validation message.
---
Inputs: The Type dialog Role value.
---
Output: A required-field message, when applicable.
*/
const typeRoleValidationMessage = computed(
  () => typeRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Type dialog Text validation message.
---
Inputs: The Type dialog Text value.
---
Output: A required-field message, when applicable.
*/
const typeTextValidationMessage = computed(
  () => typeText.value.trim().length === 0 ? t('editor.textRequired') : undefined
);
const assertTextRole = ref('');
const assertTextName = ref('');
const assertTextExpected = ref('');
const assertTextLocaleOverrides = ref<LocaleOverride[]>([]);
const editingAssertTextIndex = ref<number | undefined>();
const assertTextRoleBlurred = ref(false);
const assertTextExpectedBlurred = ref(false);

/*
Determines the Assert text dialog Role validation message.
---
Inputs: The Assert text dialog Role value.
---
Output: A required-field message, when applicable.
*/
const assertTextRoleValidationMessage = computed(
  () => assertTextRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Assert text dialog expected-text validation message.
---
Inputs: The Assert text dialog expected-text value.
---
Output: A required-field message, when applicable.
*/
const assertTextExpectedValidationMessage = computed(
  () => assertTextExpected.value.trim().length === 0 ? t('editor.expectedTextRequired') : undefined
);
const localeOverrideDialogOpen = ref(false);
const localeOverrideLocale = ref('');
const localeOverrideStepIndex = ref<number | undefined>();
const localeOverrideValue = ref('');
const editingLocaleOverrideLocale = ref<string | undefined>();
const pendingLocaleOverrideRemoval = ref<{ locale: string; stepIndex: number }>();
const assertHtmlRole = ref('');
const assertHtmlName = ref('');
const assertHtmlExpected = ref('');
const assertHtmlLocaleOverrides = ref<LocaleOverride[]>([]);
const editingAssertHtmlIndex = ref<number | undefined>();
const assertHtmlRoleBlurred = ref(false);
const assertHtmlExpectedBlurred = ref(false);

/*
Determines the Assert HTML dialog Role validation message.
---
Inputs: The Assert HTML dialog Role value.
---
Output: A required-field message, when applicable.
*/
const assertHtmlRoleValidationMessage = computed(
  () => assertHtmlRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Assert HTML dialog expected-HTML validation message.
---
Inputs: The Assert HTML dialog expected-HTML value.
---
Output: A required-field message, when applicable.
*/
const assertHtmlExpectedValidationMessage = computed(
  () => assertHtmlExpected.value.trim().length === 0 ? t('editor.expectedHtmlRequired') : undefined
);
const assertValueRole = ref('');
const assertValueName = ref('');
const assertValueExpected = ref('');
const assertValueLocaleOverrides = ref<LocaleOverride[]>([]);
const editingAssertValueIndex = ref<number | undefined>();
const assertValueRoleBlurred = ref(false);
const assertValueExpectedBlurred = ref(false);

/*
Determines the Assert value dialog Role validation message.
---
Inputs: The Assert value dialog Role value.
---
Output: A required-field message, when applicable.
*/
const assertValueRoleValidationMessage = computed(
  () => assertValueRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined
);

/*
Determines the Assert value dialog expected-value validation message.
---
Inputs: The Assert value dialog expected-value value.
---
Output: A required-field message, when applicable.
*/
const assertValueExpectedValidationMessage = computed(
  () => assertValueExpected.value.trim().length === 0 ? t('editor.expectedValueRequired') : undefined
);
const stepKeys = new WeakMap<object, number>();
let nextStepKey = 0;
const stepCardList = ref<HTMLElement>();
let heightTransitionToken = 0;

const navigateUrlBlurred = ref(false);

/*
Determines validation issues for the current Navigate dialog URL.
---
Inputs: The selected case, edited step index, and dialog URL.
---
Output: URL-specific validation issues for the pending navigate step.
*/
const navigateValidationIssues = computed(
  () => {
    if (selectedCase.value === undefined) {
      return [];
    }
    const steps = editingStepIndex.value === undefined
      ? [...selectedCase.value.steps, { action: 'navigate', url: navigateUrl.value }]
      : selectedCase.value.steps.map((step, index) => index === editingStepIndex.value ? { ...(step as Record<string, unknown>), url: navigateUrl.value } : step);
    const validation = validateCase({ ...selectedCase.value, steps });
    return validation.valid ? [] : validation.issues.filter((issue) => issue.path === `/steps/${editingStepIndex.value === undefined ? steps.length - 1 : editingStepIndex.value}/url`);
  }
);

/*
Animates the step-card list height while Edit/View controls change its content.
---
Inputs: The current rendered list height before Vue applies an editing-mode update.
---
Output: A height transition that finishes at the updated rendered list size.
*/
async function animateStepCardListHeight(): Promise<void> {
  const element = stepCardList.value;
  if (element === undefined) {
    return;
  }
  const token = heightTransitionToken + 1;
  heightTransitionToken = token;
  element.style.height = '';
  const startingHeight = element.getBoundingClientRect().height;
  await nextTick();
  if (token !== heightTransitionToken || element !== stepCardList.value) {
    return;
  }
  const endingHeight = element.getBoundingClientRect().height;
  if (startingHeight === endingHeight) {
    return;
  }
  element.style.height = `${startingHeight}px`;
  void element.offsetHeight;
  element.style.height = `${endingHeight}px`;
  element.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'height' && token === heightTransitionToken) {
      element.style.height = '';
    }
  }, { once: true });
  setTimeout(() => {
    if (token === heightTransitionToken) {
      element.style.height = '';
    }
  }, 250);
}

watch(() => props.editing, () => {
  void animateStepCardListHeight();
}, { flush: 'pre' });

/*
Adds an incomplete Navigate step for the author to complete.
---
Inputs: The selected case-reference path.
---
Output: A new raw Navigate step retained in the case draft.
*/
function addNavigateStep(): void {
  editingStepIndex.value = undefined;
  navigateUrl.value = '';
  navigateUrlBlurred.value = false;
  navigateDialogOpen.value = true;
}

/*
Opens the appropriate step-authoring dialog for a chosen action.
---
Inputs: The action selected in the step chooser.
---
Output: A visible dialog with fields reset for a new step.
*/
function chooseStep(action: 'assertHtml' | 'assertText' | 'assertValue' | 'click' | 'fill' | 'navigate' | 'selectOption' | 'type'): void {
  stepChooserOpen.value = false;
  if (action === 'assertValue') {
    addAssertValueStep();
    return;
  }
  if (action === 'assertHtml') {
    addAssertHtmlStep();
    return;
  }
  if (action === 'assertText') {
    addAssertTextStep();
    return;
  }
  if (action === 'click') {
    addClickStep();
    return;
  }
  if (action === 'type') {
    addTypeStep();
    return;
  }
  if (action === 'fill') {
    addFillStep();
    return;
  }
  if (action === 'selectOption') {
    addSelectOptionStep();
    return;
  }
  addNavigateStep();
}

/*
Opens the Navigate-step dialog with the chosen step's current URL.
---
Inputs: A step index and raw step value.
---
Output: A visible editing dialog.
*/
function editNavigateStep(index: number, step: unknown): void {
  editingStepIndex.value = index;
  navigateUrl.value = (step as { url?: string }).url ?? '';
  navigateUrlBlurred.value = false;
  navigateDialogOpen.value = true;
}

/*
Saves the valid Navigate-step fields to the selected case document.
---
Inputs: The current Navigate-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveNavigateStep(): void {
  if (navigateValidationIssues.value.length > 0) {
    navigateUrlBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const steps = editingStepIndex.value === undefined
      ? [...selectedCase.value.steps, { action: 'navigate', url: navigateUrl.value }]
      : selectedCase.value.steps.map((step, index) => index === editingStepIndex.value ? { ...(step as Record<string, unknown>), url: navigateUrl.value } : step);
    emit('update:steps', props.selectedPath, steps);
  }
  editingStepIndex.value = undefined;
}

/*
Resets Navigate dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Navigate dialog.
---
Output: A blank URL and hidden validation feedback.
*/
function resetNavigateDialog(): void {
  navigateUrl.value = '';
  navigateUrlBlurred.value = false;
}

/*
Opens an empty Click-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Click-step dialog for a new step.
*/
function addClickStep(): void {
  editingClickIndex.value = undefined;
  clickRole.value = '';
  clickName.value = '';
  clickRoleBlurred.value = false;
  clickDialogOpen.value = true;
}

/*
Saves the valid Click-step fields to the selected case document.
---
Inputs: The current Click-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveClickStep(): void {
  if (clickRoleValidationMessage.value !== undefined) {
    clickRoleBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = clickName.value.trim() ? { name: clickName.value.trim(), role: clickRole.value.trim() } : { role: clickRole.value.trim() };
    const step = preserveEditedStepTimeout(editingClickIndex.value, { action: 'click', locator });
    const steps = editingClickIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingClickIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Click dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Click dialog.
---
Output: Blank locator fields and hidden validation feedback.
*/
function resetClickDialog(): void {
  clickRole.value = '';
  clickName.value = '';
  clickRoleBlurred.value = false;
}

/*
Opens an empty Type-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Type-step dialog for a new step.
*/
function addTypeStep(): void {
  editingTypeIndex.value = undefined;
  typeRole.value = '';
  typeName.value = '';
  typeText.value = '';
  typeRoleBlurred.value = false;
  typeTextBlurred.value = false;
  typeDialogOpen.value = true;
}

/*
Saves the valid Type-step fields to the selected case document.
---
Inputs: The current Type-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveTypeStep(): void {
  if (typeRoleValidationMessage.value !== undefined || typeTextValidationMessage.value !== undefined) {
    typeRoleBlurred.value = true;
    typeTextBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = typeName.value.trim() ? { name: typeName.value.trim(), role: typeRole.value.trim() } : { role: typeRole.value.trim() };
    const step = preserveEditedStepTimeout(editingTypeIndex.value, { action: 'type', locator, text: typeText.value });
    const steps = editingTypeIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingTypeIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Type dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Type dialog.
---
Output: Blank fields and hidden validation feedback.
*/
function resetTypeDialog(): void {
  typeRole.value = '';
  typeName.value = '';
  typeText.value = '';
  typeRoleBlurred.value = false;
  typeTextBlurred.value = false;
}

/*
Opens an empty Assert text-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Assert text-step dialog for a new step.
*/
function addAssertTextStep(): void {
  editingAssertTextIndex.value = undefined;
  assertTextRole.value = '';
  assertTextName.value = '';
  assertTextExpected.value = '';
  assertTextLocaleOverrides.value = [];
  assertTextRoleBlurred.value = false;
  assertTextExpectedBlurred.value = false;
  assertTextDialogOpen.value = true;
}

/*
Saves the valid Assert text-step fields to the selected case document.
---
Inputs: The current Assert text-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveAssertTextStep(): void {
  if (assertTextRoleValidationMessage.value !== undefined || assertTextExpectedValidationMessage.value !== undefined) {
    assertTextRoleBlurred.value = true;
    assertTextExpectedBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = assertTextName.value.trim() ? { name: assertTextName.value.trim(), role: assertTextRole.value.trim() } : { role: assertTextRole.value.trim() };
    const locales = Object.fromEntries(assertTextLocaleOverrides.value.map((override) => [override.locale, override.value]));
    const expected = Object.keys(locales).length === 0 ? { default: assertTextExpected.value } : { default: assertTextExpected.value, locales };
    const step = preserveEditedStepTimeout(editingAssertTextIndex.value, { action: 'assertText', expected, locator });
    const steps = editingAssertTextIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingAssertTextIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Assert text dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Assert text dialog.
---
Output: Blank fields and hidden validation feedback.
*/
function resetAssertTextDialog(): void {
  assertTextRole.value = '';
  assertTextName.value = '';
  assertTextExpected.value = '';
  assertTextLocaleOverrides.value = [];
  assertTextRoleBlurred.value = false;
  assertTextExpectedBlurred.value = false;
}

/*
Reads locale-specific expected values from an authored assertion step.
---
Inputs: A raw assertion-step value.
---
Output: Detached locale/value pairs suitable for dialog editing.
*/
function readExpectedLocaleOverrides(step: unknown): LocaleOverride[] {
  const locales = (step as { expected?: { locales?: unknown } }).expected?.locales;
  if (locales === null || locales === undefined || typeof locales !== 'object' || Array.isArray(locales)) {
    return [];
  }
  return Object.entries(locales).flatMap(([locale, value]) => typeof value === 'string' ? [{ locale, value }] : []);
}

/*
Returns a localized assertion step's overrides in locale-code order.
---
Inputs: A raw assertion-step value.
---
Output: Detached override entries sorted alphabetically by locale.
*/
function getSortedExpectedLocaleOverrides(step: unknown): LocaleOverride[] {
  return readExpectedLocaleOverrides(step).sort((first, second) => first.locale.localeCompare(second.locale));
}

/*
Returns whether a case-step card supports localized expected values.
---
Inputs: A raw case-step value.
---
Output: Whether locale overrides are applicable to the card.
*/
function isLocalizedExpectedValueStep(step: unknown): boolean {
  const action = (step as { action?: string }).action;
  return action === 'assertHtml' || action === 'assertText' || action === 'assertValue';
}

/*
Returns the action for the assertion currently being localized.
---
Inputs: The selected locale-override step index and current case document.
---
Output: The supported assertion action, or no value when no step is selected.
*/
function getLocaleOverrideAction(): 'assertHtml' | 'assertText' | 'assertValue' | undefined {
  if (localeOverrideStepIndex.value === undefined || selectedCase.value === undefined) {
    return undefined;
  }
  const action = (selectedCase.value.steps[localeOverrideStepIndex.value] as { action?: string } | undefined)?.action;
  return action === 'assertHtml' || action === 'assertText' || action === 'assertValue' ? action : undefined;
}

/*
Returns the localized label for the current override value field.
---
Inputs: The assertion action currently being localized.
---
Output: The matching expected-value field label.
*/
function getLocaleOverrideValueLabel(): string {
  const action = getLocaleOverrideAction();
  if (action === 'assertHtml') {
    return t('editor.expectedHtml');
  }
  if (action === 'assertValue') {
    return t('editor.expectedValue');
  }
  return t('editor.expectedText');
}

/*
Returns the required-value feedback for the current override value field.
---
Inputs: The assertion action currently being localized.
---
Output: The matching localized validation message.
*/
function getLocaleOverrideValueValidationMessage(): string {
  const action = getLocaleOverrideAction();
  if (action === 'assertHtml') {
    return t('editor.expectedHtmlRequired');
  }
  if (action === 'assertValue') {
    return t('editor.expectedValueRequired');
  }
  return t('editor.expectedTextRequired');
}

/*
Returns whether the locale-override tab is selected for a step.
---
Inputs: The selected case-step index.
---
Output: Whether the Locale overrides tab is active for that step.
*/
/*
Opens a blank locale-override dialog for one localized assertion step.
---
Inputs: The selected case-step index.
---
Output: A visible locale-override dialog with empty fields.
*/
function addLocaleOverride(index: number): void {
  localeOverrideStepIndex.value = index;
  editingLocaleOverrideLocale.value = undefined;
  localeOverrideLocale.value = '';
  localeOverrideValue.value = '';
  localeOverrideDialogOpen.value = true;
}

/*
Opens a locale-override dialog prefilled from one localized assertion step entry.
---
Inputs: The selected case-step index and locale override.
---
Output: A visible locale-override dialog with existing fields.
*/
function editLocaleOverride(index: number, override: LocaleOverride): void {
  localeOverrideStepIndex.value = index;
  editingLocaleOverrideLocale.value = override.locale;
  localeOverrideLocale.value = override.locale;
  localeOverrideValue.value = override.value;
  localeOverrideDialogOpen.value = true;
}

/*
Saves a locale-override dialog entry to its localized assertion step.
---
Inputs: The selected step index and dialog locale/value fields.
---
Output: An updated step list with one added or changed override.
*/
function saveLocaleOverride(): void {
  if (selectedCase.value === undefined || props.selectedPath === '' || localeOverrideStepIndex.value === undefined) {
    return;
  }
  const step = selectedCase.value.steps[localeOverrideStepIndex.value];
  if (!isLocalizedExpectedValueStep(step)) {
    return;
  }
  const existingOverrides = readExpectedLocaleOverrides(step);
  const replacing = editingLocaleOverrideLocale.value !== undefined;
  const overrides = replacing
    ? existingOverrides.map((override) => override.locale === editingLocaleOverrideLocale.value ? { locale: localeOverrideLocale.value, value: localeOverrideValue.value } : override)
    : [...existingOverrides, { locale: localeOverrideLocale.value, value: localeOverrideValue.value }];
  updateExpectedLocaleOverrides(localeOverrideStepIndex.value, overrides);
}

/*
Requests confirmation before removing one localized assertion locale override.
---
Inputs: The selected case-step index and locale override.
---
Output: A pending locale-override removal confirmation.
*/
function requestLocaleOverrideRemoval(stepIndex: number, override: LocaleOverride): void {
  pendingLocaleOverrideRemoval.value = { locale: override.locale, stepIndex };
}

/*
Removes a confirmed locale override from its localized assertion step.
---
Inputs: The pending locale-override removal selection.
---
Output: An updated step list without that override.
*/
function confirmLocaleOverrideRemoval(): void {
  if (selectedCase.value !== undefined && props.selectedPath && pendingLocaleOverrideRemoval.value !== undefined) {
    const { locale, stepIndex } = pendingLocaleOverrideRemoval.value;
    const step = selectedCase.value.steps[stepIndex];
    if (isLocalizedExpectedValueStep(step)) {
      updateExpectedLocaleOverrides(stepIndex, readExpectedLocaleOverrides(step).filter((override) => override.locale !== locale));
    }
  }
  pendingLocaleOverrideRemoval.value = undefined;
}

/*
Replaces one localized assertion step's locale override map without changing other data.
---
Inputs: Case-step index and complete override entries.
---
Output: An updated case-step list for the owning bundle.
*/
function updateExpectedLocaleOverrides(index: number, overrides: LocaleOverride[]): void {
  if (selectedCase.value === undefined || props.selectedPath === '') {
    return;
  }
  const step = selectedCase.value.steps[index];
  if (!isLocalizedExpectedValueStep(step)) {
    return;
  }
  const expected = (step as { expected?: { default?: string } }).expected;
  if (expected?.default === undefined) {
    return;
  }
  const locales = Object.fromEntries(overrides.map((override) => [override.locale, override.value]));
  const nextExpected = Object.keys(locales).length === 0 ? { default: expected.default } : { default: expected.default, locales };
  const steps = selectedCase.value.steps.map((candidate, candidateIndex) => candidateIndex === index ? { ...(candidate as Record<string, unknown>), expected: nextExpected } : candidate);
  emit('update:steps', props.selectedPath, steps);
}

/*
Returns a canonical locale when the browser recognizes the supplied tag.
---
Inputs: A raw locale tag.
---
Output: A canonical locale code or no value for an invalid tag.
*/
function getCanonicalLocale(locale: string): string | undefined {
  try {
    return Intl.getCanonicalLocales(locale)[0];
  } catch {
    return undefined;
  }
}

/*
Returns the override selected by the plan's configured locale.
---
Inputs: A raw localized assertion step and the current plan locale.
---
Output: The matching override, or no value when the default applies.
*/
function getConfiguredLocaleOverride(step: unknown): LocaleOverride | undefined {
  const planLocale = getCanonicalLocale(props.planLocale);
  if (planLocale === undefined) {
    return undefined;
  }
  return readExpectedLocaleOverrides(step).find((override) => getCanonicalLocale(override.locale) === planLocale);
}

/*
Returns whether one locale override matches the configured Plan Locale.
---
Inputs: A locale override from a localized assertion step.
---
Output: Whether that override is active for the configured plan.
*/
function isConfiguredLocaleOverride(override: LocaleOverride): boolean {
  const overrideLocale = getCanonicalLocale(override.locale);
  const planLocale = getCanonicalLocale(props.planLocale);
  return overrideLocale !== undefined && planLocale !== undefined && overrideLocale === planLocale;
}

/*
Returns the default expected value from a localized assertion step.
---
Inputs: A raw Assert text step.
---
Output: The authored default expected text.
*/
function getExpectedDefaultValue(step: unknown): string {
  return (step as { expected?: { default?: string } }).expected?.default ?? '';
}

/*
Opens an empty Assert HTML-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Assert HTML-step dialog for a new step.
*/
function addAssertHtmlStep(): void {
  editingAssertHtmlIndex.value = undefined;
  assertHtmlRole.value = '';
  assertHtmlName.value = '';
  assertHtmlExpected.value = '';
  assertHtmlLocaleOverrides.value = [];
  assertHtmlRoleBlurred.value = false;
  assertHtmlExpectedBlurred.value = false;
  assertHtmlDialogOpen.value = true;
}

/*
Saves the valid Assert HTML-step fields to the selected case document.
---
Inputs: The current Assert HTML-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveAssertHtmlStep(): void {
  if (assertHtmlRoleValidationMessage.value !== undefined || assertHtmlExpectedValidationMessage.value !== undefined) {
    assertHtmlRoleBlurred.value = true;
    assertHtmlExpectedBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = assertHtmlName.value.trim() ? { name: assertHtmlName.value.trim(), role: assertHtmlRole.value.trim() } : { role: assertHtmlRole.value.trim() };
    const locales = Object.fromEntries(assertHtmlLocaleOverrides.value.map((override) => [override.locale, override.value]));
    const expected = Object.keys(locales).length === 0 ? { default: assertHtmlExpected.value } : { default: assertHtmlExpected.value, locales };
    const step = preserveEditedStepTimeout(editingAssertHtmlIndex.value, { action: 'assertHtml', expected, locator });
    const steps = editingAssertHtmlIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingAssertHtmlIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Assert HTML dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Assert HTML dialog.
---
Output: Blank fields and hidden validation feedback.
*/
function resetAssertHtmlDialog(): void {
  assertHtmlRole.value = '';
  assertHtmlName.value = '';
  assertHtmlExpected.value = '';
  assertHtmlLocaleOverrides.value = [];
  assertHtmlRoleBlurred.value = false;
  assertHtmlExpectedBlurred.value = false;
}

/*
Opens an empty Assert value-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Assert value-step dialog for a new step.
*/
function addAssertValueStep(): void {
  editingAssertValueIndex.value = undefined;
  assertValueRole.value = '';
  assertValueName.value = '';
  assertValueExpected.value = '';
  assertValueLocaleOverrides.value = [];
  assertValueRoleBlurred.value = false;
  assertValueExpectedBlurred.value = false;
  assertValueDialogOpen.value = true;
}

/*
Saves the valid Assert value-step fields to the selected case document.
---
Inputs: The current Assert value-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveAssertValueStep(): void {
  if (assertValueRoleValidationMessage.value !== undefined || assertValueExpectedValidationMessage.value !== undefined) {
    assertValueRoleBlurred.value = true;
    assertValueExpectedBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = assertValueName.value.trim() ? { name: assertValueName.value.trim(), role: assertValueRole.value.trim() } : { role: assertValueRole.value.trim() };
    const locales = Object.fromEntries(assertValueLocaleOverrides.value.map((override) => [override.locale, override.value]));
    const expected = Object.keys(locales).length === 0 ? { default: assertValueExpected.value } : { default: assertValueExpected.value, locales };
    const step = preserveEditedStepTimeout(editingAssertValueIndex.value, { action: 'assertValue', expected, locator });
    const steps = editingAssertValueIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingAssertValueIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Assert value dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Assert value dialog.
---
Output: Blank fields and hidden validation feedback.
*/
function resetAssertValueDialog(): void {
  assertValueRole.value = '';
  assertValueName.value = '';
  assertValueExpected.value = '';
  assertValueLocaleOverrides.value = [];
  assertValueRoleBlurred.value = false;
  assertValueExpectedBlurred.value = false;
}

/*
Opens an empty Fill-step dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Fill-step dialog for a new step.
*/
function addFillStep(): void {
  editingFillIndex.value = undefined;
  fillRole.value = '';
  fillName.value = '';
  fillValue.value = '';
  fillRoleBlurred.value = false;
  fillValueBlurred.value = false;
  fillDialogOpen.value = true;
}

/*
Saves the valid Fill-step fields to the selected case document.
---
Inputs: The current Fill-step dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveFillStep(): void {
  if (fillRoleValidationMessage.value !== undefined || fillValueValidationMessage.value !== undefined) {
    fillRoleBlurred.value = true;
    fillValueBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = fillName.value.trim() ? { name: fillName.value.trim(), role: fillRole.value.trim() } : { role: fillRole.value.trim() };
    const step = preserveEditedStepTimeout(editingFillIndex.value, { action: 'fill', locator, value: fillValue.value });
    const steps = editingFillIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingFillIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Fill dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Fill dialog.
---
Output: Blank fields and hidden validation feedback.
*/
function resetFillDialog(): void {
  fillRole.value = '';
  fillName.value = '';
  fillValue.value = '';
  fillRoleBlurred.value = false;
  fillValueBlurred.value = false;
}

/*
Opens an empty Select option dialog for the selected case document.
---
Inputs: The selected case reference.
---
Output: A visible Select option dialog for a new step.
*/
function addSelectOptionStep(): void {
  editingSelectOptionIndex.value = undefined;
  selectOptionRole.value = '';
  selectOptionName.value = '';
  selectOptionSelection.value = '';
  selectOptionMode.value = 'value';
  selectOptionRoleBlurred.value = false;
  selectOptionSelectionBlurred.value = false;
  selectOptionDialogOpen.value = true;
}

/*
Saves the valid Select option fields to the selected case document.
---
Inputs: The current Select option dialog state.
---
Output: An updated case-step list or visible validation feedback.
*/
function saveSelectOptionStep(): void {
  if (selectOptionRoleValidationMessage.value !== undefined || selectOptionSelectionValidationMessage.value !== undefined) {
    selectOptionRoleBlurred.value = true;
    selectOptionSelectionBlurred.value = true;
    return;
  }
  if (selectedCase.value !== undefined && props.selectedPath) {
    const locator = selectOptionName.value.trim() ? { name: selectOptionName.value.trim(), role: selectOptionRole.value.trim() } : { role: selectOptionRole.value.trim() };
    const selection = selectOptionMode.value === 'value' ? { value: selectOptionSelection.value } : { label: selectOptionSelection.value };
    const step = preserveEditedStepTimeout(editingSelectOptionIndex.value, { action: 'selectOption', locator, ...selection });
    const steps = editingSelectOptionIndex.value === undefined ? [...selectedCase.value.steps, step] : selectedCase.value.steps.map((candidate, index) => index === editingSelectOptionIndex.value ? step : candidate);
    emit('update:steps', props.selectedPath, steps);
  }
}

/*
Resets Select option dialog fields and visible validation to their new-step defaults.
---
Inputs: A Reset action in the Select option dialog.
---
Output: Blank fields, Value selection mode, and hidden validation feedback.
*/
function resetSelectOptionDialog(): void {
  selectOptionRole.value = '';
  selectOptionName.value = '';
  selectOptionSelection.value = '';
  selectOptionMode.value = 'value';
  selectOptionRoleBlurred.value = false;
  selectOptionSelectionBlurred.value = false;
}

/*
Identifies which dedicated step-details component renders a raw step.
---
Inputs: A raw case-step value.
---
Output: Its action identifier, or Navigate as the legacy display fallback.
*/
function getStepAction(step: unknown): string {
  return (step as { action?: string }).action ?? 'navigate';
}

/*
Returns the localized header label for a supported authored step.
---
Inputs: A raw case-step value.
---
Output: The action label shown in the step card header.
*/
function getStepActionLabel(step: unknown): string {
  const action = getStepAction(step);
  if (action === 'assertValue') {
    return t('editor.assertValue');
  }
  if (action === 'assertHtml') {
    return t('editor.assertHtml');
  }
  if (action === 'assertText') {
    return t('editor.assertText');
  }
  if (action === 'click') {
    return t('editor.click');
  }
  if (action === 'type') {
    return t('editor.type');
  }
  if (action === 'fill') {
    return t('editor.fill');
  }
  if (action === 'selectOption') {
    return t('editor.selectOption');
  }
  return t('editor.navigate');
}

/*
Opens the matching editor for an existing supported case step.
---
Inputs: A step index and raw step value.
---
Output: A visible editor with current step values.
*/
function editStep(index: number, step: unknown): void {
  if ((step as { action?: string }).action === 'assertValue') {
    editingAssertValueIndex.value = index;
    assertValueRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertValueName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertValueExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertValueLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertValueRoleBlurred.value = false;
    assertValueExpectedBlurred.value = false;
    assertValueDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'assertHtml') {
    editingAssertHtmlIndex.value = index;
    assertHtmlRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertHtmlName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertHtmlExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertHtmlLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertHtmlRoleBlurred.value = false;
    assertHtmlExpectedBlurred.value = false;
    assertHtmlDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'assertText') {
    editingAssertTextIndex.value = index;
    assertTextRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertTextName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertTextExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertTextLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertTextRoleBlurred.value = false;
    assertTextExpectedBlurred.value = false;
    assertTextDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'click') {
    editingClickIndex.value = index;
    clickRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    clickName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    clickRoleBlurred.value = false;
    clickDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'type') {
    editingTypeIndex.value = index;
    typeRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    typeName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    typeText.value = (step as { text?: string }).text ?? '';
    typeRoleBlurred.value = false;
    typeTextBlurred.value = false;
    typeDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'fill') {
    editingFillIndex.value = index;
    fillRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    fillName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    fillValue.value = (step as { value?: string }).value ?? '';
    fillRoleBlurred.value = false;
    fillValueBlurred.value = false;
    fillDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'selectOption') {
    editingSelectOptionIndex.value = index;
    selectOptionRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    selectOptionName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    selectOptionMode.value = (step as { value?: string }).value === undefined ? 'label' : 'value';
    selectOptionSelection.value = (step as { label?: string; value?: string }).value ?? (step as { label?: string }).label ?? '';
    selectOptionRoleBlurred.value = false;
    selectOptionSelectionBlurred.value = false;
    selectOptionDialogOpen.value = true;
    return;
  }
  editNavigateStep(index, step);
}

/*
Opens a new-step editor prefilled from a supported case step.
---
Inputs: A raw step value to clone.
---
Output: A visible new-step editor with carried-forward values.
*/
function cloneStep(step: unknown): void {
  if ((step as { action?: string }).action === 'assertValue') {
    editingAssertValueIndex.value = undefined;
    assertValueRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertValueName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertValueExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertValueLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertValueRoleBlurred.value = false;
    assertValueExpectedBlurred.value = false;
    assertValueDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'assertHtml') {
    editingAssertHtmlIndex.value = undefined;
    assertHtmlRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertHtmlName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertHtmlExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertHtmlLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertHtmlRoleBlurred.value = false;
    assertHtmlExpectedBlurred.value = false;
    assertHtmlDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'assertText') {
    editingAssertTextIndex.value = undefined;
    assertTextRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    assertTextName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    assertTextExpected.value = (step as { expected?: { default?: string } }).expected?.default ?? '';
    assertTextLocaleOverrides.value = readExpectedLocaleOverrides(step);
    assertTextRoleBlurred.value = false;
    assertTextExpectedBlurred.value = false;
    assertTextDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'click') {
    editingClickIndex.value = undefined;
    clickRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    clickName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    clickRoleBlurred.value = false;
    clickDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'type') {
    editingTypeIndex.value = undefined;
    typeRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    typeName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    typeText.value = (step as { text?: string }).text ?? '';
    typeRoleBlurred.value = false;
    typeTextBlurred.value = false;
    typeDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'fill') {
    editingFillIndex.value = undefined;
    fillRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    fillName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    fillValue.value = (step as { value?: string }).value ?? '';
    fillRoleBlurred.value = false;
    fillValueBlurred.value = false;
    fillDialogOpen.value = true;
    return;
  }
  if ((step as { action?: string }).action === 'selectOption') {
    editingSelectOptionIndex.value = undefined;
    selectOptionRole.value = (step as { locator?: { role?: string } }).locator?.role ?? '';
    selectOptionName.value = (step as { locator?: { name?: string } }).locator?.name ?? '';
    selectOptionMode.value = (step as { value?: string }).value === undefined ? 'label' : 'value';
    selectOptionSelection.value = (step as { label?: string; value?: string }).value ?? (step as { label?: string }).label ?? '';
    selectOptionRoleBlurred.value = false;
    selectOptionSelectionBlurred.value = false;
    selectOptionDialogOpen.value = true;
    return;
  }
  editingStepIndex.value = undefined;
  navigateUrl.value = (step as { url?: string }).url ?? '';
  navigateUrlBlurred.value = false;
  navigateDialogOpen.value = true;
}

/*
Opens a confirmation dialog before removing a selected step.
---
Inputs: The index of the selected case step.
---
Output: A pending step-removal confirmation.
*/
function requestStepRemoval(index: number): void {
  pendingStepRemoval.value = index;
}

/*
Removes the confirmed step from the selected case document.
---
Inputs: A confirmed pending step index.
---
Output: A step-removal event for the owning bundle.
*/
function confirmStepRemoval(): void {
  if (pendingStepRemoval.value !== undefined && props.selectedPath) {
    emit('remove:step', props.selectedPath, pendingStepRemoval.value);
  }
  pendingStepRemoval.value = undefined;
}

/*
Moves one selected case step by one position.
---
Inputs: The current step index and an adjacent movement direction.
---
Output: A reordered step list for the selected case document.
*/
function moveStep(index: number, direction: -1 | 1): void {
  if (selectedCase.value !== undefined && props.selectedPath) {
    emit('update:steps', props.selectedPath, moveCaseStep(selectedCase.value.steps, index, index + direction));
  }
}

/*
Retains an existing step timeout when an action-specific dialog saves an edit.
---
Inputs: An optional edited step index and replacement action data.
---
Output: Replacement action data carrying the prior timeout when one exists.
*/
function preserveEditedStepTimeout(index: number | undefined, step: Record<string, unknown>): Record<string, unknown> {
  if (index === undefined || selectedCase.value === undefined) {
    return step;
  }
  const currentStep = selectedCase.value.steps[index];
  if (typeof currentStep !== 'object' || currentStep === null || !('timeout' in currentStep)) {
    return step;
  }
  return { ...step, timeout: (currentStep as { timeout: unknown }).timeout };
}

/*
Updates or clears one step timeout without changing its action data.
---
Inputs: A step index and raw timeout value from its card.
---
Output: An updated case-step list with an optional timeout property.
*/
function changeStepTimeout(index: number, timeout: number | string): void {
  if (selectedCase.value === undefined || props.selectedPath === '') {
    return;
  }
  const currentStep = selectedCase.value.steps[index];
  const steps = updateCaseStepTimeout(selectedCase.value.steps, index, timeout);
  const updatedStep = steps[index];
  if (typeof currentStep === 'object' && currentStep !== null && typeof updatedStep === 'object' && updatedStep !== null) {
    const key = stepKeys.get(toRaw(currentStep));
    if (key !== undefined) {
      stepKeys.set(toRaw(updatedStep), key);
    }
  }
  emit('update:steps', props.selectedPath, steps);
}

/*
Returns the step-detail component for an authored action.
---
Inputs: A raw case-step value.
---
Output: The component that renders that step's card.
*/
function getStepDetailComponent(step: unknown) {
  const action = getStepAction(step);
  if (action === 'click') return ClickStepDetails;
  if (action === 'type') return TypeStepDetails;
  if (action === 'fill') return FillStepDetails;
  if (action === 'selectOption') return SelectOptionStepDetails;
  if (action === 'assertText') return AssertTextStepDetails;
  if (action === 'assertHtml') return AssertHtmlStepDetails;
  if (action === 'assertValue') return AssertValueStepDetails;
  return NavigateStepDetails;
}

/*
Returns sorted locale overrides annotated for the configured plan locale.
---
Inputs: A raw localized assertion step.
---
Output: Display-ready locale override values.
*/
function getLocaleOverrideItems(step: unknown): Array<LocaleOverride & { active: boolean }> {
  return getSortedExpectedLocaleOverrides(step).map((override) => ({ ...override, active: isConfiguredLocaleOverride(override) }));
}

/*
Returns a stable local key for an authored step object.
---
Inputs: A raw case-step value.
---
Output: A component-local key that survives a reordered step list.
*/
function getStepKey(step: unknown): string {
  if (typeof step !== 'object' || step === null) {
    return `invalid-${String(step)}`;
  }
  const rawStep = toRaw(step);
  let key = stepKeys.get(rawStep);
  if (key === undefined) {
    key = nextStepKey;
    nextStepKey += 1;
    stepKeys.set(rawStep, key);
  }
  return `step-${key}`;
}

/*
Opens one step in its own route without intercepting an editor control.
---
Inputs: The selected step index and its click event.
---
Output: Navigation to the matching step route.
*/
function openStep(index: number, event: MouseEvent): void {
  if ((event.target as HTMLElement).closest('button, input, select, textarea, a')) {
    return;
  }
  void router.push({ name: 'step', params: { cardIndex: props.caseIndex, stepIndex: index } });
}
</script>

<template>
  <section
    v-if="selectedCase"
    :aria-label="t('editor.caseDetails')"
  >
    <div
      v-if="invalidStepIndexes.length > 0"
      class="alert alert-danger"
      role="alert"
    >{{ t('editor.invalidStepSummary', { count: invalidStepIndexes.length }) }}</div>
    <h2
      id="case-references-heading"
      class="h3 my-3"
    >{{ t('editor.steps') }}</h2>
    <IconOnlyButton
      v-if="editing && route.name !== 'step'"
      class="btn btn-outline-secondary mb-3"
      icon="fa-solid fa-plus"
      :label="t('editor.add')"
      @click="stepChooserOpen = true"
    />
    <p
      v-if="selectedCase.steps.length === 0"
      class="mb-0 text-body-secondary"
    >{{ t('editor.caseStepCount', { count: 0 }) }}</p>
    <div
      v-else
      ref="stepCardList"
      class="step-card-list"
    >
      <TransitionGroup
        name="step"
        tag="div"
        class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3"
      >
        <div
          v-for="item in displayedSteps"
          :key="getStepKey(item.step)"
          class="col"
          @click="openStep(item.index, $event)"
        >
          <component
            :is="getStepDetailComponent(item.step)"
            :action-label="getStepActionLabel(item.step)"
            :editing="editing"
            :effective-locale="getConfiguredLocaleOverride(item.step)?.locale ?? props.planLocale"
            :effective-value="getConfiguredLocaleOverride(item.step)?.value ?? getExpectedDefaultValue(item.step)"
            :has-locale-override="getConfiguredLocaleOverride(item.step) !== undefined"
            :index="item.index"
            :invalid="invalidStepIndexes.includes(item.index)"
            :locale-overrides="getLocaleOverrideItems(item.step)"
            :step="item.step"
            :step-count="selectedCase.steps.length"
            :timeout="typeof item.step === 'object' && item.step !== null ? (item.step as { timeout?: unknown }).timeout : undefined"
            @add-locale-override="addLocaleOverride(item.index)"
            @clone="cloneStep(item.step)"
            @edit="editStep(item.index, item.step)"
            @edit-locale-override="editLocaleOverride(item.index, $event)"
            @move="moveStep(item.index, $event)"
            @remove="requestStepRemoval(item.index)"
            @remove-locale-override="requestLocaleOverrideRemoval(item.index, $event)"
            @update:timeout="changeStepTimeout(item.index, $event)"
          />
        </div>
      </TransitionGroup>
    </div>
    <NavigateStepDialog
      v-if="navigateDialogOpen"
      :url="navigateUrl"
      :validation-issues="navigateValidationIssues"
      :validation-visible="navigateUrlBlurred"
      @blur="navigateUrlBlurred = true"
      @close="navigateDialogOpen = false"
      @reset="resetNavigateDialog"
      @save="saveNavigateStep"
      @update:url="navigateUrl = $event"
    />
    <ClickStepDialog
      v-if="clickDialogOpen"
      :name="clickName"
      :role="clickRole"
      :validation-message="clickRoleValidationMessage"
      :validation-visible="clickRoleBlurred"
      @blur="clickRoleBlurred = true"
      @close="clickDialogOpen = false"
      @reset="resetClickDialog"
      @save="saveClickStep"
      @update:name="clickName = $event"
      @update:role="clickRole = $event"
    />
    <TypeStepDialog
      v-if="typeDialogOpen"
      :name="typeName"
      :role="typeRole"
      :role-validation-message="typeRoleValidationMessage"
      :role-validation-visible="typeRoleBlurred"
      :text="typeText"
      :text-validation-message="typeTextValidationMessage"
      :text-validation-visible="typeTextBlurred"
      @blur:role="typeRoleBlurred = true"
      @blur:text="typeTextBlurred = true"
      @close="typeDialogOpen = false"
      @reset="resetTypeDialog"
      @save="saveTypeStep"
      @update:name="typeName = $event"
      @update:role="typeRole = $event"
      @update:text="typeText = $event"
      @validate="typeRoleBlurred = true; typeTextBlurred = true"
    />
    <FillStepDialog
      v-if="fillDialogOpen"
      :name="fillName"
      :role="fillRole"
      :role-validation-message="fillRoleValidationMessage"
      :role-validation-visible="fillRoleBlurred"
      :value="fillValue"
      :value-validation-message="fillValueValidationMessage"
      :value-validation-visible="fillValueBlurred"
      @blur:role="fillRoleBlurred = true"
      @blur:value="fillValueBlurred = true"
      @close="fillDialogOpen = false"
      @reset="resetFillDialog"
      @save="saveFillStep"
      @update:name="fillName = $event"
      @update:role="fillRole = $event"
      @update:value="fillValue = $event"
      @validate="fillRoleBlurred = true; fillValueBlurred = true"
    />
    <SelectOptionStepDialog
      v-if="selectOptionDialogOpen"
      :name="selectOptionName"
      :role="selectOptionRole"
      :role-validation-message="selectOptionRoleValidationMessage"
      :role-validation-visible="selectOptionRoleBlurred"
      :selection="selectOptionSelection"
      :selection-mode="selectOptionMode"
      :selection-validation-message="selectOptionSelectionValidationMessage"
      :selection-validation-visible="selectOptionSelectionBlurred"
      @blur:role="selectOptionRoleBlurred = true"
      @blur:selection="selectOptionSelectionBlurred = true"
      @close="selectOptionDialogOpen = false"
      @reset="resetSelectOptionDialog"
      @save="saveSelectOptionStep"
      @update:name="selectOptionName = $event"
      @update:role="selectOptionRole = $event"
      @update:selection="selectOptionSelection = $event"
      @update:selection-mode="selectOptionMode = $event"
      @validate="selectOptionRoleBlurred = true; selectOptionSelectionBlurred = true"
    />
    <AssertTextStepDialog
      v-if="assertTextDialogOpen"
      :expected="assertTextExpected"
      :expected-validation-message="assertTextExpectedValidationMessage"
      :expected-validation-visible="assertTextExpectedBlurred"
      :name="assertTextName"
      :role="assertTextRole"
      :role-validation-message="assertTextRoleValidationMessage"
      :role-validation-visible="assertTextRoleBlurred"
      @blur:expected="assertTextExpectedBlurred = true"
      @blur:role="assertTextRoleBlurred = true"
      @close="assertTextDialogOpen = false"
      @reset="resetAssertTextDialog"
      @save="saveAssertTextStep"
      @update:expected="assertTextExpected = $event"
      @update:name="assertTextName = $event"
      @update:role="assertTextRole = $event"
      @validate="assertTextRoleBlurred = true; assertTextExpectedBlurred = true"
    />
    <LocaleOverrideDialog
      v-if="localeOverrideDialogOpen"
      :locale="localeOverrideLocale"
      :multiline="getLocaleOverrideAction() === 'assertHtml'"
      :unavailable-locales="localeOverrideStepIndex === undefined || selectedCase === undefined ? [] : readExpectedLocaleOverrides(selectedCase.steps[localeOverrideStepIndex]).filter((override) => override.locale !== editingLocaleOverrideLocale).map((override) => override.locale)"
      :value="localeOverrideValue"
      :value-label="getLocaleOverrideValueLabel()"
      :value-validation-message="getLocaleOverrideValueValidationMessage()"
      @close="localeOverrideDialogOpen = false"
      @reset="localeOverrideLocale = ''; localeOverrideValue = ''"
      @save="saveLocaleOverride"
      @update:locale="localeOverrideLocale = $event"
      @update:value="localeOverrideValue = $event"
    />
    <AssertHtmlStepDialog
      v-if="assertHtmlDialogOpen"
      :expected="assertHtmlExpected"
      :expected-validation-message="assertHtmlExpectedValidationMessage"
      :expected-validation-visible="assertHtmlExpectedBlurred"
      :name="assertHtmlName"
      :role="assertHtmlRole"
      :role-validation-message="assertHtmlRoleValidationMessage"
      :role-validation-visible="assertHtmlRoleBlurred"
      @blur:expected="assertHtmlExpectedBlurred = true"
      @blur:role="assertHtmlRoleBlurred = true"
      @close="assertHtmlDialogOpen = false"
      @reset="resetAssertHtmlDialog"
      @save="saveAssertHtmlStep"
      @update:expected="assertHtmlExpected = $event"
      @update:name="assertHtmlName = $event"
      @update:role="assertHtmlRole = $event"
      @validate="assertHtmlRoleBlurred = true; assertHtmlExpectedBlurred = true"
    />
    <AssertValueStepDialog
      v-if="assertValueDialogOpen"
      :expected="assertValueExpected"
      :expected-validation-message="assertValueExpectedValidationMessage"
      :expected-validation-visible="assertValueExpectedBlurred"
      :name="assertValueName"
      :role="assertValueRole"
      :role-validation-message="assertValueRoleValidationMessage"
      :role-validation-visible="assertValueRoleBlurred"
      @blur:expected="assertValueExpectedBlurred = true"
      @blur:role="assertValueRoleBlurred = true"
      @close="assertValueDialogOpen = false"
      @reset="resetAssertValueDialog"
      @save="saveAssertValueStep"
      @update:expected="assertValueExpected = $event"
      @update:name="assertValueName = $event"
      @update:role="assertValueRole = $event"
      @validate="assertValueRoleBlurred = true; assertValueExpectedBlurred = true"
    />
    <StepChooserDialog
      v-if="stepChooserOpen"
      @choose="chooseStep"
      @close="stepChooserOpen = false"
    />
    <ConfirmationModal
      v-if="pendingStepRemoval !== undefined"
      :cancel-label="t('editor.cancel')"
      :confirm-label="t('editor.removeCaseReference')"
      :message="t('editor.removeStepConfirmation')"
      :title="t('editor.confirmationTitle')"
      @cancel="pendingStepRemoval = undefined"
      @confirm="confirmStepRemoval"
    />
    <ConfirmationModal
      v-if="pendingLocaleOverrideRemoval !== undefined"
      :cancel-label="t('editor.cancel')"
      :confirm-label="t('editor.remove')"
      :message="t('editor.removeLocaleOverrideConfirmation', { locale: pendingLocaleOverrideRemoval.locale })"
      :title="t('editor.confirmationTitle')"
      @cancel="pendingLocaleOverrideRemoval = undefined"
      @confirm="confirmLocaleOverrideRemoval"
    />
  </section>
</template>

<style scoped>
.step-move {
  transition: transform 180ms ease-in-out;
}

.step-card-list :deep(.card) {
  height: calc(100% - 1rem);
}

.locale-override-active {
  border-top-width: var(--bs-border-width) !important;
  position: relative;
  z-index: 1;
}
</style>
