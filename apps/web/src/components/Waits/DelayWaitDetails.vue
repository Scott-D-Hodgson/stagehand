<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { DelayWaitDraft } from './wait-draft';

const props = defineProps<{ editing: boolean; idPrefix: string; item: DelayWaitDraft; validationRequested?: boolean }>();
const emit = defineEmits<{ update: [item: DelayWaitDraft] }>();
const { t } = useTranslation();
const delayWasBlurred = ref(false);

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

/*
Marks the delay field as ready to display validation feedback.
---
Inputs: The Delay field blur event.
---
Output: Enables Delay feedback for the local wait form.
*/
function validateDelay(): void {
  delayWasBlurred.value = true;
}
</script>

<template>
  <template v-if="props.editing">
    <label class="form-label" :for="`${props.idPrefix}-delay`">{{ t('editor.delayMilliseconds') }}</label>
    <input :id="`${props.idPrefix}-delay`" :class="['form-control', { 'is-invalid': (props.validationRequested || delayWasBlurred) && (!Number.isInteger(props.item.delay) || props.item.delay < 1 || props.item.delay > 30_000) }]" min="1" max="30000" type="number" :value="props.item.delay" @blur="validateDelay" @input="emit('update', { ...props.item, delay: readNumber($event) })" />
    <div v-if="(props.validationRequested || delayWasBlurred) && (!Number.isInteger(props.item.delay) || props.item.delay < 1 || props.item.delay > 30_000)" class="invalid-feedback d-block">{{ t('editor.delayInvalid') }}</div>
  </template>
  <dl v-else class="mb-0">
    <dt>{{ t('editor.delayMilliseconds') }}</dt>
    <dd class="mb-0">{{ props.item.delay }}</dd>
  </dl>
</template>
