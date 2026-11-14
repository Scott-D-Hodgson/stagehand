<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ step: unknown }>();
const summary = computed(() => {
  const step = props.step as { locator?: { name?: string; role?: string }; text?: string };
  const locator = step.locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  return `${target} → ${step.text ?? ''}`;
});
</script>

<template>
  <div>
    <p class="mb-0 text-body-secondary text-break">{{ summary }}</p>
  </div>
</template>
