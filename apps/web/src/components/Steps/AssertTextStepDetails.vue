<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ effectiveLocale: string; effectiveValue: string; hasLocaleOverride: boolean; step: unknown }>();
const target = computed(() => {
  const locator = (props.step as { locator?: { name?: string; role?: string } }).locator;
  return `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
});
</script>

<template>
  <div>
    <p class="mb-0 text-break">
      <span class="text-body-secondary">{{ target }} → </span>
      <span class="text-primary fw-bold">{{ props.effectiveValue }}</span>
      <span :class="['badge', 'rounded-pill', 'bg-body-secondary', 'border', 'ms-2', 'text-body', { invisible: !props.hasLocaleOverride }]">{{ props.effectiveLocale }}</span>
    </p>
  </div>
</template>
