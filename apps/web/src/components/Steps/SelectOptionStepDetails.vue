<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

const props = defineProps<{ step: unknown }>();
const { t } = useTranslation();
const summary = computed(() => {
  const step = props.step as { label?: string; locator?: { name?: string; role?: string }; value?: string };
  const locator = step.locator;
  const target = `${locator?.role ?? ''}${locator?.name ? `: ${locator.name}` : ''}`;
  const selectionLabel = step.value === undefined ? t('editor.label') : t('editor.value');
  return `${target} → ${selectionLabel}: ${step.value ?? step.label ?? ''}`;
});
</script>

<template>
  <div>
    <p class="mb-0 text-body-secondary text-break">{{ summary }}</p>
  </div>
</template>
