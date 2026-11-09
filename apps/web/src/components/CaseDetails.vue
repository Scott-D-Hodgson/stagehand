<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { CaseDraft } from '../document/plan-draft';

const props = defineProps<{
  caseDrafts: Record<string, CaseDraft>;
  selectedPath: string;
}>();

const emit = defineEmits<{
  'update:case-id': [path: string, id: string];
}>();

const { t } = useTranslation();
const selectedCase = computed(() => props.caseDrafts[props.selectedPath]);

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
</script>

<template>
  <section class="card mb-3 shadow-sm" aria-labelledby="case-details-heading">
    <div class="card-body">
      <h2 id="case-details-heading" class="h5">{{ t('editor.caseDetails') }}</h2>
      <template v-if="selectedCase">
        <label class="form-label" for="case-id">{{ t('editor.caseId') }}</label>
        <input id="case-id" :value="selectedCase.id" class="form-control" @input="changeCaseId(($event.target as HTMLInputElement).value)" />
        <p class="form-text mb-0">{{ t('editor.caseStepsEmpty') }}</p>
      </template>
      <p v-else class="mb-0 text-body-secondary">{{ t('editor.noCaseSelected') }}</p>
    </div>
  </section>
</template>
