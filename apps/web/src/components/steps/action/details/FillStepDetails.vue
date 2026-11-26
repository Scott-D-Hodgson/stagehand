<script setup lang="ts">
import { computed } from 'vue';
import TypeStepDetails from './TypeStepDetails.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; step: unknown; stepCount: number; timeout: unknown }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: []; 'update:timeout': [timeout: number | string] }>();

/*
Adapts the Fill value for the shared text-value preview.
---
Inputs: The Fill step and its Value field.
---
Output: An equivalent preview retaining the step's variable scope.
*/
const previewStep = computed(
  () => typeof props.step === 'object' && props.step !== null
    ? { ...props.step, text: (props.step as { value?: unknown }).value }
    : props.step
);
</script>

<template>
  <TypeStepDetails
    :action-label="props.actionLabel"
    :editing="props.editing"
    :index="props.index"
    :invalid="props.invalid"
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
