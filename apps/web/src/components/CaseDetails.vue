<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { validateCase } from '@stagehand/plan-schema';
import type { CaseDraft } from '../document/plan-draft';

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
const visibleNavigateDialogIssues = computed(() => navigateUrlBlurred.value ? navigateValidationIssues.value : []);

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

function editNavigateStep(index: number, step: unknown): void {
  editingStepIndex.value = index;
  navigateUrl.value = (step as { url?: string }).url ?? '';
  navigateUrlBlurred.value = false;
  navigateDialogOpen.value = true;
}

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
  navigateDialogOpen.value = false;
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
              <div><p class="mb-1 fw-semibold">{{ index + 1 }}. {{ t('editor.navigate') }}</p><p class="mb-0 text-body-secondary text-break">{{ (step as { url?: string }).url }}</p></div>
              <div class="d-flex gap-2"><button class="btn btn-outline-secondary btn-sm" type="button" @click="editNavigateStep(index, step)">{{ t('editor.edit') }}</button><button class="btn btn-outline-danger btn-sm" type="button" @click="emit('remove:step', selectedPath, index)">{{ t('editor.removeCaseReference') }}</button></div>
            </div>
            <div v-for="issue in caseIssues.filter((candidate) => candidate.path === `/steps/${index}/url`)" :key="issue.path + issue.message" class="card-footer text-danger">{{ issue.message }}</div>
          </div>
          <button class="btn btn-outline-primary" type="button" @click="addNavigateStep">{{ t('editor.addNavigateStep') }}</button>
          <div v-if="navigateDialogOpen" class="modal d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered"><form class="modal-content" @submit.prevent="saveNavigateStep"><div class="modal-header"><h3 class="h5 modal-title">{{ t('editor.navigate') }}</h3></div><div class="modal-body"><label class="form-label" for="navigate-url">{{ t('editor.navigateUrl') }}</label><input id="navigate-url" v-model="navigateUrl" :class="['form-control', { 'is-invalid': visibleNavigateDialogIssues.length > 0 }]" placeholder="https://example.com" required @blur="navigateUrlBlurred = true" /><div class="form-text">{{ t('editor.navigateUrlHelp') }}</div><div v-for="issue in visibleNavigateDialogIssues" :key="issue.path + issue.message" class="invalid-feedback d-block">{{ issue.message }}</div></div><div class="modal-footer"><button class="btn btn-secondary" type="button" @click="navigateDialogOpen = false">{{ t('editor.cancel') }}</button><button class="btn btn-primary" type="submit">{{ t('editor.save') }}</button></div></form></div>
          </div>
        </div>
      </template>
      <p v-else class="mb-0 text-body-secondary">{{ t('editor.noCaseSelected') }}</p>
    </div>
  </section>
</template>
