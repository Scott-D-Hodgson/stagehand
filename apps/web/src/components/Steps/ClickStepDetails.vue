<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ step: unknown }>();
const target = computed(() => {
  const locator = (props.step as { locator?: { name?: string; role?: string } }).locator;
  return `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
});
</script>

<template>
  <div>
    <p class="mb-0 text-body-secondary text-break">{{ target }}</p>
  </div>
</template>
