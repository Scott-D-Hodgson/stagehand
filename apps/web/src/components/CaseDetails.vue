<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { validateCase } from '@stagehand/plan-schema';
import type { CaseDraft } from '../document/plan-draft';
import ConfirmationModal from './dialogs/ConfirmationModal.vue';
import ClickStepDialog from './dialogs/ClickStepDialog.vue';
import FillStepDialog from './dialogs/FillStepDialog.vue';
import NavigateStepDialog from './dialogs/NavigateStepDialog.vue';
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
const fillDialogOpen = ref(false);
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
const typeRole = ref('');
const typeName = ref('');
const typeText = ref('');
const editingTypeIndex = ref<number | undefined>();
const typeRoleBlurred = ref(false);
const typeTextBlurred = ref(false);
const typeRoleValidationMessage = computed(() => typeRole.value.trim().length === 0 ? t('editor.roleRequired') : undefined);
const typeTextValidationMessage = computed(() => typeText.value.trim().length === 0 ? t('editor.textRequired') : undefined);

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
function chooseStep(action: 'click' | 'fill' | 'navigate' | 'type'): void {
  stepChooserOpen.value = false;
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
Returns the localized action label for a supported authored step.
---
Inputs: A raw case-step value.
---
Output: The action label shown on a step card.
*/
function getStepActionLabel(step: unknown): string {
  const action = (step as { action?: string }).action;
  if (action === 'click') {
    return t('editor.click');
  }
  if (action === 'type') {
    return t('editor.type');
  }
  if (action === 'fill') {
    return t('editor.fill');
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
</script>

<template>
  <section class="card mb-3 shadow-sm" aria-labelledby="case-details-heading">
    <div class="card-body">
      <h2 id="case-details-heading" class="h5">{{ t('editor.caseDetails') }}</h2>
      <template v-if="selectedCase">
        <label class="form-label" for="case-id">{{ t('editor.caseId') }}</label>
        <input id="case-id" :value="selectedCase.id" class="form-control" @input="changeCaseId(($event.target as HTMLInputElement).value)" />
        <div class="border-top mt-4 pt-3">
          <h3 class="h6">{{ t('editor.steps') }}</h3>
          <div v-for="(step, index) in selectedCase.steps" :key="index" class="card mb-3">
            <div class="card-body d-flex justify-content-between align-items-start gap-3">
              <div>
                <p class="mb-1 fw-semibold">{{ index + 1 }}. {{ getStepActionLabel(step) }}</p>
                <p class="mb-0 text-body-secondary text-break">{{ getStepSummary(step) }}</p>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="editStep(index, step)">{{ t('editor.edit') }}</button>
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="cloneStep(step)">{{ t('editor.clone') }}</button>
                <button class="btn btn-outline-danger btn-sm" type="button" @click="requestStepRemoval(index)">{{ t('editor.removeCaseReference') }}</button>
              </div>
            </div>
            <div v-for="issue in caseIssues.filter((candidate) => candidate.path === `/steps/${index}/url`)" :key="issue.path + issue.message" class="card-footer text-danger">{{ issue.message }}</div>
          </div>
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
          <StepChooserDialog v-if="stepChooserOpen" @choose="chooseStep" @close="stepChooserOpen = false" />
          <ConfirmationModal v-if="pendingStepRemoval !== undefined" :cancel-label="t('editor.cancel')" :confirm-label="t('editor.removeCaseReference')" :message="t('editor.removeStepConfirmation')" :title="t('editor.confirmationTitle')" @cancel="pendingStepRemoval = undefined" @confirm="confirmStepRemoval" />
        </div>
      </template>
      <p v-else class="mb-0 text-body-secondary">{{ t('editor.noCaseSelected') }}</p>
    </div>
  </section>
</template>
