<script setup lang="ts">
import LocalizedAssertionStepDetails from './LocalizedAssertionStepDetails.vue';

interface LocaleOverride { active: boolean; locale: string; value: string }

const props = defineProps<{ actionLabel: string; editing: boolean; effectiveLocale: string; effectiveValue: string; hasLocaleOverride: boolean; index: number; invalid: boolean; localeOverrides: LocaleOverride[]; step: unknown; stepCount: number }>();
const emit = defineEmits<{ 'add-locale-override': []; 'edit-locale-override': [override: LocaleOverride]; 'remove-locale-override': [override: LocaleOverride]; clone: []; edit: []; move: [direction: -1 | 1]; remove: [] }>();
</script>

<template>
  <LocalizedAssertionStepDetails v-bind="props" @add-locale-override="emit('add-locale-override')" @clone="emit('clone')" @edit="emit('edit')" @edit-locale-override="emit('edit-locale-override', $event)" @move="emit('move', $event)" @remove="emit('remove')" @remove-locale-override="emit('remove-locale-override', $event)" />
</template>
