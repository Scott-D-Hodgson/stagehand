<script setup lang="ts">
import { computed } from 'vue';
import StepCard from '../../StepCard.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; step: unknown; stepCount: number; timeout: unknown }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: []; 'update:timeout': [timeout: number | string] }>();

/*
Determines the locator and text summary for the type step.
---
Inputs: The type step locator and text.
---
Output: A concise description of the configured typing action.
*/
const summary = computed(
  () => {
  const step = props.step as { locator?: { name?: string; role?: string }; text?: string };
  const locator = step.locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  return `${target} → ${step.text ?? ''}`;
  }
);
</script>

<template>
  <StepCard
    :action-label="props.actionLabel"
    :editing="props.editing"
    :index="props.index"
    :invalid="props.invalid"
    :step-count="props.stepCount"
    :timeout="props.timeout"
    @clone="emit('clone')"
    @edit="emit('edit')"
    @move="emit('move', $event)"
    @remove="emit('remove')"
    @update:timeout="emit('update:timeout', $event)"
  >
    <p
      class="mb-0 text-body-secondary text-break"
    >{{ summary }}</p>
  </StepCard>
</template>
