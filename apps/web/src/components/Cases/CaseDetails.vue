<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { CaseDraft } from '../../document/plan-draft';
import CaseStepEditor from '../Steps/CaseStepEditor.vue';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  editing: boolean;
  planLocale: string;
  selectedPath: string;
}>();

const emit = defineEmits<{
  'remove:step': [path: string, index: number];
  'update:case-id': [path: string, id: string];
  'update:steps': [path: string, steps: unknown[]];
}>();

const { t } = useTranslation();
const selectedCase = computed(() => props.caseDrafts[props.selectedPath]);

/*
Emits a changed case identifier for the selected case document.
---
Inputs: Raw identifier text entered by the author.
---
Output: A case-ID update for the owning plan bundle.
*/
function changeCaseId(id: string): void {
  if (props.selectedPath) {
    emit('update:case-id', props.selectedPath, id);
  }
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
  <section v-if="selectedCase" :aria-label="t('editor.caseDetails')">
    <label class="form-label" for="case-id">
      <span>{{ t('editor.caseIdPrefix') }}</span>
      <abbr :title="t('editor.identifierExpansion')">{{ t('editor.identifierAbbreviation') }}</abbr><span>{{ t('editor.caseIdSuffix') }}</span>
    </label>
    <input v-if="editing" id="case-id" :value="selectedCase.id" class="form-control" @input="changeCaseId(($event.target as HTMLInputElement).value)" />
    <p v-else class="form-control-plaintext">{{ selectedCase.id }}</p>
    <CaseStepEditor :case-drafts="props.caseDrafts" :editing="props.editing" :plan-locale="props.planLocale" :selected-path="props.selectedPath" @remove:step="removeStep" @update:steps="updateSteps" />
  </section>
</template>
