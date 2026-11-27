<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import TypeStepDetails from './TypeStepDetails.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; step: unknown; stepCount: number; timeout: unknown }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: []; 'update:timeout': [timeout: number | string] }>();
const { t } = useTranslation();

/*
Adapts the selected option for the shared locale-aware preview.
---
Inputs: A Select option step and its Value or Label.
---
Output: An equivalent preview retaining the step's variable scope.
*/
const previewStep = computed(
  () => typeof props.step === 'object' && props.step !== null
    ? { ...props.step, text: (props.step as { value?: unknown; label?: unknown }).value ?? (props.step as { label?: unknown }).label }
    : props.step
);

/*
Identifies whether the selected option is addressed by Value or Label.
---
Inputs: The Select option step.
---
Output: The localized selection field label.
*/
const selectionLabel = computed(
  () => typeof props.step === 'object' && props.step !== null && 'value' in props.step ? t('editor.value') : t('editor.label')
);
</script>

<template>
  <TypeStepDetails
    :action-label="props.actionLabel"
    :editing="props.editing"
    :index="props.index"
    :invalid="props.invalid"
    :selection-label="selectionLabel"
    :step="previewStep"
    :step-count="props.stepCount"
    :timeout="props.timeout"
    @clone="emit('clone')"
    @edit="emit('edit')"
    @move="emit('move', $event)"
    @remove="emit('remove')"
    @update:timeout="emit('update:timeout', $event)"
  />
</template>
