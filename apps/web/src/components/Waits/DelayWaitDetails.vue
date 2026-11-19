<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import type { DelayWaitDraft } from './wait-draft';

const props = defineProps<{ editing: boolean; idPrefix: string; item: DelayWaitDraft }>();
const emit = defineEmits<{ update: [item: DelayWaitDraft] }>();
const { t } = useTranslation();

/*
Reads a numeric field while preserving an empty or invalid value for validation.
---
Inputs: A number-input event.
---
Output: A numeric input value or zero for an empty field.
*/
function readNumber(event: Event): number {
  const value = (event.target as HTMLInputElement).value;
  return value === '' ? 0 : Number(value);
}
</script>

<template>
  <template v-if="props.editing">
    <label class="form-label" :for="`${props.idPrefix}-delay`">{{ t('editor.delayMilliseconds') }}</label>
    <input :id="`${props.idPrefix}-delay`" class="form-control" min="1" max="30000" type="number" :value="props.item.delay" @input="emit('update', { ...props.item, delay: readNumber($event) })" />
    <p class="form-text mb-0">{{ t('editor.delayInvalid') }}</p>
  </template>
  <dl v-else class="mb-0">
    <dt>{{ t('editor.delayMilliseconds') }}</dt>
    <dd class="mb-0">{{ props.item.delay }}</dd>
  </dl>
</template>
