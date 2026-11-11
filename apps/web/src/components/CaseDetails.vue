<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { validateCase } from '@stagehand/plan-schema';
import { moveCaseStep, type CaseDraft } from '../document/plan-draft';
import ConfirmationModal from './dialogs/ConfirmationModal.vue';
import AssertHtmlStepDialog from './dialogs/AssertHtmlStepDialog.vue';
import AssertTextStepDialog from './dialogs/AssertTextStepDialog.vue';
import AssertValueStepDialog from './dialogs/AssertValueStepDialog.vue';
import ClickStepDialog from './dialogs/ClickStepDialog.vue';
import FillStepDialog from './dialogs/FillStepDialog.vue';
import NavigateStepDialog from './dialogs/NavigateStepDialog.vue';
import SelectOptionStepDialog from './dialogs/SelectOptionStepDialog.vue';
import StepChooserDialog from './dialogs/StepChooserDialog.vue';
import TypeStepDialog from './dialogs/TypeStepDialog.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  selectedPath: string;
}>();

const emit = defineEmits<{
  'update:case-id': [path: string, id: string];
  'remove:step': [path: string, index: number];
  'update:steps': [path: string, steps: unknown[]];
}>();

const { t } = useTranslation();
const selectedCase = computed(() => props.caseDrafts[props.selectedPath]);
const caseValidation = computed(() => selectedCase.value === undefined ? undefined : validateCase(selectedCase.value));
const caseIssues = computed(() => caseValidation.value?.valid === false ? caseValidation.value.issues : []);
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
const clickRoleValidationMessage = computed(() => clickRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const fillRole = ref('');
const fillName = ref('');
const fillValue = ref('');
const editingFillIndex = ref<number | undefined>();
const fillRoleBlurred = ref(false);
const fillValueBlurred = ref(false);
const fillRoleValidationMessage = computed(() => fillRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const fillValueValidationMessage = computed(() => fillValue.value.trim().length === 0 ? t('editor.valueRequired') : undefined);
const selectOptionRole = ref('');
const selectOptionName = ref('');
const selectOptionSelection = ref('');
const selectOptionMode = ref<'label' | 'value'>('value');
const editingSelectOptionIndex = ref<number | undefined>();
const selectOptionRoleBlurred = ref(false);
const selectOptionSelectionBlurred = ref(false);
const selectOptionRoleValidationMessage = computed(() => selectOptionRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const selectOptionSelectionValidationMessage = computed(() => selectOptionSelection.value.trim().length === 0 ? selectOptionMode.value === 'value' ? t('editor.valueRequired') : t('editor.labelRequired') : undefined);
const typeRole = ref('');
const typeName = ref('');
const typeText = ref('');
const editingTypeIndex = ref<number | undefined>();
const typeRoleBlurred = ref(false);
const typeTextBlurred = ref(false);
const typeRoleValidationMessage = computed(() => typeRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const typeTextValidationMessage = computed(() => typeText.value.trim().length === 0 ? t('editor.textRequired') : undefined);
const assertTextRole = ref('');
const assertTextName = ref('');
const assertTextExpected = ref('');
const editingAssertTextIndex = ref<number | undefined>();
const assertTextRoleBlurred = ref(false);
const assertTextExpectedBlurred = ref(false);
const assertTextRoleValidationMessage = computed(() => assertTextRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const assertTextExpectedValidationMessage = computed(() => assertTextExpected.value.trim().length === 0 ? t('editor.expectedTextRequired') : undefined);
const assertHtmlRole = ref('');
const assertHtmlName = ref('');
const assertHtmlExpected = ref('');
const editingAssertHtmlIndex = ref<number | undefined>();
const assertHtmlRoleBlurred = ref(false);
const assertHtmlExpectedBlurred = ref(false);
const assertHtmlRoleValidationMessage = computed(() => assertHtmlRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const assertHtmlExpectedValidationMessage = computed(() => assertHtmlExpected.value.trim().length === 0 ? t('editor.expectedHtmlRequired') : undefined);
const assertValueRole = ref('');
const assertValueName = ref('');
const assertValueExpected = ref('');
const editingAssertValueIndex = ref<number | undefined>();
const assertValueRoleBlurred = ref(false);
const assertValueExpectedBlurred = ref(false);
const assertValueRoleValidationMessage = computed(() => assertValueRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const assertValueExpectedValidationMessage = computed(() => assertValueExpected.value.trim().length === 0 ? t('editor.expectedValueRequired') : undefined);
const stepKeys = new WeakMap<object, number>();
let nextStepKey = 0;

const navigateUrlBlurred = ref(false);
const navigateValidationIssues = computed(() => {
  if (selectedCase.value === undefined) {
    return [];
  }
  const steps = editingStepIndex.value === undefined
    ? [...selectedCase.value.steps, { action: 'navigate', url: navigateUrl.value }]
    : selectedCase.value.steps.map((step, index) => index === editingStepIndex.value ? { ...(step as Record<string, unknown>), url: navigateUrl.value } : step);
  const validation = validateCase({ ...selectedCase.value, steps });
  return validation.valid ? [] : validation.issues.filter((issue) => issue.path === `/steps/${editingStepIndex.value === undefined ? steps.length - 1 : editingStepIndex.value}/url`);
});

/*
Emits a changed case identifier for the selected case document.
---
Inputs: Raw identifier text entered by the author.
---
Output: A case-ID update for the owning bundle.
*/
function changeCaseId(id: string): void {
  if (props.selectedPath) {
    emit('update:case-id', props.selectedPath, id);
  }
}

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
    const steps = editingClickIndex.value === undefined ? [...selectedCase.value.steps, { action: 'click', locator }] : selectedCase.value.steps.map((step, index) => index === editingClickIndex.value ? { action: 'click', locator } : step);
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
    const step = { action: 'type', locator, text: typeText.value };
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
    const step = { action: 'assertText', expected: { default: assertTextExpected.value }, locator };
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
  assertTextRoleBlurred.value = false;
  assertTextExpectedBlurred.value = false;
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
    const step = { action: 'assertHtml', expected: { default: assertHtmlExpected.value }, locator };
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
    const step = { action: 'assertValue', expected: { default: assertValueExpected.value }, locator };
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
    const step = { action: 'fill', locator, value: fillValue.value };
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
    const step = { action: 'selectOption', locator, ...selection };
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
Returns the localized action label for a supported authored step.
---
Inputs: A raw case-step value.
---
Output: The action label shown on a step card.
*/
function getStepActionLabel(step: unknown): string {
  const action = (step as { action?: string }).action;
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
Returns a concise description for a supported authored step.
---
Inputs: A raw case-step value.
---
Output: A card subtitle describing its target and authored value.
*/
function getStepSummary(step: unknown): string | undefined {
  const action = (step as { action?: string }).action;
  if (action === 'navigate') {
    return (step as { url?: string }).url;
  }
  const locator = (step as { locator?: { name?: string; role?: string } }).locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  if (action === 'type') {
    return `${target} → ${(step as { text?: string }).text ?? ''}`;
  }
  if (action === 'fill') {
    return `${target} → ${(step as { value?: string }).value ?? ''}`;
  }
  if (action === 'selectOption') {
    const selection = step as { label?: string; value?: string };
    return `${target} → ${selection.value === undefined ? t('editor.label') : t('editor.value')}: ${selection.value ?? selection.label ?? ''}`;
  }
  if (action === 'assertText') {
    return `${target} → ${(step as { expected?: { default?: string } }).expected?.default ?? ''}`;
  }
  if (action === 'assertHtml') {
    return `${target} → ${(step as { expected?: { default?: string } }).expected?.default ?? ''}`;
  }
  if (action === 'assertValue') {
    return `${target} → ${(step as { expected?: { default?: string } }).expected?.default ?? ''}`;
  }
  return target;
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
  let key = stepKeys.get(step);
  if (key === undefined) {
    key = nextStepKey;
    nextStepKey += 1;
    stepKeys.set(step, key);
  }
  return `step-${key}`;
}
</script>

<template>
  <section v-if="selectedCase" :aria-label="t('editor.caseDetails')">
    <label class="form-label" for="case-id">
      <span>{{ t('editor.caseIdPrefix') }}</span>
      <abbr :title="t('editor.identifierExpansion')">{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span>
    </label>
    <input id="case-id" :value="selectedCase.id" class="form-control" @input="changeCaseId(($event.target as HTMLInputElement).value)" />
    <div class="border-top mt-4 pt-3">
      <h3 class="h6">{{ t('editor.steps') }}</h3>
      <TransitionGroup name="step" tag="div">
        <div v-for="(step, index) in selectedCase.steps" :key="getStepKey(step)" class="card mb-3">
          <div class="card-body d-flex justify-content-between align-items-start gap-3">
            <div>
              <p class="mb-1 fw-semibold">{{ index + 1 }}. {{ getStepActionLabel(step) }}</p>
              <p class="mb-0 text-body-secondary text-break">{{ getStepSummary(step) }}</p>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-secondary btn-sm"
                type="button"
                :disabled="index === 0"
                @click="moveStep(index, -1)"
              >
                {{ t('editor.moveStepUp') }}
              </button>
              <button
                class="btn btn-outline-secondary btn-sm"
                type="button"
                :disabled="index === selectedCase.steps.length - 1"
                @click="moveStep(index, 1)"
              >
                {{ t('editor.moveStepDown') }}
              </button>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="editStep(index, step)">{{ t('editor.edit') }}</button>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="cloneStep(step)">{{ t('editor.clone') }}</button>
              <button class="btn btn-outline-danger btn-sm" type="button" @click="requestStepRemoval(index)">{{ t('editor.removeCaseReference') }}</button>
            </div>
          </div>
          <div v-for="issue in caseIssues.filter((candidate) => candidate.path === `/steps/${index}/url`)" :key="issue.path + issue.message" class="card-footer text-danger">{{ issue.message }}</div>
        </div>
      </TransitionGroup>
      <button class="btn btn-outline-primary" type="button" @click="stepChooserOpen = true">{{ t('editor.addStep') }}</button>
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
      <StepChooserDialog v-if="stepChooserOpen" @choose="chooseStep" @close="stepChooserOpen = false" />
      <ConfirmationModal v-if="pendingStepRemoval !== undefined" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.removeCaseReference')" :message="t('editor.removeStepConfirmation')" :title="t('editor.confirmationTitle')" @cancel="pendingStepRemoval = undefined" @confirm="confirmStepRemoval" />
    </div>
  </section>
</template>

<style scoped>
.step-move {
  transition: transform 180ms ease-in-out;
}
</style>
