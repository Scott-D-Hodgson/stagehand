<script setup lang="ts">
import { computed } from 'vue';
import TypeStepDetails from './TypeStepDetails.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; step: unknown; stepCount: number; timeout: unknown }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: []; 'update:timeout': [timeout: number | string] }>();

/*
Adapts a Navigate URL for the shared variable-aware card preview.
---
Inputs: The Navigate step and its URL.
---
Output: An equivalent preview retaining the step's variable scope.
*/
const previewStep = computed(
  () => typeof props.step === 'object' && props.step !== null
    ? { ...props.step, text: (props.step as { url?: unknown }).url }
    : props.step
);
</script>

<template>
  <TypeStepDetails
    :action-label="props.actionLabel"
    :editing="props.editing"
    :hide-target="true"
    :index="props.index"
    :invalid="props.invalid"
    :prefix="(props.step as { protocol?: string })?.protocol"
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
