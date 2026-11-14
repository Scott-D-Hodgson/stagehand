<script setup lang="ts">
import { computed } from 'vue';
import StepCard from './StepCard.vue';

const props = defineProps<{ actionLabel: string; editing: boolean; index: number; invalid: boolean; step: unknown; stepCount: number }>();
const emit = defineEmits<{ clone: []; edit: []; move: [direction: -1 | 1]; remove: [] }>();
const summary = computed(() => {
  const step = props.step as { locator?: { name?: string; role?: string }; value?: string };
  const locator = step.locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  return `${target} → ${step.value ?? ''}`;
});
</script>

<template>
  <StepCard :action-label="props.actionLabel" :editing="props.editing" :index="props.index" :invalid="props.invalid" :step-count="props.stepCount" @clone="emit('clone')" @edit="emit('edit')" @move="emit('move', $event)" @remove="emit('remove')">
    <p class="mb-0 text-body-secondary text-break">{{ summary }}</p>
  </StepCard>
</template>
